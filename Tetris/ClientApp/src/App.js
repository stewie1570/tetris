import React, { useContext } from "react";
import SinglePlayerGame from "./SinglePlayerGame";
import { MultiplayerGame } from "./MultiplayerGame";
import { Routes, Route, Link } from 'react-router-dom';
import { shapes } from './components/TetrisGame';
import { MultiplayerContext } from "./MultiplayerContext";

const randomNumberGenerator = {
    between: ({ min, max }) => Math.floor(Math.random() * (max + 1)) + min,
};

const defaultShapeProvider = () =>
    shapes[randomNumberGenerator.between({ min: 0, max: shapes.length - 1 })];

export const App = ({ shapeProvider }) => {
    const { userId } = useContext(MultiplayerContext);

    return <Routes>
        <Route path="/" element={<>
            <SinglePlayerGame shapeProvider={shapeProvider ?? defaultShapeProvider} />
            <Link to={`/${userId}`}>Host Multiplayer Game</Link>
        </>} />
        <Route path="/:organizerUserId" element={<MultiplayerGame />} />
    </Routes>;
};
