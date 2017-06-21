import { move } from './motion'
import { active, empty, inactive } from '../core/constants'
import _ from 'lodash'

export class Game {
    iterate({ board, shapeProvider }) {
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
            
            return {
                board: board.map((row, y) => row.map((square, x) => _(newShape).some({ x, y, value: true }) ? active : square)),
                isOver: board.some((row, y) => row.some((square, x) => square !== empty && _(newShape).some({ x, y, value: true })))
            };
        }

        var isInactive = this._isInactive({ board });

        return isInactive ? newShapeIteration() : activeIteration();
    }

    _inactivedBoardFrom({ board }) {
        return board.map(row => row.map(square => square === active ? inactive : square));
    }

    _isInactive({ board }) {
        return _(board).every(row => row.every(square => square === inactive || square === empty));
    }
}