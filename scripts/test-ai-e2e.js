// End-to-end test hitting the live AI route with agentic retrieval and real OpenAI call
const http = require('http');

function post(path, data){
  return new Promise((resolve,reject)=>{
    const payload = Buffer.from(JSON.stringify(data));
    const req = http.request({
      hostname:'localhost', port:3000, method:'POST', path,
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

(async()=>{
  const payload = {
    collection: 'service',
    topic: 'Lead generation services for small businesses',
    keywords: ['lead generation','B2C','SEO','email marketing'],
    wordCount: 600,
    agentic: true,
    context: { source: 'test' }
  };
  console.log('Posting to /api/tina/ai-generate?debug=1 with agentic retrieval...');
  const r = await post('/api/tina/ai-generate?debug=1', payload);
  if (r.status !== 200) {
    console.error('Request failed:', r.status, r.text || r.json);
    process.exit(1);
  }
  const result = r.json?.result || {};
  const keys = Object.keys(result);
  const body = result.body || result.content || result.markdown || '';
  console.log('Status:', r.status);
  console.log('Keys:', keys);
  console.log('Body preview:', String(body).slice(0, 300).replace(/\n/g,' '));
  // quick shape checks
  if (!keys.length || !body || body.length < 100) {
    console.error('Result looks too small or missing body.');
    process.exit(2);
  }
  console.log('✅ E2E test passed.');
})();
