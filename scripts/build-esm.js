#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Read the source file
const sourcePath = path.join(__dirname, '../lib/csharp-browser-compiler.js');
const sourceCode = fs.readFileSync(sourcePath, 'utf8');

// Convert to ES modules format
const esmCode = sourceCode
  .replace(/^.*module\.exports.*$/m, '')
  .replace(/^.*define\(.*$/m, '')
  .replace(/^.*window\.CSharpBrowserCompiler.*$/m, '')
  .replace(/^\/\/ Export for different module systems[\s\S]*$/m, '')
  + '\n\nexport default CSharpBrowserCompiler;\n';

// Write the ESM version
const outputPath = path.join(__dirname, '../dist/csharp-browser-compiler.esm.js');
fs.writeFileSync(outputPath, esmCode);

console.log('ESM build complete: dist/csharp-browser-compiler.esm.js');