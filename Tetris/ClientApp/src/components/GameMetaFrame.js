import React from "react";
import styled from "styled-components";

const App = styled.div`
  width: 300px;
  margin: 1rem 0 1rem 0;
  text-align: center;
  align-items: center;
  min-width: unset;
`;

const Game = styled.div`
  position: relative;
  padding-left: 1px;
  padding-bottom: 1px;
`;

const Container = styled.div`
  text-align: center;
  display: flex;
  align-items: flex-start;
  justify-content: center;
`;

export const GameMetaFrame = ({
  header,
  game,
  scoreBoard,
  controls,
  ...otherProps
}) => {
  return (
    <Container {...otherProps}>
      <App className="card" style={{
        background: 'rgba(255, 255, 255, 0.25)',
        backdropFilter: 'blur(25px)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        boxShadow: '0 12px 40px 0 rgba(31, 38, 135, 0.4)'
      }}>
        {header}
        <Game className="game">
          {game}
          {scoreBoard}
        </Game>
        {controls}
      </App>
    </Container>
  );
};
