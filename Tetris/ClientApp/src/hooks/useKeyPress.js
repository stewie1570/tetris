import { flushSync } from 'react-dom';
import { keys } from "../core/constants";
import { move, rotate } from "../domain/motion";
import { iterateUntilInactive } from "../domain/iteration";

export const useKeyPress = (game, onChange) => {
  const keyPress = (event) => {
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
      selectedMove && event.preventDefault?.();
      selectedMove && flushSync(() => {
        onChange(game => ({ ...game, board: selectedMove() }));
      });
    };

    return !game.paused && processKeyCommand({ keyCode });
  };

  return keyPress;
};
