import React from 'react';

export const GameMetaFrame = ({ header, game, scoreBoard, controls, ...otherProps }) => {
    return <div {...otherProps}>
        <center>
            <div className="well app">
                {header}
                <div className="game">
                    {game}
                    {scoreBoard}
                </div>
                {controls}
            </div>
        </center>
    </div>;
}