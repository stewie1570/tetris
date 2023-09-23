import React from 'react';
import styled from 'styled-components';

const App = styled.div`
  width: 300px;
  margin-top: 10px;
  text-align: center;
  align-items: center;
`;

const Game = styled.div`
  position: relative;
  padding-left: 1px;
  padding-bottom: 1px;
`;

const Container = styled.div`
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
`;

export const GameMetaFrame = ({ header, game, scoreBoard, controls, ...otherProps }) => {
    return <Container {...otherProps}>
        <App className="card">
            {header}
            <Game className="game">
                {game}
                {scoreBoard}
            </Game>
            {controls}
        </App>
    </Container>;
}