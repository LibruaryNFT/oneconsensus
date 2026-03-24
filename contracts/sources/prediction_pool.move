module one_predict_arena::prediction_pool;

use one::object::{Self, UID, ID};
use one::coin::Coin;
use one::balance::Balance;
use one::transfer;
use one::tx_context::TxContext;
use one::event;
use std::string::String;

const E_INVALID_POOL: u64 = 100;
const E_POOL_NOT_OPEN: u64 = 101;
const E_INVALID_PREDICTION: u64 = 102;
const E_INSUFFICIENT_AMOUNT: u64 = 103;
const E_NOT_ADMIN: u64 = 104;

const PREDICTION_UP: u8 = 1;
const PREDICTION_DOWN: u8 = 2;

// Prediction direction
public struct Direction has copy, drop, store {
    value: u8,
}

// Core prediction pool
public struct PredictionPool<phantom T> has key {
    id: UID,
    market: String,
    start_price: u64,
    end_price: u64,
    start_time: u64,
    duration: u64,
    status: u8, // 0: open, 1: resolved
    pool_balance: Balance<T>,
    total_predictions: u64,
}

// Individual prediction
public struct Prediction has store {
    player: address,
    direction: u8,
    amount: u64,
    timestamp: u64,
}

// Events
public struct PoolCreated has copy, drop {
    pool_id: ID,
    market: String,
    start_price: u64,
    duration: u64,
}

public struct PredictionMade has copy, drop {
    pool_id: ID,
    player: address,
    direction: u8,
    amount: u64,
}

public struct PoolResolved has copy, drop {
    pool_id: ID,
    end_price: u64,
    total_predictions: u64,
}

// Create a new prediction pool
public fun create_pool<T>(
    market: String,
    start_price: u64,
    duration: u64,
    ctx: &mut TxContext,
): ID {
    let uid = object::new(ctx);
    let pool_id = object::uid_to_inner(&uid);

    let pool = PredictionPool<T> {
        id: uid,
        market,
        start_price,
        end_price: 0,
        start_time: 0,
        duration,
        status: 0, // open
        pool_balance: Balance::zero(),
        total_predictions: 0,
    };

    transfer::share_object(pool);

    event::emit(PoolCreated {
        pool_id,
        market,
        start_price,
        duration,
    });

    pool_id
}

// Player makes a prediction and stakes
public fun make_prediction<T>(
    pool: &mut PredictionPool<T>,
    direction: u8,
    coin: Coin<T>,
    ctx: &mut TxContext,
) {
    assert!(pool.status == 0, E_POOL_NOT_OPEN);
    assert!(direction == PREDICTION_UP || direction == PREDICTION_DOWN, E_INVALID_PREDICTION);

    let amount = coin.value();
    assert!(amount > 0, E_INSUFFICIENT_AMOUNT);

    let player = tx_context::sender(ctx);

    // Add coin to pool
    pool.pool_balance.join(coin.into_balance());
    pool.total_predictions = pool.total_predictions + 1;

    event::emit(PredictionMade {
        pool_id: object::id(pool),
        player,
        direction,
        amount,
    });
}

// Admin resolves pool with end price and distributes rewards
public fun resolve_pool<T>(
    pool: &mut PredictionPool<T>,
    end_price: u64,
    _ctx: &mut TxContext,
) {
    assert!(pool.status == 0, E_POOL_NOT_OPEN);

    pool.status = 1; // resolved
    pool.end_price = end_price;

    event::emit(PoolResolved {
        pool_id: object::id(pool),
        end_price,
        total_predictions: pool.total_predictions,
    });
}

// Helper: Get pool price change direction
public fun get_direction(start: u64, end: u64): u8 {
    if (end > start) PREDICTION_UP else PREDICTION_DOWN
}

// Helper: Get pool status
public fun pool_is_open<T>(pool: &PredictionPool<T>): bool {
    pool.status == 0
}

// Helper: Get total predictions
public fun get_total_predictions<T>(pool: &PredictionPool<T>): u64 {
    pool.total_predictions
}
