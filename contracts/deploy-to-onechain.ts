import { SuiClient } from '@onelabs/sui/client';
import { Ed25519Keypair } from '@onelabs/sui/keypairs/ed25519';
import { Transaction } from '@onelabs/sui/transactions';
import * as fs from 'fs';
import * as path from 'path';

const TESTNET_URL = 'https://rpc-testnet.onelabs.cc:443';
const KEYSTORE_PATH = path.join(
    process.env.USERPROFILE || process.env.HOME || '~',
    '.sui', 'sui_config', 'sui.keystore'
);

async function main() {
    console.log('Deploying OneConsensus contracts to OneChain testnet...');

    const client = new SuiClient({ url: TESTNET_URL });
    console.log(`Connected to: ${TESTNET_URL}`);

    // Load keypair from sui keystore
    const keystore = JSON.parse(fs.readFileSync(KEYSTORE_PATH, 'utf8'));
    if (keystore.length === 0) throw new Error('No keypairs in keystore');

    const decoded = Buffer.from(keystore[0], 'base64');
    const secretKey = decoded.slice(1); // skip scheme flag byte
    const keypair = Ed25519Keypair.fromSecretKey(secretKey);
    const address = keypair.getPublicKey().toSuiAddress();
    console.log(`Deployer: ${address}`);

    // Check balance
    const balance = await client.getBalance({ owner: address });
    console.log(`Balance: ${balance.totalBalance} (${parseInt(balance.totalBalance) / 1e9} OCT)`);

    if (parseInt(balance.totalBalance) === 0) {
        console.log('No balance! Requesting from faucet...');
        const faucetResp = await fetch('https://faucet-testnet.onelabs.cc/gas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ FixedAmountRequest: { recipient: address } }),
        });
        const faucetData = await faucetResp.json();
        console.log('Faucet:', JSON.stringify(faucetData));
        // Wait for faucet tx to settle
        await new Promise(r => setTimeout(r, 3000));
    }

    // Read compiled bytecodes
    const bytecodeDir = path.join(__dirname, 'build', 'one_predict_arena', 'bytecode_modules');
    const moduleFiles = fs.readdirSync(bytecodeDir).filter(f => f.endsWith('.mv'));
    const modules = moduleFiles.map(f =>
        fs.readFileSync(path.join(bytecodeDir, f)).toString('base64')
    );
    console.log(`Publishing ${modules.length} modules: ${moduleFiles.join(', ')}`);

    // Create publish transaction
    const tx = new Transaction();
    tx.setGasBudget(200000000); // 0.2 OCT

    const [upgradeCap] = tx.publish({
        modules,
        dependencies: [
            '0x0000000000000000000000000000000000000000000000000000000000000001', // MoveStdlib
            '0x0000000000000000000000000000000000000000000000000000000000000002', // One framework
        ],
    });
    tx.transferObjects([upgradeCap], tx.pure.address(address));

    // Sign and execute
    console.log('Signing and executing...');
    const result = await client.signAndExecuteTransaction({
        signer: keypair,
        transaction: tx,
        options: { showEffects: true, showObjectChanges: true },
    });

    console.log(`TX Digest: ${result.digest}`);

    // Wait for finalization
    console.log('Waiting for finalization...');
    const final = await client.waitForTransaction({
        digest: result.digest,
        options: { showEffects: true, showObjectChanges: true },
    });

    const status = final.effects?.status?.status;
    console.log(`Status: ${status}`);

    if (status === 'success') {
        const published = final.objectChanges?.find((c: any) => c.type === 'published');
        const packageId = (published as any)?.packageId;
        console.log(`\nPACKAGE ID: ${packageId}`);
        console.log(`Explorer: https://onescan.cc/testnet/object/${packageId}`);

        // Save deployment info
        const info = {
            packageId,
            network: 'onechain-testnet',
            rpc: TESTNET_URL,
            deployer: address,
            txDigest: result.digest,
            deployedAt: new Date().toISOString(),
            modules: moduleFiles,
        };
        fs.writeFileSync(
            path.join(__dirname, 'deployment-info.json'),
            JSON.stringify(info, null, 2)
        );
        console.log('Saved deployment-info.json');
    } else {
        console.error('DEPLOYMENT FAILED');
        console.error(JSON.stringify(final.effects, null, 2));
    }
}

main().catch(e => { console.error(e); process.exit(1); });
