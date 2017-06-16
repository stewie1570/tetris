import _ from 'lodash'
import { active, empty, inactive } from '../core/constants'

export var move = ({ board, to }) => {
    var availablePositions = _(board)
        .flatMap((row, y) => row.map((square, x) => ({ ...square, x, y })))
        .filter(empty)
        .value();

    var requestedSquares = _(board)
        .flatMap((row, y) => row.map((square, x) => ({ ...square, x, y })))
        .filter(active)
        .map(square => ({
            x: square.x + (to.x || 0),
            y: square.y + (to.y || 0)
        }))
        .value();

    var requestedPositionsAreAvailable = requestedSquares.every(({ x, y }) => _(availablePositions).some(square => square.x === x && square.y === y));

    return requestedPositionsAreAvailable
        ? board.map((row, y) => row.map((square, x) =>
            square === active
                ? empty
                : requestedSquares.some(requestedSquare => requestedSquare.x === x && requestedSquare.y === y)
                    ? active
                    : square))
        : board;
}

// export var rotate = ({ board }) => {
//     var activeSquares = _(board)
//         .flatMap((row, y) => row.map((square, x) => ({ ...square, x, y })))
//         .filter(active)
//         .value();
//     var activeXs = activeSquares.map(({ x }) => x);
//     var activeYs = activeSquares.map(({ y }) => y);
//     var x1 = _(activeXs).min();
//     var x2 = _(activeXs).max();
//     var y1 = _(activeYs).min();
//     var y2 = _(activeYs).max();
//     var originalShape =  _.range(y1, y2 + 1).map(y => _.range(x1, x2 + 1).map(x => board[y][x]));


//     return originalShape;
// };
