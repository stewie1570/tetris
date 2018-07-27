export const firstOf = async (array, predicate) => {
    for (let i = 0; i < array.length; i++) {
        if (await predicate(array[i]))
            return array[i];
    }

    return undefined;
}

export const firstValueFrom = async providers => {
    let result = undefined;
    await firstOf(providers, async provider => {
        const value = await provider();
        result = value;
        return result;
    });

    return result;
}
