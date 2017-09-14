var wait = () => new Promise(resolve => setTimeout(resolve, 1000));

export var leaderBoardService = {
    get: () => wait().then(() => [{ username: "Stewie", score: 123 }, { username: "John", score: 100 }])
};