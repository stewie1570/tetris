import { active, empty, inactive, squareFrom } from '../core/constants'
import { flatBoardFrom } from './board'
import _ from 'lodash'

const availablePositionsFrom = ({ flatBoard }) => flatBoard.filter(({ type }) => type !== inactive.type).value();

export const move = ({ board, to }) => {
    const flatBoard = flatBoardFrom({ board });

    const requestedSquares = flatBoard
        .filter(active)
        .map(square => ({
            x: square.x + (to.x || 0),
            y: square.y + (to.y || 0)
        }))
        .value();

    const requestedPositionsAreAvailable = () => requestedSquares.every(({ x, y }) =>
        _(availablePositionsFrom({ flatBoard })).some(square => square.x === x && square.y === y));

    const squaresWereRequestedToMove = to.x || to.y;

    return squaresWereRequestedToMove && requestedPositionsAreAvailable()
        ? board.map((row, y) => row.map((square, x) =>
            requestedSquares.some(requestedSquare => requestedSquare.x === x && requestedSquare.y === y)
                ? active
                : square === active ? empty : square))
        : board;
}

export const rotate = ({ board }) => {
    const activeSquares = _(board)
        .flatMap((row, y) => row.map((square, x) => ({ ...square, x, y })))
        .filter(active)
        .value();
    const activeXs = activeSquares.map(({ x }) => x);
    const activeYs = activeSquares.map(({ y }) => y);
    const x1 = _(activeXs).min();
    const x2 = _(activeXs).max();
    const y1 = _(activeYs).min();
    const y2 = _(activeYs).max();
    const origWidth = (x2 - x1) + 1;
    const origHeight = (y2 - y1) + 1;
    const newWidth = origHeight;
    const newHeight = origWidth;
    const originalShape = _.range(y1, y2 + 1).map(y => _.range(x1, x2 + 1).map(x => board[y][x]));

    const flatShape = _(originalShape)
        .flatMap((row, y) => row.map((square, x) => ({ ...square, x, y })))
        .value();

    const rotatedFlatShape = flatShape
        .map(({ x, y, ...square }) => ({ ...square, x: origHeight - y, y: x }));

    const availablePositions = availablePositionsFrom({ flatBoard: flatBoardFrom({ board }) });

    const translatedRotatedFlatShape = rotatedFlatShape
        .map(square => ({ ...square, x: square.x + (x1 - 1), y: square.y + y1 }));

    const canRotate = translatedRotatedFlatShape
        .every(({ x, y }) => availablePositions
            .some(availableSquare => availableSquare.x === x && availableSquare.y === y));

    const rotatedShape = () => _(rotatedFlatShape)
        .groupBy(({ y }) => y)
        .map(row => _(row).orderBy(({ x }) => x).map(({ type }) => squareFrom({ type })).value())
        .value();

    const newBoard = () => board.map((row, y) => row.map((square, x) =>
        (x >= x1 && x < x1 + newWidth && y >= y1 && y < y1 + newHeight)
            ? rotatedShape()[y - y1][x - x1]
            : square === active ? empty : square));

    return canRotate ? newBoard() : board;
};
