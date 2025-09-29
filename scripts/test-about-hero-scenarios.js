/* eslint-disable */
// Scenario tests for About Hero Description with agentic RAG and settings overrides
const http = require('http');
const fs = require('fs');
const path = require('path');

function post(path, data){
  return new Promise((resolve,reject)=>{
    const payload = Buffer.from(JSON.stringify(data));
    const req = http.request({ hostname:'localhost', port:3000, method:'POST', path,
      headers:{'Content-Type':'application/json','Content-Length':payload.length}
    }, res=>{
      let body='';
      res.on('data', c=> body+=c);
      res.on('end', ()=>{
        try{ resolve({status:res.statusCode, json: JSON.parse(body)}) }catch(e){ resolve({status:res.statusCode, text: body}) }
      });
    });
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

function ensureDir(p){ try{ fs.mkdirSync(p, { recursive: true }); }catch{} }

function toPretty(obj){
  try { return JSON.stringify(obj, null, 2); } catch { return String(obj); }
}

async function run(){
  const base = { collection:'about', section:'hero', agentic:true };
  const scenarios = [
    {
      name: 'Baseline',
      body: { ...base, brief: 'Fresh hero for About page.', context: { from:'test-baseline' } }
    },
    {
      name: 'Brand voice shift',
      body: { ...base, brief: 'Same meaning, more direct tone.', settingsOverride: { brandVoice: 'Direct, plain-spoken, no fluff.' } }
    },
    {
      name: 'Keyword emphasis',
      body: { ...base, brief: 'Highlight UK small business growth.', settingsOverride: { seo: { keywordPolicy: { includeAlways: ['small business marketing','lead generation'] } } } }
    },
    {
      name: 'Tighter length target',
      body: { ...base, brief: 'Keep it punchy.', settingsOverride: { seo: { lengthTargets: { about: { heroDescription: { minWords: 18, maxWords: 28 } } } } } }
    },
    {
      name: 'Avoid phrases',
      body: { ...base, brief: 'Keep the tone confident.', settingsOverride: { seo: { keywordPolicy: { avoid: ['game-changer','synergy'] } } } }
    }
  ];

  const started = Date.now();
  const results = [];
  for(const s of scenarios){
    console.log(`\n=== Scenario: ${s.name} ===`);
    const r = await post('/api/tina/ai-generate?debug=1&report=1', s.body);
    if(r.status !== 200){
      console.error('STATUS', r.status, r.text || r.json);
      results.push({ name: s.name, error: { status: r.status, payload: r.text || r.json }, settingsOverride: s.body.settingsOverride || null });
      continue;
    }
    const result = r.json?.result || {};
    const desc = result.heroDescription || '';
    console.log('HeroDescription:', desc);
    const report = r.json?.report || {};
    console.log('Report:', report);
    let reportJson = null;
    try { if (report.jsonPath) { const raw = fs.readFileSync(report.jsonPath, 'utf8'); reportJson = JSON.parse(raw); } } catch(e){ reportJson = { readError: e?.message }; }
    results.push({ name: s.name, heroDescription: desc, settingsOverride: s.body.settingsOverride || null, report, reportJson });
  }

  // Build one extremely detailed group report
  const ended = Date.now();
  const groupDir = path.join(process.cwd(), 'reports', 'ai', 'groups');
  ensureDir(groupDir);
  const stamp = new Date().toISOString().replace(/[:]/g,'-');
  const groupId = `${stamp}_about_hero_scenarios`;
  const groupJsonPath = path.join(groupDir, `${groupId}.json`);
  const groupMdPath = path.join(groupDir, `${groupId}.md`);

  // Compute a baseline for diffs
  const baseline = results.find(r=> r.name === 'Baseline' && r.heroDescription);
  const baselineDesc = baseline?.heroDescription || '';
  function wordCount(s){ return String(s).trim().split(/\s+/).filter(Boolean).length; }

  const group = {
    id: groupId,
    startedAt: started,
    durationMs: ended - started,
    scenarioCount: results.length,
    scenarios: results,
  };
  fs.writeFileSync(groupJsonPath, JSON.stringify(group, null, 2), 'utf8');

  const lines = [];
  lines.push(`# About → Hero: Multi-Scenario Agentic RAG Report`);
  lines.push('');
  lines.push(`- Group ID: ${groupId}`);
  lines.push(`- Started: ${new Date(started).toISOString()}`);
  lines.push(`- Duration: ${ended - started} ms`);
  lines.push(`- Scenarios: ${results.length}`);
  lines.push('');
  if (baselineDesc) {
    lines.push('## Baseline Output');
    lines.push('');
    lines.push(`Words: ${wordCount(baselineDesc)}`);
    lines.push('');
    lines.push('> ' + baselineDesc);
    lines.push('');
  }
  for(const r of results){
    lines.push(`## Scenario — ${r.name}`);
    lines.push('');
    if (r.error){
      lines.push('Error:');
      lines.push('');
      lines.push('```');
      lines.push(toPretty(r.error));
      lines.push('```');
      lines.push('');
      continue;
    }
    const desc = r.heroDescription || '';
    lines.push('### Settings override');
    lines.push('');
    lines.push('```json');
    lines.push(toPretty(r.settingsOverride || {}));
    lines.push('```');
    lines.push('');
    lines.push('### Output');
    lines.push('');
    lines.push(`Words: ${wordCount(desc)}`);
    lines.push('');
    lines.push('> ' + desc);
    lines.push('');
    if (baselineDesc && r.name !== 'Baseline'){
      lines.push('### Quick compare vs Baseline');
      lines.push('');
      lines.push(`Baseline words: ${wordCount(baselineDesc)} | This scenario words: ${wordCount(desc)}`);
      lines.push('');
    }
    // Embed selected report details for full story
    const RJ = r.reportJson || {};
    const settingsSnap = RJ.settings || {};
    const hits = RJ?.retrieval?.hits || [];
    const timeline = RJ.timeline || [];
    lines.push('### Pipeline timeline (first 12 steps)');
    lines.push('');
    for (const ev of timeline.slice(0,12)){
      const dataStr = typeof ev.data === 'string' ? ev.data : (ev.data ? JSON.stringify(ev.data) : '');
      lines.push(`- [${String(ev.at).padStart(5,' ')} ms] ${ev.step}${dataStr ? ' — ' + dataStr : ''}`);
    }
    lines.push('');
    if (hits.length){
      lines.push('### Retrieval hits');
      lines.push('');
      hits.forEach((h,i)=>{ lines.push(`- [${i+1}] ${h.score?.toFixed ? h.score.toFixed(3) : h.score} ${h.path} — ${h.title}`); });
      lines.push('');
    }
    lines.push('### Settings snapshot (from run)');
    lines.push('');
    lines.push('```json');
    lines.push(toPretty(settingsSnap));
    lines.push('```');
    lines.push('');
    if (r.report){
      lines.push(`Report files: ${r.report.jsonPath} | ${r.report.mdPath}`);
      lines.push('');
    }
  }
  fs.writeFileSync(groupMdPath, lines.join('\n'), 'utf8');
  console.log('\n=== Group report created ===');
  console.log('JSON:', groupJsonPath);
  console.log('Markdown:', groupMdPath);
}

run().catch(e=>{ console.error(e); process.exit(1); });
