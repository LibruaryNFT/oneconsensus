module one_predict_arena::rewards;

use one::coin::{Self, Coin};
use one::balance::{Self, Balance};
use one::transfer;
use one::tx_context::TxContext;
use std::option;

const E_NOT_ADMIN: u64 = 100;
const E_INSUFFICIENT_BALANCE: u64 = 101;

// ARENA token for rewards
public struct ARENA has drop {}

// Admin capability for minting
public struct AdminCap has key {
    id: one::object::UID,
}

// Treasury holding mint/burn capabilities
public struct Treasury has key {
    id: one::object::UID,
    supply: Balance<ARENA>,
}

// Initialize the token and mint capabilities
fun init(witness: ARENA, ctx: &mut TxContext) {
    let (treasury, metadata) = coin::create_currency(
        witness,
        9, // decimals
        b"ARENA",
        b"Arena Token",
        b"Reward token for OnePredict Arena battles",
        option::none(),
        ctx,
    );

    let admin = AdminCap {
        id: one::object::new(ctx),
    };

    let treasury_obj = Treasury {
        id: one::object::new(ctx),
        supply: balance::zero(),
    };

    transfer::transfer(admin, tx_context::sender(ctx));
    transfer::share_object(treasury_obj);
    transfer::public_share_object(metadata);
}

// Mint tokens to recipient (admin only)
public fun mint_reward(
    _admin: &AdminCap,
    treasury: &mut Treasury,
    amount: u64,
    recipient: address,
    ctx: &mut TxContext,
) {
    let token = coin::from_balance(
        balance::split(&mut treasury.supply, amount),
        ctx,
    );
    transfer::public_transfer(token, recipient);
}

// Burn tokens
public fun burn_tokens(
    coin: Coin<ARENA>,
    _treasury: &mut Treasury,
    _ctx: &mut TxContext,
) {
    let _ = coin;
}

// Get supply amount
public fun supply(treasury: &Treasury): u64 {
    balance::value(&treasury.supply)
}
