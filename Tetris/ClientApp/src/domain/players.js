export const update = players => ({
    with: updatedPlayerIds => [{}, ...updatedPlayerIds]
        .reduce((currentPlayerList, updatedUserId) => ({
            ...currentPlayerList,
            [updatedUserId]: players[updatedUserId] ?? {}
        }))
});
