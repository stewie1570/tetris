import { active } from '../core/constants'
import _ from 'lodash'

export var flatBoardFrom = ({ board }) => _(board)
    .flatMap((row, y) => row.map((square, x) => ({ ...square, x, y })));

export var activeColumnRangeFrom = ({ board }) => {
    var activeXs = flatBoardFrom({ board })
        .filter(({ type }) => type === active.type)
        .map(({ x }) => x);

    return {
        x1: _(activeXs).min(),
        x2: _(activeXs).max()
    };
};