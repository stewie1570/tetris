import React, { Component } from 'react';
import { TetrisBoard } from './components/board'
import { tetrisBoard } from './domain/serialization'
import { move, rotate } from './domain/motion'
import './App.css';

var keys = {
    left: 37,
    right: 39,
    down: 40,
    up: 38
}

class App extends Component {
    constructor() {
        super();

        this.state = {
            board: tetrisBoard(`
            -**-------
            --*-------
            --*-------
            ----------
            ----------
            ----------
            ----------
            ----------
            ----------
            ----------
            ----------
            ----------
            ----------
            ----------
            ----------
            ----------
            ----------
            ----------
            -----##---
        `)
        };
    }

    componentWillMount() {
        document.addEventListener("keydown", this.keyPress.bind(this), false);
    }

    componentWillUnmount() {
        document.removeEventListener("keydown");
    }

    keyPress({ keyCode }) {
        var board = this.state.board;
        var newState = keyCode === keys.left ? { board: move({ board, to: { x: -1 } }) }
            : keyCode === keys.right ? { board: move({ board, to: { x: 1 } }), rightBoard: "wft???" }
            : keyCode === keys.down ? { board: move({ board, to: { y: 1 } }) }
            : { board: rotate({ board }) };

        this.setState(newState);
    }

    render() {
        return (
            <div className="App">
                <TetrisBoard board={this.state.board} />
            </div>
        );
    }
}

export default App;
