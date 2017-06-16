import { active, empty, inactive } from '../core/constants'

var squaresFrom = ({ row }) => row
    .split('')
    .filter(char => char !== " ")
    .map(square =>
        square === "*" ? active
            : square === "#" ? inactive
                : empty);

export var tetrisBoard = str => str
    .split("\n")
    .filter(row => row.length > 0)
    .map(row => squaresFrom({ row }));

export var stringFrom = board =>
    "\n" + board.map(row => row.map(square => square === active ? '*'
        : square === inactive ? '#'
            : '-')
        .join(''))
        .join('\n');