#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 Analyzing build without TinaCMS...\n');

try {
  // Run build and capture output
  const buildOutput = execSync('ANALYZE=true npx next build', { 
    encoding: 'utf8',
    env: { ...process.env, ANALYZE: 'true' }
  });
  
  console.log('Build completed successfully!\n');
  console.log('📊 BUILD OUTPUT:');
  console.log('='.repeat(50));
  console.log(buildOutput);
  
  // Try to find .next/static/chunks directory
  const chunksDir = path.join(process.cwd(), '.next/static/chunks');
  if (fs.existsSync(chunksDir)) {
    console.log('\n📦 JAVASCRIPT CHUNKS:');
    console.log('='.repeat(50));
    
    const chunks = fs.readdirSync(chunksDir)
      .filter(file => file.endsWith('.js'))
      .map(file => {
        const stats = fs.statSync(path.join(chunksDir, file));
        return {
          name: file,
          size: stats.size,
          sizeKB: (stats.size / 1024).toFixed(2)
        };
      })
      .sort((a, b) => b.size - a.size);
    
    chunks.forEach(chunk => {
      console.log(`${chunk.name}: ${chunk.sizeKB} KB`);
    });
    
    const totalSize = chunks.reduce((sum, chunk) => sum + chunk.size, 0);
    console.log(`\n📊 Total JS: ${(totalSize / 1024).toFixed(2)} KB`);
  }
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
}
