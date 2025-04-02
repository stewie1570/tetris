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
      <App className="card">
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
