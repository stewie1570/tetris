import React from 'react';

export const GameRoomGrid = ({ left, right }) => <div className="container">
    <div className="row">
        <div className="col-lg-5 col-md-12">
            {left}
        </div>
        <div className="col-lg-7 col-md-12">
            {right}
        </div>
    </div>
</div>