import { active, empty, inactive, squareFrom } from '../core/constants'
import _ from 'lodash'

export var move = ({ board, to }) => {
    var flatBoard = _(board)
        .flatMap((row, y) => row.map((square, x) => ({ ...square, x, y })));

    var availablePositions = flatBoard.filter(({ type }) => type !== inactive.type).value();

    var requestedSquares = flatBoard
        .filter(active)
        .map(square => ({
            x: square.x + (to.x || 0),
            y: square.y + (to.y || 0)
        }))
        .value();

    var requestedPositionsAreAvailable = requestedSquares.every(({ x, y }) =>
        _(availablePositions).some(square => square.x === x && square.y === y));

    return requestedPositionsAreAvailable
        ? board.map((row, y) => row.map((square, x) =>
            requestedSquares.some(requestedSquare => requestedSquare.x === x && requestedSquare.y === y)
                ? active
                : square === active ? empty : square))
        : board;
}

export var rotate = ({ board }) => {
    var activeSquares = _(board)
        .flatMap((row, y) => row.map((square, x) => ({ ...square, x, y })))
        .filter(active)
        .value();
    var activeXs = activeSquares.map(({ x }) => x);
    var activeYs = activeSquares.map(({ y }) => y);
    var x1 = _(activeXs).min();
    var x2 = _(activeXs).max();
    var y1 = _(activeYs).min();
    var y2 = _(activeYs).max();
    var origWidth = (x2 - x1) + 1;
    var origHeight = (y2 - y1) + 1;
    var newWidth = origHeight;
    var newHeight = origWidth;
    var originalShape = _.range(y1, y2 + 1).map(y => _.range(x1, x2 + 1).map(x => board[y][x]));

    var flatShape = _(originalShape)
        .flatMap((row, y) => row.map((square, x) => ({ ...square, x, y })))
        .value();

    var rotatedFlatShape = flatShape
        .map(({ x, y, ...square }) => ({ ...square, x: origHeight - y, y: x }));

    var rotatedShape = _(rotatedFlatShape)
        .groupBy(({ y }) => y)
        .map(row => _(row).orderBy(({ x }) => x).map(({ type }) => squareFrom({ type })).value())
        .value();

    var canRotate = rotatedShape.every((row, y) => row.every((square, x) =>
        (square !== active || board[y + y1][x + x1] !== inactive)
        // && (y + y1) < board.length
        // && (x + x1) < board[0].length
        ));

    var newBoard = () => board.map((row, y) => row.map((square, x) =>
        (x >= x1 && x < x1 + newWidth && y >= y1 && y < y1 + newHeight)
            ? rotatedShape[y - y1][x - x1]
            : square === active ? empty : square));

    return canRotate ? newBoard() : board;
};
