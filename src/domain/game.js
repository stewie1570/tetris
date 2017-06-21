import { move } from './motion'
import { active, empty, inactive } from '../core/constants'
import _ from 'lodash'

export class Game {
    iterate({ board, shapeProvider, score }) {
        var activeIteration = () => {
            var interatedBoard = move({ board, to: { y: 1 } });

            return {
                board: board === interatedBoard
                    ? this._inactivedBoardFrom({ board })
                    : interatedBoard
            };
        }

        var newShapeIteration = () => {
            var newShape = _(shapeProvider()).flatMap((row, y) => row.map((value, x) => ({ x, y, value })));
            var isFull = row => row.every(square => square === inactive);
            var emptyRowFor = ({ y }) => _.range(0, board[y].length).map(() => empty);
            var noFullRows = ({ board }) => {
                var firstFullRowY = board.findIndex(isFull)
                return firstFullRowY >= 0
                    ? noFullRows({
                        board: [emptyRowFor({ y: 0 })]
                            .concat(board.slice(0, firstFullRowY))
                            .concat(board.slice(firstFullRowY + 1, board.length))
                    })
                    : board;
            };
            var newBoard = noFullRows({ board });

            return {
                board: newBoard.map((row, y) => row.map((square, x) => _(newShape).some({ x, y, value: true }) ? active : square)),
                isOver: newBoard.some((row, y) => row.some((square, x) => square !== empty && _(newShape).some({ x, y, value: true })))
            };
        }

        var isActive = this._isActive({ board });

        return isActive ? activeIteration() : newShapeIteration();
    }

    _inactivedBoardFrom({ board }) {
        return board.map(row => row.map(square => square === active ? inactive : square));
    }

    _isActive({ board }) {
        return _(board).some(row => row.some(square => square === active));
    }
}