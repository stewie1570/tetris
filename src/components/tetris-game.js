import React, { Component } from 'react';
import { TetrisBoard } from './tetris-board'
import { tetrisBoard } from '../domain/serialization'
import { clickToKeyPress, isControl } from '../domain/mobile-click-to-keypress'
import { move, rotate } from '../domain/motion'
import { iterate, iterateUntilInactive } from '../domain/iteration'
import { keys } from '../core/constants'
import { MobileControls } from './mobile-controls'

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

export class TetrisGame extends Component {
    constructor(props) {
        super(props);

        this.state = initialState;
    }

    componentWillMount() {
        document.addEventListener("keydown", this.keyPress.bind(this), false);
        document.addEventListener("touchstart",
            ({ changedTouches, target }) =>
                !isControl({ target }) && this.keyPress({
                    keyCode: clickToKeyPress({
                        x: changedTouches[0].pageX,
                        y: changedTouches[0].pageY
                    }
                    )
                }),
            false);
        this.resetTimer();
    }

    componentWillUnmount() {
        document.removeEventListener("keydown");
        document.removeEventListener("touchstart");
    }

    resetTimer() {
        this.timer && clearTimeout(this.timer);
        this.timer = setTimeout(this.resetTimer.bind(this), 1000);

        if (!this.props.paused) {
            var { board, score } = this.state;
            var gameState = iterate({ board, score, shapeProvider });

            this.props.onScoreChange
                && gameState.score !== undefined
                && gameState.score !== score
                && this.props.onScoreChange(gameState.score);
            this.props.onGameOver && gameState.isOver && this.props.onGameOver(gameState.score);

            this.setState(gameState.isOver ? initialState : gameState);
        }
    }

    keyPress({ keyCode }) {
        var processKeyCommand = ({ keyCode }) => {
            var { board } = this.state;
            var newBoard = keyCode === keys.left ? move({ board, to: { x: -1 } })
                : keyCode === keys.right ? move({ board, to: { x: 1 } })
                : keyCode === keys.down ? move({ board, to: { y: 1 } })
                : keyCode === keys.space ? iterateUntilInactive({ board })
                : keyCode === keys.up ? rotate({ board }) : board;

            this.setState({ board: newBoard });
        };

        return document.hasFocus() && !this.props.paused && processKeyCommand({ keyCode });
    }

    render() {
        return <div>
            {!this.props.paused && this.props.mobile && <MobileControls onClick={keyCode => this.keyPress({keyCode})} />}
            <TetrisBoard board={this.state.board} />
        </div>;
    }
}