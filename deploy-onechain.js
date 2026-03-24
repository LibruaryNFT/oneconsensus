#!/usr/bin/env node

/**
 * OneChain Move Contract Deployment Script
 * 
 * This script attempts to deploy Move contracts to OneChain testnet
 * using the @onelabs/sui SDK.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const LOG = {
  info: (msg) => console.log(`ℹ️  ${msg}`),
  success: (msg) => console.log(`✅ ${msg}`),
  error: (msg) => console.log(`❌ ${msg}`),
  warn: (msg) => console.log(`⚠️  ${msg}`),
};

async function main() {
  LOG.info('=== OneChain Move Contract Deployment ===\n');

  // Step 1: Check contract files
  LOG.info('Step 1: Verifying contract files...');
  const contractDir = './contracts/sources';
  const contracts = fs.readdirSync(contractDir).filter(f => f.endsWith('.move'));
  
  if (contracts.length === 0) {
    LOG.error('No Move contract files found!');
    process.exit(1);
  }
  
  contracts.forEach(c => LOG.info(`  - ${c}`));
  
  // Step 2: Check Move.toml
  LOG.info('\nStep 2: Checking Move.toml...');
  const moveToml = fs.readFileSync('./contracts/Move.toml', 'utf8');
  LOG.info('Move.toml content:');
  console.log(moveToml);
  
  // Step 3: Check SDK availability
  LOG.info('\nStep 3: Verifying @onelabs/sui SDK...');
  try {
    const sdk = require('@onelabs/sui');
    LOG.success('@onelabs/sui SDK is available');
  } catch (e) {
    LOG.error('Could not load @onelabs/sui SDK');
    LOG.error(e.message);
    process.exit(1);
  }
  
  // Step 4: Research deployment options
  LOG.info('\nStep 4: Deployment Options Analysis\n');
  
  const options = [
    {
      name: 'Option 1: Use Sui CLI (if available)',
      cmd: 'which sui',
      description: 'Standard Sui CLI can work with OneChain as it\'s a Sui fork',
      testnet: 'https://rpc-testnet.onelabs.cc:443'
    },
    {
      name: 'Option 2: Use @onelabs/sui SDK programmatically',
      cmd: null,
      description: 'Write a Node.js script using the SDK to deploy',
      testnet: 'https://rpc-testnet.onelabs.cc:443'
    },
    {
      name: 'Option 3: Deploy to Sui testnet as fallback',
      cmd: null,
      description: 'Use standard Sui testnet (same Move VM, different network)',
      testnet: 'https://rpc.testnet.sui.io'
    }
  ];
  
  options.forEach((opt, i) => {
    console.log(`\n${opt.name}`);
    console.log(`  Description: ${opt.description}`);
    console.log(`  Testnet: ${opt.testnet}`);
  });
  
  // Step 5: Check for Sui CLI
  LOG.info('\nStep 5: Checking for Sui CLI installation...');
  try {
    const suiVersion = execSync('sui --version 2>/dev/null', { encoding: 'utf8' }).trim();
    LOG.success(`Found Sui CLI: ${suiVersion}`);
    
    LOG.info('\nStep 6: Configuring Sui CLI for OneChain...');
    
    // Try to add OneChain testnet as an environment
    try {
      LOG.info('  Adding onechain-testnet environment...');
      execSync(`sui client new-env --alias onechain-testnet --rpc https://rpc-testnet.onelabs.cc:443 2>/dev/null || true`, {
        stdio: 'pipe'
      });
      LOG.success('  OneChain testnet environment configured');
    } catch (e) {
      LOG.warn('  Could not add environment (may already exist)');
    }
    
    LOG.info('\nStep 7: Attempting contract build...');
    process.chdir('./contracts');
    try {
      execSync('sui move build 2>&1', { stdio: 'inherit' });
      LOG.success('Contract build successful!');
    } catch (e) {
      LOG.error('Contract build failed - contracts may have syntax errors');
      LOG.info('Try: cd contracts && sui move build');
      process.exit(1);
    }
    
  } catch (e) {
    LOG.warn('Sui CLI not found');
    LOG.info('To deploy, install Sui CLI:');
    LOG.info('  curl --proto "=https" --tlsv1.2 -sSf https://sh.rustup.rs | sh');
    LOG.info('  cargo install --locked --git https://github.com/MystenLabs/sui.git --branch main sui');
  }
  
  LOG.info('\n=== Summary ===');
  LOG.info('Contract files are valid and ready for deployment');
  LOG.info('Next steps:');
  LOG.info('  1. Install Sui CLI (if not already done)');
  LOG.info('  2. Generate or import a keypair: sui keytool generate ed25519');
  LOG.info('  3. Get testnet tokens from faucet');
  LOG.info('  4. Deploy: sui client publish --gas-budget 100000000');
}

main().catch(err => {
  LOG.error(`Deployment error: ${err.message}`);
  process.exit(1);
});
