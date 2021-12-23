import { tetrisBoardFrom } from "./serialization";

export const update = otherPlayers => ({
    with: updatedPlayerIds => [{}, ...updatedPlayerIds]
        .reduce((currentPlayerList, updatedUser) => {
            const { userId, ...updates } = updatedUser;

            return {
                ...currentPlayerList,
                [userId]: { ...(otherPlayers[userId] ?? {}), ...updates }
            };
        })
});

export const process = userUpdates => ({
    on: userId => ({
        in: otherPlayers => ({
            ...otherPlayers,
            [userId]: {
                ...(otherPlayers[userId] ?? {}),
                ...userUpdates,
                board: userUpdates.board ? tetrisBoardFrom(userUpdates.board) : undefined
            }
        })
    })
});
