import React, { Component } from 'react';
import { CommandButton } from './components/command-button'
import { TetrisGame } from './components/TetrisGame'
import './App.css';

class App extends Component {
    constructor() {
        super();

        this.state = { currentScore: 0, oldScore: undefined, paused: false };
    }

    render() {
        return (
            <center>
                <div className="App well">
                    {this.state.oldScore !== undefined && <h2>{`Prev Score: ${this.state.oldScore}`}</h2>}
                    <h1>{`Score: ${this.state.currentScore}`}</h1>
                    <center id="game">
                        <TetrisGame
                            onScoreChange={currentScore => this.setState({ currentScore })}
                            onGameOver={oldScore => this.setState({ oldScore, currentScore: 0 })}
                            paused={this.state.paused} />
                    </center>
                    <div className="controls">
                        <CommandButton
                            className="btn btn-primary"
                            onClick={({ target }) => this.setState({ paused: !this.state.paused }) || target.blur()}>
                            {this.state.paused ? "Continue" : "Pause"}
                        </CommandButton>
                    </div>
                </div>
            </center >
        );
    }
}

export default App;
