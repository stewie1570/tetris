import React from 'react'
import { activeColumnRangeFrom } from '../domain/board'
import { empty } from '../core/constants'
import './board.css'

export function TetrisBoard({ board }) {
    var activeColumnRange = activeColumnRangeFrom({ board });
    var squareClassNameFrom = ({ square, x }) => square === empty
        ? (x >= activeColumnRange.x1 && x <= activeColumnRange.x2 ? "active-empty" : "inactive-empty")
        : square.type;

    return <table>
        <tbody>
            {
                board.map((row, y) => <tr key={y}>
                    {
                        row.map((square, x) => <td key={`${x},${y}`}>
                            <div
                                className={`${squareClassNameFrom({ square, x })} square`}>
                                &nbsp;
                            </div>
                        </td>)
                    }
                </tr>)
            }
        </tbody>
    </table>;
}