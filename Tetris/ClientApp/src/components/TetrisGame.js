import React, { useCallback, useEffect } from "react";
import { TetrisBoard } from "./TetrisBoard";
import { tetrisBoardFrom } from "../domain/serialization";
import { move, rotate } from "../domain/motion";
import { iterate, iterateUntilInactive } from "../domain/iteration";
import { keys } from "../core/constants";
import { MobileControls } from "./MobileControls";

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

export const TetrisGame = ({ game: gameState, onChange, shapeProvider, onPause }) => {
  const { board, mobile, oldScore, paused, score } = gameState;
  const game = {
    board: emptyBoard,
    score: 0,
    oldScore: undefined,
    paused: false,
    mobile: false,
    ...{ board, score, oldScore, paused, mobile }
  }

  const cycle = useCallback(() => {
    if (!game.paused) {
      onChange(game => {
        const { board, score } = game;
        const iteratedGame = iterate({
          board,
          score,
          shapeProvider,
        });

        return iteratedGame.isOver
          ? {
            ...game,
            board: emptyBoard,
            score: 0,
            oldScore: game.score,
          }
          : { ...game, ...iteratedGame };
      });
    }
  }, [game.paused, onChange, shapeProvider]);

  const keyPress = useCallback((event) => {
    const { keyCode } = event;
    const processKeyCommand = ({ keyCode }) => {
      const { board } = game;
      const moves = {
        [keys.left]: () => move({ board, to: { x: -1 } }),
        [keys.right]: () => move({ board, to: { x: 1 } }),
        [keys.down]: () => move({ board, to: { y: 1 } }),
        [keys.space]: () => iterateUntilInactive({ board }),
        [keys.up]: () => rotate({ board }),
      };
      const selectedMove = moves[keyCode];
      selectedMove && event.preventDefault();
      selectedMove && onChange(game => ({ ...game, board: selectedMove() }));
    };

    return !game.paused && processKeyCommand({ keyCode });
  }, [game, onChange]);

  useEffect(() => {
    window.addEventListener("keydown", keyPress, false);
    window.addEventListener("iterate-game", cycle, false);

    return () => {
      window.removeEventListener("keydown", keyPress, false);
      window.removeEventListener("iterate-game", cycle, false);
    }
  }, [cycle, keyPress]);

  return (
    <div>
      {!game.paused && game.mobile && (
        <MobileControls onPause={onPause} onClick={(keyCode) => keyPress({ keyCode })} />
      )}
      <TetrisBoard board={game.board} />
    </div>
  );
}
