import min from 'lodash/min';
import max from 'lodash/max';
import range from 'lodash/range';
import flatMap from 'lodash/flatMap';
import groupBy from 'lodash/groupBy';
import orderBy from 'lodash/orderBy';
import mapObject from 'lodash/map';
import { active, empty, inactive, squareFrom } from '../core/constants'
import { flatBoardFrom } from './board';

const availablePositionsFrom = ({ flatBoard }) => flatBoard.filter(({ type }) => type !== inactive.type);

export const move = ({ board, to }) => {
    const flatBoard = flatBoardFrom({ board });

    const requestedSquares = flatBoard
        .filter(({ type }) => type === active.type)
        .map(square => ({
            x: square.x + (to.x || 0),
            y: square.y + (to.y || 0)
        }));

    const requestedPositionsAreAvailable = () => requestedSquares.every(({ x, y }) =>
        availablePositionsFrom({ flatBoard }).some(square => square.x === x && square.y === y));

    const squaresWereRequestedToMove = to.x || to.y;

    return squaresWereRequestedToMove && requestedPositionsAreAvailable()
        ? board.map((row, y) => row.map((square, x) =>
            requestedSquares.some(requestedSquare => requestedSquare.x === x && requestedSquare.y === y)
                ? active
                : square === active ? empty : square))
        : board;
}

export const rotate = ({ board }) => {
    const activeSquares = flatMap(board, (row, y) => row.map((square, x) => ({ ...square, x, y })))
        .filter(({ type }) => type === active.type);
    const activeXs = activeSquares.map(({ x }) => x);
    const activeYs = activeSquares.map(({ y }) => y);
    const x1 = min(activeXs);
    const x2 = max(activeXs);
    const y1 = min(activeYs);
    const y2 = max(activeYs);
    const origWidth = (x2 - x1) + 1;
    const origHeight = (y2 - y1) + 1;
    const newWidth = origHeight;
    const newHeight = origWidth;
    const originalShape = range(y1, y2 + 1).map(y => range(x1, x2 + 1).map(x => board[y][x]));

    const flatShape = flatMap(originalShape, (row, y) => row.map((square, x) => ({ ...square, x, y })));

    const rotatedFlatShape = flatShape
        .map(({ x, y, ...square }) => ({ ...square, x: origHeight - y, y: x }));

    const availablePositions = availablePositionsFrom({ flatBoard: flatBoardFrom({ board }) });

    const translatedRotatedFlatShape = rotatedFlatShape
        .map(square => ({ ...square, x: square.x + (x1 - 1), y: square.y + y1 }));

    const canRotate = translatedRotatedFlatShape
        .every(({ x, y }) => availablePositions
            .some(availableSquare => availableSquare.x === x && availableSquare.y === y));

    const rotatedShape = () => mapObject(
        groupBy(rotatedFlatShape, 'y'),
        row => orderBy(row, ({ x }) => x).map(({ type }) => squareFrom({ type })));

    const newBoard = () => board.map((row, y) => row.map((square, x) =>
        (x >= x1 && x < x1 + newWidth && y >= y1 && y < y1 + newHeight)
            ? rotatedShape()[y - y1][x - x1]
            : square === active ? empty : square));

    return canRotate ? newBoard() : board;
};
