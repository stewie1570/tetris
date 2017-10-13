import React, { Component } from 'react';
import { ErrorMessage } from './components/error-message'
import { CommandButton } from './components/command-button'
import { TetrisGame } from './components/tetris-game'
import { PromptDialog } from './components/prompt-dialog'
import { AppController } from './controllers/app-controller'
import { leaderBoardService } from './services'
import { loading } from './core/constants'
import './App.css';

class App extends Component {
    constructor() {
        super();

        this.state = {
            currentScore: 0,
            oldScore: undefined,
            paused: false,
            mobile: false
        };

        this.controller = new AppController({
            setState: this.setState.bind(this),
            leaderBoardService
        });
    }

    render() {
        var postableScore = this.state.currentScore || this.state.oldScore
        var allowScorePost = this.state.paused && !!postableScore;

        return (
            <div>
                <center>
                    <div className="well app">
                        <p>
                            {`Score: ${this.state.currentScore}` + (this.state.oldScore ? ` (Previous: ${this.state.oldScore})` : '')}
                        </p>
                        <div className="game">
                            <TetrisGame
                                onScoreChange={currentScore => this.setState({ currentScore })}
                                onGameOver={oldScore => this.setState({ oldScore, currentScore: 0 })}
                                paused={this.state.paused}
                                mobile={this.state.mobile} />
                            {
                                this.state.scoreBoard && <div
                                    className="leader-board"
                                    style={{ height: allowScorePost ? "80%" : "100%" }}>
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th>Name</th>
                                                <th>Score</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                this.state.scoreBoard === loading
                                                    ? <tr><td><b>Loading...</b></td></tr>
                                                    : this.state.scoreBoard.map((userScore, index) => <tr key={index}>
                                                        <td>{userScore.username}</td>
                                                        <td>{userScore.score}</td>
                                                    </tr>)
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            }
                            {
                                allowScorePost && <div className="post-my-score">
                                    Would you like to post your score?
                                <CommandButton
                                    className="btn btn-primary post-my-score-button"
                                    runningText="Posting Your Score..."
                                    onClick={({ target }) => target.blur() || this
                                        .prompt
                                        .ask({ message: "What user name would you like?" })
                                        .then(username => this
                                            .controller
                                            .postScore({
                                                username,
                                                score: postableScore
                                            }))
                                    }>
                                    Post My Score ({postableScore})
                                </CommandButton>
                                </div>
                            }
                        </div>
                        <div className="controls">
                            <CommandButton
                                className="btn btn-primary"
                                runningText="Loading Score Board..."
                                onClick={({ target }) => target.blur() || this.controller.pause({ isPaused: this.state.paused })}>
                                {this.state.paused ? "Continue" : "Pause"}
                            </CommandButton>
                            <div>
                                <p />
                                <CommandButton
                                    className="btn btn-primary"
                                    onClick={({ target }) => target.blur() || this.setState({ mobile: !this.state.mobile })}
                                    disabled={this.state.paused}>
                                    {this.state.mobile ? "No Mobile Controls" : "Mobile Controls"}
                                </CommandButton>
                            </div>
                        </div>
                    </div>
                    <PromptDialog ref={ref => this.prompt = ref} />
                </center >
                <ErrorMessage />
            </div>
        );
    }
}

export default App;
