import { move } from './motion'
import { active, empty, inactive } from '../core/constants'
import _ from 'lodash'

export class Game {
    constructor({ board, shapeProvider }) {
        this.board = board;
        this.shapeProvider = shapeProvider;
        this.isOver = false;
    };

    iterate() {
        if (this._isInactive()) {
            var newShape = _(this.shapeProvider()).flatMap((row, y) => row.map((value, x) => ({ x, y, value })));
            this.isOver = this.board.some((row, y) => row.some((square, x) => square !== empty && _(newShape).some({ x, y, value: true })))
            this.board = this.board.map((row, y) => row.map((square, x) => _(newShape).some({ x, y, value: true }) ? active : square));
        }
        else {
            var newBoard = move({ board: this.board, to: { y: 1 } });
            var inactiveBoard = this._inactiveBoard();

            this.board = this.board === newBoard ? inactiveBoard : newBoard;
        }
    }

    _inactiveBoard() {
        return this.board.map(row => row.map(square => square === active ? inactive : square));
    }

    _isInactive() {
        return _(this.board).every(row => row.every(square => square === inactive || square === empty));
    }
}