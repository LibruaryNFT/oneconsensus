module one_predict_arena::leaderboard;

use one::object::{Self, UID};
use one::table::{Self, Table};
use one::transfer;
use one::tx_context::TxContext;
use one::event;

const E_INVALID_LEADERBOARD: u64 = 100;
const E_PLAYER_NOT_FOUND: u64 = 101;

// Player stats tracked on leaderboard
public struct PlayerStats has store, copy, drop {
    wins: u64,
    losses: u64,
    streak: u64,
    best_streak: u64,
    total_earned: u64,
}

// Leaderboard holding player stats
public struct Leaderboard has key {
    id: UID,
    players: Table<address, PlayerStats>,
    total_players: u64,
}

// Event for recording results
public struct ResultRecorded has copy, drop {
    player: address,
    won: bool,
    amount: u64,
    new_wins: u64,
    new_losses: u64,
}

// Create a new leaderboard
public fun create_leaderboard(ctx: &mut TxContext): Leaderboard {
    Leaderboard {
        id: object::new(ctx),
        players: table::new(ctx),
        total_players: 0,
    }
}

// Record a win or loss
public fun record_result(
    leaderboard: &mut Leaderboard,
    player: address,
    won: bool,
    amount: u64,
    _ctx: &mut TxContext,
) {
    let stats = if (table::contains(&leaderboard.players, &player)) {
        table::remove(&mut leaderboard.players, &player)
    } else {
        PlayerStats {
            wins: 0,
            losses: 0,
            streak: 0,
            best_streak: 0,
            total_earned: 0,
        }
    };

    let (new_wins, new_losses, new_streak) = if (won) {
        let new_w = stats.wins + 1;
        let new_s = stats.streak + 1;
        let new_best = if (new_s > stats.best_streak) new_s else stats.best_streak;
        (new_w, stats.losses, new_s)
    } else {
        (stats.wins, stats.losses + 1, 0)
    };

    let new_earned = stats.total_earned + amount;

    let updated_stats = PlayerStats {
        wins: new_wins,
        losses: new_losses,
        streak: new_streak,
        best_streak: if (new_streak > stats.best_streak) new_streak else stats.best_streak,
        total_earned: new_earned,
    };

    table::add(&mut leaderboard.players, player, updated_stats);

    if (!table::contains(&leaderboard.players, &player)) {
        leaderboard.total_players = leaderboard.total_players + 1;
    };

    event::emit(ResultRecorded {
        player,
        won,
        amount,
        new_wins,
        new_losses,
    });
}

// Get player stats
public fun get_stats(leaderboard: &Leaderboard, player: address): PlayerStats {
    *table::borrow(&leaderboard.players, player)
}

// Check if player exists
public fun player_exists(leaderboard: &Leaderboard, player: address): bool {
    table::contains(&leaderboard.players, &player)
}

// Get total players
public fun total_players(leaderboard: &Leaderboard): u64 {
    leaderboard.total_players
}
