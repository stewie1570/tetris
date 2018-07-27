import React, { Component } from 'react';
import { ErrorMessage } from './components/error-message'
import { CommandButton } from './components/command-button'
import { TetrisGame } from './components/tetris-game'
import { PromptDialog } from './components/prompt-dialog'
import { AggregateUserNameProvider } from './domain/aggregate-username-provider'
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

        this.userNameProvider = async () => await new AggregateUserNameProvider({
            underlyingProviders: [
                () => this.state.username,
                async () => {
                    const username = await this
                        .prompt
                        .ask({ message: <div>What user name would you like?<br /></div> });
                    
                        this.setState({ username });

                    return username;
                }
            ]
        }).get();

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
                                        onClick={async ({ target }) => target.blur() || this
                                            .controller
                                            .postScore({
                                                username: await this.userNameProvider(),
                                                score: postableScore
                                            })
                                        }>
                                        <span className="glyphicon glyphicon-send">
                                            &nbsp;
                                        </span>
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
                                <span className={`glyphicon glyphicon-${this.state.paused ? "play" : "pause"}`}>
                                    &nbsp;
                                </span>
                                <span>{this.state.paused ? "Continue" : "Pause"}</span>
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
