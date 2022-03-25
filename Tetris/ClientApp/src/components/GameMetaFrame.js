import React from 'react';
import styled from 'styled-components';

const App = styled.div`
  width: 300px;
  margin-top: 10px;
`;

const Game = styled.div`
  position: relative;
  width: 242px;
  padding-left: 1px;
  padding-bottom: 1px;
`;

export const GameMetaFrame = ({ header, game, scoreBoard, controls, ...otherProps }) => {
    return <div {...otherProps}>
        <center>
            <App className="well">
                {header}
                <Game className="game">
                    {game}
                    {scoreBoard}
                </Game>
                {controls}
            </App>
        </center>
    </div>;
}