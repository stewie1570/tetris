import React from 'react'
import './board.css'

export function TetrisBoard({ board }) {
    return <table>
        <tbody>
            {
                board.map((row, y) => <tr key={y}>
                    {
                        row.map((square, x) => <td key={`${x},${y}`}>
                            <div className={`${square.type} square`}>&nbsp;</div>
                        </td>)
                    }
                </tr>)
            }
        </tbody>
    </table>;
}