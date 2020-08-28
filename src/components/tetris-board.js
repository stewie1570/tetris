import React from "react";
import { activeColumnRangeFrom } from "../domain/board";
import "./board.css";
import { active, empty } from "../core/constants";

export function TetrisBoard({ board }) {
  var activeColumnRange = activeColumnRangeFrom({ board });
  var squareClassNameFrom = ({ square, x }) =>
    square === empty
      ? x >= activeColumnRange.x1 && x <= activeColumnRange.x2
        ? "active-empty"
        : "inactive-empty"
      : square.type;

  return (
    <table>
      <tbody>
        {board.map((row, y) => (
          <tr key={y} data-testid="row">
            {row.map((square, x) => (
              <td key={`${x},${y}`}>
                <div
                  className={`${squareClassNameFrom({ square, x })} square`}
                  data-testid="space"
                  title={square === empty ? "-" : square === active ? "*" : "#"}
                ></div>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
