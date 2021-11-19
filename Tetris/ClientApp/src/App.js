import React from "react";
import SinglePlayerGame from "./SinglePlayerGame";
import { MultiplayerGame } from "./MultiplayerGame";
import { Routes, Route, Link } from 'react-router-dom';
import { GameHubContext } from "./SignalRGameHubContext";

const randomNumberGenerator = {
    between: ({ min, max }) => Math.floor(Math.random() * (max + 1)) + min,
};

const shapeProvider = () =>
    shapes[randomNumberGenerator.between({ min: 0, max: shapes.length - 1 })];

const userId = Math.random().toString(36).substring(7);

export const App = () => {
    return <Routes>
        <Route path="/" element={<>
            <SinglePlayerGame shapeProvider={shapeProvider} />
            <Link to={`/${userId}`}>Host Multiplayer Game</Link>
        </>} />
        <Route path="/:organizerUserId" element={<GameHubContext.Consumer>
            {({ gameHub, isConnected }) => <MultiplayerGame gameHub={gameHub} isConnected={isConnected} />}
        </GameHubContext.Consumer>} />
    </Routes>;
};
