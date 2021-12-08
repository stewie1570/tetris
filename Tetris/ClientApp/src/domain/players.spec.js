import { update } from './players';

test("players list update will add and remove user IDs to player list object", () => {
    expect(update({
        user1: { name: "User 1" },
        user2: { name: "User 2" }
    }).with(['user1', 'user3'])).toEqual({
        user1: { name: "User 1" },
        user3: {}
    });
})

test("players list update will add players to empty players list", () => {
    expect(update({}).with(['user1', 'user3'])).toEqual({
        user1: {},
        user3: {}
    });
})