import { update, namesAndScoresFrom } from './players';

test("players list update will add and remove user IDs to player list object", () => {
    expect(update({
        user1: { name: "User 1", score: 0 },
        user2: { name: "User 2" }
    }).with([
        { userId: 'user1', name: 'User One' },
        { userId: 'user3', name: 'User Three' }
    ])).toEqual({
        user1: { name: "User One", score: 0 },
        user3: { name: "User Three" }
    });
})

test("players list update will add players to empty players list", () => {
    expect(update({}).with([
        { userId: 'user1' },
        { userId: 'user3' }
    ])).toEqual({
        user1: {},
        user3: {}
    });
})

test("get player names and scores from players object", () => {
    expect(namesAndScoresFrom({
        user1: { name: "User 1", score: 0, board: [] },
        user2: { name: "User 2", score: 1, board: [] }
    })).toEqual({
        user1: { name: "User 1", score: 0 },
        user2: { name: "User 2", score: 1 }
    });
})