import React from "react";
import { activeColumnRangeFrom } from "../domain/board";
import { empty } from "../core/constants";
import styled from "styled-components";
import { explosionAnimation } from "./AnimatedIcons";

const Square = styled.div`
  width: 29.3px;
  height: 29.3px;
  margin: 0;
  border-radius: 4px;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.3);
  transition: all 0.2s ease;
`;

const Active = styled(Square)`
  background: linear-gradient(145deg, #00ff88, #00cc6a);
  box-shadow: 0 0 10px rgba(0, 255, 136, 0.4), inset 0 1px 3px rgba(0, 0, 0, 0.3);
`;
const Inactive = styled(Square)`
  background: linear-gradient(145deg, #667eea, #764ba2);
  box-shadow: 0 0 8px rgba(102, 126, 234, 0.3), inset 0 1px 3px rgba(0, 0, 0, 0.3);
`;
const ActiveEmpty = styled(Square)`
  background: var(--color-square-empty-active);
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.2);
`;
const InactiveEmpty = styled(Square)`
  background: var(--color-square-empty-inactive);
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const ExplodingInactive = styled(Inactive)`
  animation: ${explosionAnimation} 0.5s ease-out forwards;
`;

const Squares = {
  active: <Active data-testid="space" title="*" />,
  inactive: <Inactive data-testid="space" title="#" />,
  "active-empty": <ActiveEmpty data-testid="space" title="-" />,
  "inactive-empty": <InactiveEmpty data-testid="space" title="-" />,
  explosion: <ExplodingInactive data-testid="space" title="#" />,
};

const TabelCell = styled.td`
  padding: 0;
`;

const GameBoard = styled.table`
  background: var(--color-board-bg);
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  border: 1px solid var(--color-board-border);
`;

export function TetrisBoard({
  board,
  explodingRows = [],
  noBackground = false,
}) {
  const activeColumnRange = activeColumnRangeFrom({ board });
  const squareFrom = ({ square, x, y }) => {
    if (explodingRows.includes(y)) return Squares["explosion"];

    const type =
      square === empty
        ? x >= activeColumnRange.x1 && x <= activeColumnRange.x2
          ? "active-empty"
          : "inactive-empty"
        : square.type;

    return Squares[type];
  };

  return (
    <GameBoard style={noBackground ? { background: 'transparent', boxShadow: 'none', border: 'none', padding: 0 } : undefined}>
      <tbody>
        {board.map((row, y) => (
          <tr key={y} data-testid="row">
            {row.map((square, x) => (
              <TabelCell key={`${x},${y}`} style={{ padding: "0px" }}>
                {squareFrom({ square, x, y })}
              </TabelCell>
            ))}
          </tr>
        ))}
      </tbody>
    </GameBoard>
  );
}
