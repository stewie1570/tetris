export const update = players => ({
    with: updatedPlayerIds => [{}, ...updatedPlayerIds]
        .reduce((currentPlayerList, updatedUser) => {
            const { userId, ...updates } = updatedUser;

            return {
                ...currentPlayerList,
                [userId]: { ...(players[userId] ?? {}), ...updates }
            };
        })
});
