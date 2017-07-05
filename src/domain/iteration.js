import { move } from './motion'
import { active, empty, inactive } from '../core/constants'
import _ from 'lodash'

var isActive = ({ board }) => _(board).some(row => row.some(square => square === active));

var inactivedBoardFrom = ({ board }) => board.map(row => row.map(square => square === active ? inactive : square));

var activeIteration = ({ board }) => {
    var interatedBoard = move({ board, to: { y: 1 } });

    return {
        board: board === interatedBoard
            ? inactivedBoardFrom({ board })
            : interatedBoard
    };
}

export var iterateUntilInactive = ({ board }) => isActive({ board })
    ? iterateUntilInactive(activeIteration({ board }))
    : board;

export function iterate({ board, shapeProvider, score }) {
    var newShapeIteration = () => {
        var newShape = _(shapeProvider()).flatMap((row, y) => row.map((value, x) => ({ x, y, value }))).value();
        var isFull = row => row.every(square => square === inactive);
        var emptyRowFor = ({ y }) => _.range(0, board[y].length).map(() => empty);
        var noFullRows = ({ board, score }) => {
            var firstFullRowY = _(board).findIndex(isFull);

            return firstFullRowY >= 0
                ? noFullRows({
                    board: [emptyRowFor({ y: 0 })]
                        .concat(board.slice(0, firstFullRowY))
                        .concat(board.slice(firstFullRowY + 1, board.length)),
                    score: score + 1
                })
                : { board, score };
        };
        var noFullRowsResult = noFullRows({ board, score });
        var boardWithNewShape = board => board.map((row, y) => row.map((square, x) => _(newShape).some({ x, y, value: true }) ? active : square));

        return {
            board: boardWithNewShape(noFullRowsResult.board),
            isOver: noFullRowsResult.board.some((row, y) => row.some((square, x) => square !== empty && _(newShape).some({ x, y, value: true }))),
            score: noFullRowsResult.score
        };
    }

    return isActive({ board }) ? activeIteration({ board }) : newShapeIteration();
}