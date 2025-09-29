/**
 * Build a lightweight RAG index (TF-IDF, sparse vectors) from content/** and content/settings/*.json
 * Output: public/.rag/index.json with { version, method, builtAt, vocab, df, chunks: [...] }
 * No external API required. If you prefer OpenAI embeddings later, we can add a flag.
 */
/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const ROOT = process.cwd();
const CONTENT_DIR = path.join(ROOT, 'content');
const OUT_DIR = path.join(ROOT, 'public', '.rag');
const OUT_FILE = path.join(OUT_DIR, 'index.json');

// Minimal English stopwords list
const STOP = new Set(
  'a,an,the,and,or,of,to,in,for,on,by,with,as,at,from,that,this,these,those,be,is,are,was,were,has,have,had,do,does,did,not,no,yes,can,could,will,would,should,may,might,about,into,over,under,up,down,if,then,than,so,such,very,more,most,less,least,also,just,it,its,it\'s,they,their,them,we,our,us,you,your,i,me,my,he,him,his,she,her,hers,which,who,whom,what,when,where,why,how'.split(',')
);

function listFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let files = [];
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) files = files.concat(listFiles(p));
    else if (p.endsWith('.md') || p.endsWith('.json')) {
      // Skip underscore-prefixed markdown utility/template files (e.g. _TEMPLATE.md)
      const base = path.basename(p);
      if (base.startsWith('_') && base.endsWith('.md')) continue;
      files.push(p);
    }
  }
  return files;
}

function inferCollection(p) {
  const rel = path.relative(CONTENT_DIR, p).replace(/\\/g, '/');
  if (rel.startsWith('blog/')) return 'blogPost';
  if (rel.startsWith('services/')) return 'service';
  if (rel.startsWith('case-studies/')) return 'caseStudy';
  if (rel.startsWith('testimonials/')) return 'testimonial';
  if (rel === 'about.md') return 'about';
  if (rel.startsWith('settings/')) return 'settings';
  return 'unknown';
}

function extractTitleAndText(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  if (filePath.endsWith('.md')) {
    const { data, content } = matter(raw);
    let title = data?.title || '';
    if (!title) {
      const m = content.match(/^#\s+(.+)$/m);
      if (m) title = m[1].trim();
    }
    const text = content.replace(/\r/g, '').trim();
    return { title: title || path.basename(filePath), text };
  }
  // settings JSON — flatten to readable text
  try {
    const json = JSON.parse(raw);
    const title = path.basename(filePath);
    const text = flattenJson(json);
    return { title, text };
  } catch {
    return { title: path.basename(filePath), text: raw };
  }
}

function flattenJson(obj, prefix = '') {
  let out = '';
  if (obj && typeof obj === 'object') {
    for (const [k, v] of Object.entries(obj)) {
      const keyPath = prefix ? `${prefix}.${k}` : k;
      if (v && typeof v === 'object') out += flattenJson(v, keyPath);
      else out += `${keyPath}: ${String(v)}\n`;
    }
  }
  return out;
}

function chunkMarkdown(text, maxChars = 900, minChars = 400) {
  const paras = text.split(/\n{2,}/);
  const chunks = [];
  let buf = '';
  for (const p of paras) {
    const para = p.trim();
    if (!para) continue;
    if ((buf + '\n\n' + para).length > maxChars) {
      if (buf.length >= minChars) {
        chunks.push(buf.trim());
        buf = para;
      } else {
        // push small buf + para together
        chunks.push((buf + '\n\n' + para).trim());
        buf = '';
      }
    } else {
      buf = buf ? buf + '\n\n' + para : para;
    }
  }
  if (buf) chunks.push(buf.trim());
  // Ensure at least one chunk
  return chunks.length ? chunks : [text.slice(0, maxChars)];
}

function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((t) => t && !STOP.has(t) && t.length > 2);
}

function buildIndex() {
  console.log('🔎 Building RAG index...');
  const files = listFiles(CONTENT_DIR);
  const docs = [];
  for (const file of files) {
    const rel = path.relative(ROOT, file).replace(/\\/g, '/');
    const collection = inferCollection(file);
    if (collection === 'unknown') continue;
    const { title, text } = extractTitleAndText(file);
    const parts = file.endsWith('.md') ? chunkMarkdown(text) : [text];
    parts.forEach((chunkText, i) => {
      docs.push({
        id: `${rel}#${i + 1}`,
        path: rel,
        collection,
        title,
        text: chunkText,
      });
    });
  }
  if (!docs.length) {
    console.warn('No documents found under content/. Creating empty index.');
  }

  // Build vocabulary and document frequencies
  const vocabMap = new Map(); // term -> index
  const dfMap = new Map(); // term -> doc frequency
  const docTokens = [];
  docs.forEach((d) => {
    const tokens = tokenize(d.text);
    docTokens.push(tokens);
    const seen = new Set();
    tokens.forEach((t) => {
      if (!vocabMap.has(t)) vocabMap.set(t, vocabMap.size);
      if (!seen.has(t)) {
        seen.add(t);
        dfMap.set(t, (dfMap.get(t) || 0) + 1);
      }
    });
  });

  // Keep top-N terms by DF to bound index size
  const MAX_VOCAB = 4000;
  const termsSorted = Array.from(dfMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, MAX_VOCAB)
    .map(([t]) => t);
  const termIndex = new Map(termsSorted.map((t, i) => [t, i]));
  const df = termsSorted.map((t) => dfMap.get(t) || 1);
  const N = Math.max(1, docs.length);
  const idf = df.map((d) => Math.log((N + 1) / (d + 1)) + 1);

  // Build sparse TF-IDF vectors
  const chunks = docs.map((d, idx) => {
    const counts = new Map();
    for (const t of docTokens[idx]) {
      const i = termIndex.get(t);
      if (i === undefined) continue;
      counts.set(i, (counts.get(i) || 0) + 1);
    }
    const indices = [];
    const values = [];
    let normSq = 0;
    for (const [i, c] of counts.entries()) {
      const w = (c / docTokens[idx].length) * idf[i]; // tf * idf
      indices.push(i);
      values.push(+w.toFixed(6));
      normSq += w * w;
    }
    const norm = Math.sqrt(normSq) || 1;
    return {
      id: d.id,
      path: d.path,
      title: d.title,
      collection: d.collection,
      text: d.text,
      indices,
      values,
      norm: +norm.toFixed(6),
    };
  });

  fs.mkdirSync(OUT_DIR, { recursive: true });
  const out = {
    version: 1,
    method: 'bow-tfidf',
    builtAt: new Date().toISOString(),
    vocab: termsSorted,
    df,
    chunks,
  };
  fs.writeFileSync(OUT_FILE, JSON.stringify(out, null, 2));
  console.log(`✅ RAG index written: ${path.relative(ROOT, OUT_FILE)} (${chunks.length} chunks, vocab=${termsSorted.length})`);
}

if (require.main === module) {
  try {
    buildIndex();
    process.exit(0);
  } catch (e) {
    console.error('Failed to build RAG index:', e);
    process.exit(1);
  }
}

module.exports = { buildIndex };
