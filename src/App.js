import React, { Component } from 'react';
import { CommandButton } from './components/command-button'
import { TetrisGame } from './components/tetris-game'
import { AppController } from './controllers/app-controller'
import { leaderBoardService } from './services'
import { loading } from './core/constants'
import './App.css';

class App extends Component {
    constructor() {
        super();

        this.state = { currentScore: 0, oldScore: undefined, paused: false };
        this.controller = new AppController({
            setState: this.setState.bind(this),
            leaderBoardService
        });
    }

    render() {
        return (
            <center>
                <div className="app well">
                    <p>
                        {`Score: ${this.state.currentScore}` + (this.state.oldScore ? ` (Previous: ${this.state.oldScore})` : '')}
                    </p>
                    <div className="game">
                        <TetrisGame
                            onScoreChange={currentScore => this.setState({ currentScore })}
                            onGameOver={oldScore => this.setState({ oldScore, currentScore: 0 })}
                            paused={this.state.paused} />
                        {
                            this.state.scoreBoard && <div className="leader-board">
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
                    </div>
                    <div className="controls">
                        <CommandButton
                            className="btn btn-primary"
                            runningText="Loading Score Board..."
                            onClick={({ target }) => target.blur() || this.controller.pause({ isPaused: this.state.paused })}>
                            {this.state.paused ? "Continue" : "Pause"}
                        </CommandButton>
                    </div>
                </div>
            </center >
        );
    }
}

export default App;
