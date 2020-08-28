import React, { Component } from "react";
import { TetrisBoard } from "./tetris-board";
import { tetrisBoardFrom } from "../domain/serialization";
import { move, rotate } from "../domain/motion";
import { iterate, iterateUntilInactive } from "../domain/iteration";
import { keys } from "../core/constants";
import { MobileControls } from "./mobile-controls";

export const shapes = [
  [
    [true, true],
    [true, true],
  ],
  [[true], [true], [true], [true]],
  [
    [true, false],
    [true, false],
    [true, true],
  ],
  [
    [false, true],
    [false, true],
    [true, true],
  ],
  [
    [false, true],
    [true, true],
    [true, false],
  ],
  [
    [true, false],
    [true, true],
    [false, true],
  ],
  [
    [false, true, false],
    [true, true, true],
  ],
];

const emptyBoard = tetrisBoardFrom(`
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

export class TetrisGame extends Component {
  getGameState() {
    const { onChange, ...otherProps } = this.props;

    return {
      board: emptyBoard,
      score: 0,
      oldScore: undefined,
      paused: false,
      mobile: false,
      ...otherProps,
    };
  }

  componentWillMount() {
    document.addEventListener("keydown", this.keyPress, false);
    this.interval = this.props.gameIterator(this.cycle.bind(this), 1000);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.keyPress);
  }

  cycle = () => {
    const game = this.getGameState();

    if (!game.paused) {
      var { board, score } = game;
      const iteratedGame = iterate({
        board,
        score,
        shapeProvider: this.props.shapeProvider,
      });

      iteratedGame.isOver
        ? this.props.onChange({
            ...game,
            board: emptyBoard,
            score: 0,
            oldScore: game.score,
          })
        : this.props.onChange({ ...game, ...iteratedGame });
    }
  };

  keyPress = ({ keyCode }) => {
    const game = this.getGameState();

    var processKeyCommand = ({ keyCode }) => {
      var { board } = game;
      var newBoard =
        keyCode === keys.left
          ? move({ board, to: { x: -1 } })
          : keyCode === keys.right
          ? move({ board, to: { x: 1 } })
          : keyCode === keys.down
          ? move({ board, to: { y: 1 } })
          : keyCode === keys.space
          ? iterateUntilInactive({ board })
          : keyCode === keys.up
          ? rotate({ board })
          : board;

      this.props.onChange({ ...game, board: newBoard });
    };

    return (
      document.hasFocus() && !game.paused && processKeyCommand({ keyCode })
    );
  };

  render() {
    const game = this.getGameState();

    return (
      <div>
        {!game.paused && game.mobile && (
          <MobileControls onClick={(keyCode) => this.keyPress({ keyCode })} />
        )}
        <TetrisBoard board={game.board} />
      </div>
    );
  }
}
