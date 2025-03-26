import { move } from './motion';
import { active, empty, inactive } from '../core/constants';
import flatMap from 'lodash/flatMap';
import some from 'lodash/some';

const isActive = ({ board }) => board.some(row => row.some(square => square === active));

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
        const newShape = flatMap(shapeProvider(), (row, y) => row.map((value, x) => ({ x, y, value })));
        const isFull = row => row.every(square => square === inactive);
        const emptyRowFor = ({ y }) => new Array(board[y].length).fill(empty);
        
        const noFullRows = ({ board, score, explodingRows = [] }) => {
            const firstFullRowY = board.findIndex(isFull);

            return firstFullRowY >= 0
                ? noFullRows({
                    board: [emptyRowFor({ y: 0 })]
                        .concat(board.slice(0, firstFullRowY))
                        .concat(board.slice(firstFullRowY + 1, board.length)),
                    score: score + 1,
                    explodingRows: [...explodingRows, firstFullRowY]
                })
                : { board, score, explodingRows };
        };
        
        const noFullRowsResult = noFullRows({ board, score });
        const boardWithNewShape = board => board.map((row, y) => row.map((square, x) => some(newShape, { x, y, value: true }) ? active : square));

        return {
            board: boardWithNewShape(noFullRowsResult.board),
            isOver: noFullRowsResult.board.some((row, y) => row.some((square, x) => square !== empty && some(newShape, { x, y, value: true }))),
            score: noFullRowsResult.score,
            explodingRows: noFullRowsResult.explodingRows
        };
    }

    return isActive({ board }) ? activeIteration({ board }) : newShapeIteration();
}