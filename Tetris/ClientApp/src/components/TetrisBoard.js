import React from "react";
import { activeColumnRangeFrom } from "../domain/board";
import { empty } from "../core/constants";
import styled from 'styled-components';
import "./ExplosionAnimation.css";

const Square = styled.div`
  width: 29.3px;
  height: 29.3px;
  margin: 0;
`;

const Active = styled(Square)`
  background-color: #00ff00;
`;
const Inactive = styled(Square)`
  background-color: #22f;
`;
const ActiveEmpty = styled(Square)`
  background-color: #111;
`;
const InactiveEmpty = styled(Square)`
  background-color: #222;
`;
const Exploding = styled(Square)`
  background-color: #ff4500;
`;

const Squares = {
  'active': <Active data-testid="space" title="*" />,
  'inactive': <Inactive data-testid="space" title="#" />,
  'active-empty': <ActiveEmpty data-testid="space" title="-" />,
  'inactive-empty': <InactiveEmpty data-testid="space" title="-" />,
  'exploding': <Exploding data-testid="space" title="!" className="exploding" />
}

const TabelCell = styled.td`
  padding: 0;
`;

export function TetrisBoard({ board, hasExplodingRows }) {
  const activeColumnRange = activeColumnRangeFrom({ board });
  const squareFrom = ({ square, x }) => {
    const type = square === empty
      ? x >= activeColumnRange.x1 && x <= activeColumnRange.x2
        ? "active-empty"
        : "inactive-empty"
      : square.type;

    return Squares[type];
  }

  return (
    <table>
      <tbody>
        {board.map((row, y) => (
          <tr key={y} data-testid="row">
            {row.map((square, x) => (
              <TabelCell key={`${x},${y}`} style={{ padding: "0px" }}>
                {squareFrom({ square, x })}
              </TabelCell>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
