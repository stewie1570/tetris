import { active } from '../core/constants'
import _ from 'lodash'

export const flatBoardFrom = ({ board }) => _(board)
    .flatMap((row, y) => row.map((square, x) => ({ ...square, x, y })));

export const activeColumnRangeFrom = ({ board }) => {
    const activeXs = flatBoardFrom({ board })
        .filter(({ type }) => type === active.type)
        .map(({ x }) => x);

    return {
        x1: _(activeXs).min(),
        x2: _(activeXs).max()
    };
};