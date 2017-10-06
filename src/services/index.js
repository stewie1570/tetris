import { leaderBoardRestService } from './leader-board'

var wait = () => new Promise(resolve => setTimeout(resolve, 1000));

var leaderBoardServiceStub = {
    get: () => console.log("Reloading leader board...") || wait().then(() => [
        { username: "Stewie", score: 123 },
        { username: "John", score: 100 },
        { username: "Stewie", score: 123 },
        { username: "John", score: 100 },
        { username: "Stewie", score: 123 },
        { username: "John", score: 100 },
        { username: "Stewie", score: 123 },
        { username: "John", score: 100 },
        { username: "Stewie", score: 123 },
        { username: "John", score: 100 },
        { username: "Stewie", score: 123 },
        { username: "John", score: 100 }
    ]),
    postScore: ({ username, score }) => console.log(`User ${username} posted score: ${score}`) || wait()
};

var port = window.location && window.location.port && window.location.port.toString();
var isDev = port === "3000" || port === "8080";

export var leaderBoardService = isDev ? leaderBoardServiceStub : leaderBoardRestService;