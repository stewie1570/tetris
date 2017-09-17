import { loading } from '../core/constants'

export class AppController {
    constructor(props) {
        this.setState = props.setState;
        this.leaderBoardService = props.leaderBoardService;
    }

    async postScore({ username, score }) {
        return username
            && await this
                .leaderBoardService
                .postScore({ username, score })
                .then(() => this.reloadLeaderBoard());
    }

    async reloadLeaderBoard() {
        try {
            var scoreBoard = await this.leaderBoardService.get();
            this.setState({ scoreBoard });
        }
        catch (ex) {
            this.setState({ scoreBoard: null });
            throw ex;
        }
    };

    async pause({ isPaused }) {
        return isPaused
            ? this.setState({ paused: false, scoreBoard: null })
            : this.setState({ paused: true, scoreBoard: loading }) || await this.reloadLeaderBoard();
    }
}