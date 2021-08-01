import { move } from './motion'
import { active, empty, inactive } from '../core/constants'
import _ from 'lodash'

const isActive = ({ board }) => _(board).some(row => row.some(square => square === active));

const inactivedBoardFrom = ({ board }) => board.map(row => row.map(square => square === active ? inactive : square));

const activeIteration = ({ board }) => {
    const iteratedBoard = move({ board, to: { y: 1 } });

    return {
        board: board === iteratedBoard
            ? inactivedBoardFrom({ board })
            : iteratedBoard
    };
}

export const iterateUntilInactive = ({ board }) => isActive({ board })
    ? iterateUntilInactive(activeIteration({ board }))
    : board;

export function iterate({ board, shapeProvider, score }) {
    const newShapeIteration = () => {
        const newShape = _(shapeProvider()).flatMap((row, y) => row.map((value, x) => ({ x, y, value }))).value();
        const isFull = row => row.every(square => square === inactive);
        const emptyRowFor = ({ y }) => _.range(0, board[y].length).map(() => empty);
        const noFullRows = ({ board, score }) => {
            const firstFullRowY = _(board).findIndex(isFull);

            return firstFullRowY >= 0
                ? noFullRows({
                    board: [emptyRowFor({ y: 0 })]
                        .concat(board.slice(0, firstFullRowY))
                        .concat(board.slice(firstFullRowY + 1, board.length)),
                    score: score + 1
                })
                : { board, score };
        };
        const noFullRowsResult = noFullRows({ board, score });
        const boardWithNewShape = board => board.map((row, y) => row.map((square, x) => _(newShape).some({ x, y, value: true }) ? active : square));

        return {
            board: boardWithNewShape(noFullRowsResult.board),
            isOver: noFullRowsResult.board.some((row, y) => row.some((square, x) => square !== empty && _(newShape).some({ x, y, value: true }))),
            score: noFullRowsResult.score
        };
    }

    return isActive({ board }) ? activeIteration({ board }) : newShapeIteration();
}