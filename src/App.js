import React, { Component } from 'react';
import { TetrisBoard } from './components/board'
import { tetrisBoard } from './domain/serialization'
import { move, rotate } from './domain/motion'
import { iterate, iterateUntilInactive } from './domain/iteration'
import './App.css';

var keys = {
    left: 37,
    right: 39,
    down: 40,
    up: 38,
    space: 32
}

var randomNumberGenerator = {
    between: ({ min, max }) => Math.floor(Math.random() * (max + 1)) + min
}

var shapes = [
    [
        [true, true],
        [true, true]
    ],
    [
        [true],
        [true],
        [true],
        [true]
    ],
    [
        [true, false],
        [true, false],
        [true, true]
    ],
    [
        [false, true],
        [false, true],
        [true, true]
    ],
    [
        [false, true],
        [true, true],
        [true, false]
    ],
    [
        [true, false],
        [true, true],
        [false, true]
    ],
    [
        [false, true, false],
        [true, true, true]
    ]
];

var shapeProvider = () => shapes[randomNumberGenerator.between({ min: 0, max: shapes.length - 1 })];
var emptyBoard = tetrisBoard(`
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
    ----------`);

var initialState = {
    board: emptyBoard,
    score: 0
};

class App extends Component {
    constructor() {
        super();

        this.state = initialState;
    }

    componentWillMount() {
        document.addEventListener("keydown", this.keyPress.bind(this), false);
        this.resetTimer();
    }

    componentWillUnmount() {
        document.removeEventListener("keydown");
    }

    resetTimer() {
        this.timer && clearTimeout(this.timer);
        this.timer = setTimeout(this.resetTimer.bind(this), 1000);

        var { board, score } = this.state;
        var gameState = iterate({ board, score, shapeProvider });

        this.setState(gameState.isOver ? initialState : gameState);
    }

    keyPress({ keyCode }) {
        var { board } = this.state;
        var newState = keyCode === keys.left ? { board: move({ board, to: { x: -1 } }) }
            : keyCode === keys.right ? { board: move({ board, to: { x: 1 } }) }
            : keyCode === keys.down ? { board: move({ board, to: { y: 1 } }) }
            : keyCode === keys.space ? iterateUntilInactive({ board })
            : { board: rotate({ board }) };

        this.setState(newState);
    }

    render() {
        return (
            <div className="App">
                <h1>{`Score: ${this.state.score}`}</h1>
                <center>
                    <TetrisBoard board={this.state.board} />
                </center>
            </div>
        );
    }
}

export default App;
