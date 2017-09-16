import { leaderBoardRestService } from './leader-board'

var wait = () => new Promise(resolve => setTimeout(resolve, 1000));

var leaderBoardServiceStub = {
    get: () => wait().then(() => [{ username: "Stewie", score: 123 }, { username: "John", score: 100 }])
};

var isDev = window.location && window.location.port && window.location.port.toString() === "3000";

export var leaderBoardService = isDev ? leaderBoardServiceStub : leaderBoardRestService;