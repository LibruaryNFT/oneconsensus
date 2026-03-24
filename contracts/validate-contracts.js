#!/usr/bin/env node

/**
 * Validate Move contract syntax and dependencies
 */

const fs = require('fs');
const path = require('path');

function validateMoveFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const issues = [];
  
  // Check for basic Move syntax
  const lines = content.split('\n');
  
  // Check module declaration
  if (!content.includes('module ')) {
    issues.push('Missing module declaration');
  }
  
  // Check for balanced braces
  const openBraces = (content.match(/{/g) || []).length;
  const closeBraces = (content.match(/}/g) || []).length;
  if (openBraces !== closeBraces) {
    issues.push(`Brace mismatch: ${openBraces} open, ${closeBraces} close`);
  }
  
  // Check for use statements
  if (!content.includes('use ')) {
    issues.push('No use statements (may be fine for simple modules)');
  }
  
  return {
    file: path.basename(filePath),
    lines: lines.length,
    valid: issues.length === 0,
    issues
  };
}

console.log('=== Move Contract Validation ===\n');

const contractDir = './sources';
const files = fs.readdirSync(contractDir).filter(f => f.endsWith('.move'));

let allValid = true;

files.forEach(file => {
  const result = validateMoveFile(path.join(contractDir, file));
  
  console.log(`\n${result.file} (${result.lines} lines)`);
  
  if (result.valid) {
    console.log('✅ No syntax issues detected');
  } else {
    console.log('⚠️  Potential issues:');
    result.issues.forEach(issue => console.log(`   - ${issue}`));
    allValid = false;
  }
});

// Check Move.toml
console.log('\n=== Move.toml Validation ===');
const tomlContent = fs.readFileSync('./Move.toml', 'utf8');

if (tomlContent.includes('[package]') && tomlContent.includes('name =')) {
  console.log('✅ Move.toml has correct structure');
} else {
  console.log('❌ Move.toml is malformed');
  allValid = false;
}

if (tomlContent.includes('[dependencies]')) {
  console.log('✅ Dependencies section exists');
  
  if (tomlContent.includes('One =')) {
    console.log('✅ OneChain framework dependency present');
  }
} else {
  console.log('⚠️  No dependencies section');
}

console.log('\n=== Summary ===');
if (allValid) {
  console.log('✅ All contracts appear valid');
  console.log('\nReady for deployment. Run:');
  console.log('  sui move build');
} else {
  console.log('⚠️  Please review issues above before deploying');
}
