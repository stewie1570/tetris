import React from 'react';

export const GameRoomGrid = ({ left, right }) => <div className="container">
    <div className="row">
        <div className="col-md-6">
            {left}
        </div>
        <div className="col-md-6">
            {right}
        </div>
    </div>
</div>