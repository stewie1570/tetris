import { loading } from '../core/constants'

export class AppController {
    constructor(props) {
        this.setState = props.setState;
        this.leaderBoardService = props.leaderBoardService;
    }

    async postScore({ username, score }) {
        return username && await this.leaderBoardService.postScore({ username, score });
    }

    async pause({ isPaused }) {
        var loadLeaderBoard = async () => {
            try {
                var scoreBoard = await this.leaderBoardService.get();
                this.setState({ scoreBoard });
            }
            catch (ex) {
                this.setState({ scoreBoard: null });
                throw ex;
            }
        };

        return isPaused
            ? this.setState({ paused: false, scoreBoard: null })
            : this.setState({ paused: true, scoreBoard: loading }) || loadLeaderBoard();
    }
}