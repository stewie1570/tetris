import React, { useEffect } from "react";
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

export const TetrisGame = props => {
  const getGameState = () => {
    const { onChange, ...otherProps } = props;

    return {
      board: emptyBoard,
      score: 0,
      oldScore: undefined,
      paused: false,
      mobile: false,
      ...otherProps,
    };
  }

  useEffect(() => {
    window.addEventListener("keydown", keyPress, false);
    window.addEventListener("iterate-game", cycle, false);

    return () => {
      window.removeEventListener("keydown", keyPress, false);
      window.removeEventListener("iterate-game", cycle, false);
    }
  }, [props]);

  const cycle = () => {
    const game = getGameState();

    if (!game.paused) {
      var { board, score } = game;
      const iteratedGame = iterate({
        board,
        score,
        shapeProvider: props.shapeProvider,
      });

      iteratedGame.isOver
        ? props.onChange({
          ...game,
          board: emptyBoard,
          score: 0,
          oldScore: game.score,
        })
        : props.onChange({ ...game, ...iteratedGame });
    }
  };

  const keyPress = ({ keyCode }) => {
    const game = getGameState();

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

      props.onChange({ ...game, board: newBoard });
    };

    return !game.paused && processKeyCommand({ keyCode });
  };

  const game = getGameState();

  return (
    <div>
      {!game.paused && game.mobile && (
        <MobileControls onClick={(keyCode) => keyPress({ keyCode })} />
      )}
      <TetrisBoard board={game.board} />
    </div>
  );
}
