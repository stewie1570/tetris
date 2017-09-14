export class AppController {
    constructor(props) {
        this.setState = props.setState;
        this.leaderBoardService = props.leaderBoardService;
    }

    async pause() {
        this.setState({ paused: true, scoreBoard: {} });
        
        try {
            this.setState({ scoreBoard: await this.leaderBoardService.get() });
        }
        catch (ex) {
            this.setState({ scoreBoard: undefined });
            throw ex;
        }
    }
}