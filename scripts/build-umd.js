#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Read the source file
const sourcePath = path.join(__dirname, '../lib/csharp-browser-compiler.js');
const sourceCode = fs.readFileSync(sourcePath, 'utf8');

// Create UMD wrapper
const umdWrapper = `(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.CSharpBrowserCompiler = factory());
})(this, (function () { 'use strict';

${sourceCode.replace(/^\/\/ Export for different module systems[\s\S]*$/m, '')}

    return CSharpBrowserCompiler;

}));`;

// Write the UMD version
const outputPath = path.join(__dirname, '../dist/csharp-browser-compiler.umd.js');
fs.writeFileSync(outputPath, umdWrapper);

console.log('UMD build complete: dist/csharp-browser-compiler.umd.js');