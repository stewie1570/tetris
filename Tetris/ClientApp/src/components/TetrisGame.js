import React, { useCallback, useEffect, useRef, useState } from "react";
import { flushSync } from 'react-dom';
import { TetrisBoard } from "./TetrisBoard";
import { tetrisBoardFrom } from "../domain/serialization";
import { iterate } from "../domain/iteration";
import { useKeyPress } from "../hooks/useKeyPress";

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
  const [explodingRows, setExplodingRows] = useState([]);
  
  const game = {
    board: emptyBoard,
    score: 0,
    oldScore: undefined,
    paused: false,
    mobile: false,
    ...{ board, score, oldScore, paused, mobile }
  }
  const instance = useRef({ onChange, shapeProvider, game });
  instance.current = { onChange, shapeProvider, game };

  useEffect(() => {
    if (explodingRows.length > 0) {
      const timer = setTimeout(() => {
        setExplodingRows([]);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [explodingRows]);

  const cycle = useCallback(() => {
    if (!instance.current.game.paused) {
      flushSync(() => {
        instance.current.onChange(game => {
          const { board, score } = game;
          const iteratedGame = iterate({
            board,
            score,
            shapeProvider: instance.current.shapeProvider
          });

          if (iteratedGame.explodingRows && iteratedGame.explodingRows.length > 0) {
            setExplodingRows(iteratedGame.explodingRows);
          }

          return iteratedGame.isOver
            ? {
              ...game,
              board: emptyBoard,
              score: 0,
              oldScore: game.score,
            }
            : { ...game, ...iteratedGame };
        });
      });
    }
  }, []);

  const keyPress = useKeyPress(instance.current.game, instance.current.onChange);

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
      <TetrisBoard board={game.board} explodingRows={explodingRows} />
    </div>
  );
}
