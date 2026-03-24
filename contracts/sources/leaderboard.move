module one_predict_arena::leaderboard;

use sui::object::{Self, UID};
use sui::table::{Self, Table};
use sui::transfer;
use sui::tx_context::TxContext;
use sui::event;

const E_PLAYER_NOT_FOUND: u64 = 101;

public struct PlayerStats has store, copy, drop {
    wins: u64,
    losses: u64,
    streak: u64,
    best_streak: u64,
    total_earned: u64,
}

public struct Leaderboard has key {
    id: UID,
    players: Table<address, PlayerStats>,
    total_players: u64,
}

public struct ResultRecorded has copy, drop {
    player: address,
    won: bool,
    amount: u64,
    new_wins: u64,
    new_losses: u64,
}

/// Create and share a leaderboard (entry function for CLI/frontend)
entry fun create_and_share_leaderboard(ctx: &mut TxContext) {
    let leaderboard = Leaderboard {
        id: object::new(ctx),
        players: table::new(ctx),
        total_players: 0,
    };
    transfer::share_object(leaderboard);
}

public fun record_result(
    leaderboard: &mut Leaderboard,
    player: address,
    won: bool,
    amount: u64,
    _ctx: &mut TxContext,
) {
    let has_player = table::contains(&leaderboard.players, player);

    let stats = if (has_player) {
        table::remove(&mut leaderboard.players, player)
    } else {
        leaderboard.total_players = leaderboard.total_players + 1;
        PlayerStats { wins: 0, losses: 0, streak: 0, best_streak: 0, total_earned: 0 }
    };

    let (new_wins, new_losses, new_streak) = if (won) {
        (stats.wins + 1, stats.losses, stats.streak + 1)
    } else {
        (stats.wins, stats.losses + 1, 0)
    };

    let new_best = if (new_streak > stats.best_streak) { new_streak } else { stats.best_streak };

    let updated_stats = PlayerStats {
        wins: new_wins,
        losses: new_losses,
        streak: new_streak,
        best_streak: new_best,
        total_earned: stats.total_earned + amount,
    };

    table::add(&mut leaderboard.players, player, updated_stats);

    event::emit(ResultRecorded {
        player,
        won,
        amount,
        new_wins,
        new_losses,
    });
}

public fun get_stats(leaderboard: &Leaderboard, player: address): PlayerStats {
    *table::borrow(&leaderboard.players, player)
}

public fun player_exists(leaderboard: &Leaderboard, player: address): bool {
    table::contains(&leaderboard.players, player)
}

public fun total_players(leaderboard: &Leaderboard): u64 {
    leaderboard.total_players
}
