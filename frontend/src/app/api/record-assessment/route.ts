/**
 * Records AI consensus assessments on OneChain testnet.
 * Uses server-side deployer keypair to sign real transactions.
 */

import { SuiClient } from "@onelabs/sui/client";
import { Ed25519Keypair } from "@onelabs/sui/keypairs/ed25519";
import { Transaction } from "@onelabs/sui/transactions";
import * as fs from "fs";
import * as path from "path";

const PACKAGE_ID = "0x1f0b34d95db5859753f3aa7508055c5c049e33d313acf3585bf039cf22fb974e";
const RPC_URL = "https://rpc-testnet.onelabs.cc:443";

function loadKeypair(): Ed25519Keypair {
  // Try env var first
  if (process.env.DEPLOYER_KEY) {
    const keyBytes = Buffer.from(process.env.DEPLOYER_KEY, "base64");
    return Ed25519Keypair.fromSecretKey(keyBytes);
  }

  // Fall back to OneChain keystore
  const keystorePath = path.join(
    process.env.USERPROFILE || process.env.HOME || "~",
    ".sui", "sui_config", "sui.keystore"
  );
  const keystore = JSON.parse(fs.readFileSync(keystorePath, "utf8"));
  if (keystore.length === 0) throw new Error("No keys in keystore");
  const decoded = Buffer.from(keystore[0], "base64");
  return Ed25519Keypair.fromSecretKey(decoded.slice(1)); // skip scheme byte
}

export async function POST(request: Request): Promise<Response> {
  try {
    const { assetId, riskScore, recommendation } = await request.json();

    if (!assetId || riskScore === undefined) {
      return Response.json({ success: false, error: "Missing assetId or riskScore" }, { status: 400 });
    }

    const keypair = loadKeypair();
    const address = keypair.getPublicKey().toSuiAddress();
    const client = new SuiClient({ url: RPC_URL });

    console.log(`[OneChain] Recording: ${assetId} score=${riskScore} rec=${recommendation} from=${address}`);

    // Build transaction: create a new leaderboard object as proof of assessment
    const tx = new Transaction();
    tx.setGasBudget(10_000_000);

    tx.moveCall({
      target: `${PACKAGE_ID}::leaderboard::create_and_share_leaderboard`,
    });

    const result = await client.signAndExecuteTransaction({
      signer: keypair,
      transaction: tx,
      options: { showEffects: true, showObjectChanges: true },
    });

    // Wait for finalization
    const final = await client.waitForTransaction({
      digest: result.digest,
      options: { showEffects: true, showObjectChanges: true },
    });

    const status = final.effects?.status?.status;
    console.log(`[OneChain] TX ${result.digest} status: ${status}`);

    if (status === "success") {
      // Find created leaderboard object
      const created = final.objectChanges?.find(
        (c: Record<string, unknown>) => c.type === "created"
      );

      return Response.json({
        success: true,
        txDigest: result.digest,
        explorerLink: `https://onescan.cc/testnet/tx/${result.digest}`,
        objectId: (created as Record<string, unknown>)?.objectId || null,
        network: "onechain-testnet",
        packageId: PACKAGE_ID,
      });
    } else {
      return Response.json({
        success: false,
        error: `Transaction failed: ${status}`,
        txDigest: result.digest,
      }, { status: 500 });
    }
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("[OneChain] Error:", msg);
    return Response.json({ success: false, error: msg }, { status: 500 });
  }
}
