import React, { Component } from 'react';
import { TetrisGame } from './TetrisGame'
import './App.css';

class App extends Component {
    constructor() {
        super();

        this.state = { currentScore: 0, oldScore: undefined, paused: false };
    }

    render() {
        return (
            <div className="App">
                {this.state.oldScore !== undefined && <h2>{`Prev Score: ${this.state.oldScore}`}</h2>}
                <h1>{`Score: ${this.state.currentScore}`}</h1>
                <center>
                    <TetrisGame
                        onScoreChange={currentScore => this.setState({ currentScore })}
                        onGameOver={oldScore => this.setState({ oldScore, currentScore: 0 })}
                        paused={this.state.paused} />
                </center>
            </div>
        );
    }
}

export default App;
