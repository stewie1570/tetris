import { active, empty, inactive } from '../core/constants'

const squaresFrom = ({ row }) => row
    .split('')
    .filter(char => char !== " ")
    .map(square =>
        square === "*" ? active
            : square === "#" ? inactive
                : empty);

export const tetrisBoardFrom = str => str
    .split("\n")
    .filter(row => row.length > 0)
    .map(row => squaresFrom({ row }));

export const stringFrom = board =>
    (!board || !board.length)
        ? ""
        : ("\n" + board.map(row => row.map(square => square === active ? '*'
            : square === inactive ? '#'
                : '-')
            .join(''))
            .join('\n'));