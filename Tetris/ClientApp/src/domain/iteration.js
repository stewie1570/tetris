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

export const exploding = { type: 'exploding' };

const markRowForExplosion = (row) => row.map(square => square === inactive ? exploding : square);

export function iterate({ board, shapeProvider, score }) {
    const newShapeIteration = () => {
        const newShape = flatMap(shapeProvider(), (row, y) => row.map((value, x) => ({ x, y, value })));
        const isFull = row => row.every(square => square === inactive);
        const emptyRowFor = ({ y }) => new Array(board[y].length).fill(empty);
        
        const noFullRows = ({ board, score, explodingRows = [] }) => {
            const firstFullRowY = board.findIndex(isFull);

            if (firstFullRowY >= 0) {
                const boardWithExplodingRow = [...board];
                boardWithExplodingRow[firstFullRowY] = markRowForExplosion(board[firstFullRowY]);
                
                const updatedExplodingRows = [...explodingRows, firstFullRowY];
                
                if (updatedExplodingRows.length > 0) {
                    return {
                        board: boardWithExplodingRow,
                        score: score + 1,
                        explodingRows: updatedExplodingRows,
                        hasExplodingRows: true
                    };
                }
                
                return noFullRows({
                    board: [emptyRowFor({ y: 0 })]
                        .concat(board.slice(0, firstFullRowY))
                        .concat(board.slice(firstFullRowY + 1, board.length)),
                    score: score + 1,
                    explodingRows: updatedExplodingRows
                });
            }
            
            return { board, score, explodingRows, hasExplodingRows: explodingRows.length > 0 };
        };
        
        const noFullRowsResult = noFullRows({ board, score });
        const boardWithNewShape = board => board.map((row, y) => row.map((square, x) => some(newShape, { x, y, value: true }) ? active : square));

        if (noFullRowsResult.hasExplodingRows) {
            return {
                board: noFullRowsResult.board,
                isOver: false,
                score: noFullRowsResult.score,
                hasExplodingRows: true,
                explodingRows: noFullRowsResult.explodingRows
            };
        }

        return {
            board: boardWithNewShape(noFullRowsResult.board),
            isOver: noFullRowsResult.board.some((row, y) => row.some((square, x) => square !== empty && some(newShape, { x, y, value: true }))),
            score: noFullRowsResult.score
        };
    }

    return isActive({ board }) ? activeIteration({ board }) : newShapeIteration();
}