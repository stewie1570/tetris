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

export const emptyBoard = tetrisBoardFrom(`
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

export const TetrisGame = ({ game: gameState, onChange, shapeProvider }) => {
  const { board, mobile, oldScore, paused, score } = gameState;
  const game = {
    board: emptyBoard,
    score: 0,
    oldScore: undefined,
    paused: false,
    mobile: false,
    ...{ board, score, oldScore, paused, mobile }
  }

  useEffect(() => {
    window.addEventListener("keydown", keyPress, false);
    window.addEventListener("iterate-game", cycle, false);

    return () => {
      window.removeEventListener("keydown", keyPress, false);
      window.removeEventListener("iterate-game", cycle, false);
    }
  }, [game, onChange, shapeProvider]);

  const cycle = () => {
    if (!game.paused) {
      var { board, score } = game;
      const iteratedGame = iterate({
        board,
        score,
        shapeProvider,
      });

      iteratedGame.isOver
        ? onChange({
          ...game,
          board: emptyBoard,
          score: 0,
          oldScore: game.score,
        })
        : onChange({ ...game, ...iteratedGame });
    }
  };

  const keyPress = ({ keyCode }) => {
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

      onChange({ ...game, board: newBoard });
    };

    return !game.paused && processKeyCommand({ keyCode });
  };

  return (
    <div>
      {!game.paused && game.mobile && (
        <MobileControls onClick={(keyCode) => keyPress({ keyCode })} />
      )}
      <TetrisBoard board={game.board} />
    </div>
  );
}
