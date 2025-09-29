#!/usr/bin/env node
/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

const q = process.argv.slice(2).join(' ');
if (!q) {
  console.error('Usage: node scripts/search-rag.cjs "your query"');
  process.exit(1);
}

function tokenize(text) {
  const STOP = new Set('a,an,the,and,or,of,to,in,for,on,by,with,as,at,from,that,this,these,those,be,is,are,was,were,has,have,had,do,does,did,not,no,yes,can,could,will,would,should,may,might,about,into,over,under,up,down,if,then,than,so,such,very,more,most,less,least,also,just,it,its,it\'s,they,their,them,we,our,us,you,your,i,me,my,he,him,his,she,her,hers,which,who,whom,what,when,where,why,how'.split(','));
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(t => t && !STOP.has(t) && t.length>2);
}

const ROOT = process.cwd();
const file = path.join(ROOT, 'public', '.rag', 'index.json');
const index = JSON.parse(fs.readFileSync(file, 'utf8'));
const terms = tokenize(q);
const counts = new Map();
for (const t of terms) {
  const i = index.vocab.indexOf(t);
  if (i === -1) continue;
  counts.set(i, (counts.get(i)||0) + 1);
}
const N = Math.max(1, index.chunks.length);
const qIndices = [];
const qValues = [];
let qNormSq = 0;
for (const [i, c] of counts.entries()) {
  const idf = Math.log((N + 1) / ((index.df[i] || 0) + 1)) + 1;
  const w = (c / terms.length) * idf;
  qIndices.push(i); qValues.push(w); qNormSq += w*w;
}
const qNorm = Math.sqrt(qNormSq) || 1;

function cosine(indices, values, norm) {
  let dot = 0, a=0, b=0;
  const ia=qIndices, va=qValues, ib=indices, vb=values;
  while(a<ia.length && b<ib.length){
    const ka=ia[a], kb=ib[b];
    if(ka===kb){ dot += va[a]*vb[b]; a++; b++; }
    else if(ka<kb) a++; else b++;
  }
  return dot / (qNorm * (norm || 1));
}

const hits = [];
for (const ch of index.chunks) {
  const score = cosine(ch.indices, ch.values, ch.norm);
  if (score<=0) continue;
  hits.push({score, path: ch.path, title: ch.title, text: ch.text.slice(0,200)+'…'});
}
hits.sort((a,b)=> b.score-a.score);
console.log('Top hits for:', q);
console.log(hits.slice(0,5));
