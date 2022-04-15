import { active } from '../core/constants';
import min from 'lodash/min';
import max from 'lodash/max';
import flatMap from 'lodash/flatMap';

export const flatBoardFrom = ({ board }) => flatMap(board, (row, y) => row.map((square, x) => ({ ...square, x, y })));

export const activeColumnRangeFrom = ({ board }) => {
    const activeXs = flatBoardFrom({ board })
        .filter(({ type }) => type === active.type)
        .map(({ x }) => x);

    return {
        x1: min(activeXs),
        x2: max(activeXs)
    };
};