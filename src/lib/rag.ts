/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from 'fs';
import path from 'path';

export type RagIndex = {
  version: number;
  method: 'bow-tfidf';
  builtAt: string;
  vocab: string[];
  df: number[];
  chunks: Array<{
    id: string;
    path: string;
    title: string;
    collection: string;
    text: string;
    indices: number[];
    values: number[];
    norm: number;
  }>;
};

let cached: RagIndex | null = null;

export function loadRagIndex(): RagIndex | null {
  if (cached) return cached;
  try {
    const p = path.join(process.cwd(), 'public', '.rag', 'index.json');
    const raw = fs.readFileSync(p, 'utf8');
    cached = JSON.parse(raw) as RagIndex;
    return cached;
  } catch {
    return null;
  }
}

// Tokenize similar to builder
function tokenize(text: string): string[] {
  const STOP = new Set(
    'a,an,the,and,or,of,to,in,for,on,by,with,as,at,from,that,this,these,those,be,is,are,was,were,has,have,had,do,does,did,not,no,yes,can,could,will,would,should,may,might,about,into,over,under,up,down,if,then,than,so,such,very,more,most,less,least,also,just,it,its,it\'s,they,their,them,we,our,us,you,your,i,me,my,he,him,his,she,her,hers,which,who,whom,what,when,where,why,how'.split(',')
  );
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((t) => t && !STOP.has(t) && t.length > 2);
}

export type SearchOptions = {
  k?: number;
  collection?: string | string[];
  maxCharsPerChunk?: number;
  debug?: boolean;
};

export type SearchHit = {
  id: string;
  path: string;
  title: string;
  collection: string;
  text: string;
  score: number;
};

export function searchRag(query: string, opts: SearchOptions = {}): SearchHit[] {
  const index = loadRagIndex();
  if (!index || !index.vocab?.length || !index.chunks?.length) return [];
  const { k = 4, collection, maxCharsPerChunk = 400, debug = false } = opts;
  const t0 = Date.now();
  const terms = tokenize(query);
  if (!terms.length) return [];
  const vocab = index.vocab;
  const df = index.df;
  const N = Math.max(1, index.chunks.length);
  if (debug || process.env.AI_DEBUG) {
    console.log(`[RAG] query="${query}" terms=${terms.length} k=${k} coll=${Array.isArray(collection)?collection.join(','):collection||'*'}`);
  }

  // Build query sparse vector
  const counts = new Map<number, number>();
  for (const t of terms) {
    const i = vocab.indexOf(t);
    if (i === -1) continue;
    counts.set(i, (counts.get(i) || 0) + 1);
  }
  const qPairs: Array<[number, number]> = [];
  let qNormSq = 0;
  counts.forEach((c, i) => {
    const idf = Math.log((N + 1) / ((df[i] || 0) + 1)) + 1;
    const w = (c / terms.length) * idf;
    qPairs.push([i, w]);
    qNormSq += w * w;
  });
  qPairs.sort((a, b) => a[0] - b[0]);
  const qIndices: number[] = qPairs.map(p => p[0]);
  const qValues: number[] = qPairs.map(p => p[1]);
  const qNorm = Math.sqrt(qNormSq) || 1;

  function cosine(indices: number[], values: number[], norm: number): number {
    // dot product of two sparse vectors sharing the same vocabulary
    let dot = 0;
    let a = 0;
    let b = 0;
    const ia = qIndices;
    const va = qValues;
    const ib = indices;
    const vb = values;
    while (a < ia.length && b < ib.length) {
      const ka = ia[a];
      const kb = ib[b];
      if (ka === kb) {
        dot += va[a] * vb[b];
        a++; b++;
      } else if (ka < kb) a++; else b++;
    }
    return dot / (qNorm * (norm || 1));
  }

  const hits: SearchHit[] = [];
  const collFilter = Array.isArray(collection) ? new Set(collection) : collection ? new Set([collection]) : null;
  for (const ch of index.chunks) {
    if (collFilter && !collFilter.has(ch.collection)) continue;
    const score = cosine(ch.indices, ch.values, ch.norm);
    if (score <= 0) continue;
    const text = ch.text.length > maxCharsPerChunk ? ch.text.slice(0, maxCharsPerChunk) + '…' : ch.text;
    hits.push({ id: ch.id, path: ch.path, title: ch.title, collection: ch.collection, text, score: +score.toFixed(6) });
  }
  hits.sort((a, b) => b.score - a.score);
  const out = hits.slice(0, k);
  if (debug || process.env.AI_DEBUG) {
    const dt = Date.now() - t0;
    console.log(`[RAG] hits=${out.length} in ${dt}ms`);
    out.forEach((h, i) => console.log(`[RAG] [${i+1}] ${h.score.toFixed(3)} ${h.path} — ${h.title}`));
  }
  return out;
}

export function formatCitations(hits: SearchHit[]): string {
  if (!hits.length) return '';
  return hits
    .map((h, i) => `[${i + 1}] ${h.path} — ${h.title}\n${h.text}`)
    .join('\n\n');
}
