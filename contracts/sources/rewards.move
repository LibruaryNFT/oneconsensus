module one_predict_arena::rewards;

use sui::coin::{Self, TreasuryCap};
use sui::transfer;
use sui::url;

/// One-time witness for creating the REWARDS coin
public struct REWARDS has drop {}

/// Initialize the ARENA reward token
fun init(witness: REWARDS, ctx: &mut TxContext) {
    let (treasury_cap, metadata) = coin::create_currency(
        witness,
        9,
        b"ARENA",
        b"Arena Token",
        b"Reward token for OneConsensus RWA risk assessments",
        option::some(url::new_unsafe_from_bytes(b"https://oneconsensus.vercel.app")),
        ctx,
    );

    transfer::public_freeze_object(metadata);
    transfer::public_transfer(treasury_cap, ctx.sender());
}

/// Mint reward tokens to a recipient (treasury cap holder only)
public fun mint_reward(
    treasury_cap: &mut TreasuryCap<REWARDS>,
    amount: u64,
    recipient: address,
    ctx: &mut TxContext,
) {
    let coin = coin::mint(treasury_cap, amount, ctx);
    transfer::public_transfer(coin, recipient);
}
