import React, { useContext } from "react";
import SinglePlayerGame, { SinglePlayerGameContext, SinglePlayerGameContextProvider } from "./SinglePlayerGame";
import { MultiplayerGame } from "./MultiplayerGame";
import { Routes, Route, Link } from 'react-router-dom';
import { shapes } from './components/TetrisGame';
import { MultiplayerContext } from "./MultiplayerContext";
import { Dialog } from "./components/Prompt";
import { ErrorMessage } from "./components/ErrorMessage";

const randomNumberGenerator = {
    between: ({ min, max }) => Math.floor(Math.random() * (max + 1)) + min,
};

const defaultShapeProvider = () =>
    shapes[randomNumberGenerator.between({ min: 0, max: shapes.length - 1 })];

const GlobalUI = () => {
    const { dialogProps } = useContext(SinglePlayerGameContext);

    return <>
        <ErrorMessage />
        <Dialog {...dialogProps} />
    </>;
}

export const App = ({ shapeProvider }) => {
    const { userId } = useContext(MultiplayerContext);

    return <SinglePlayerGameContextProvider>
        <Routes>
            <Route path="/" element={<>
                <SinglePlayerGame shapeProvider={shapeProvider ?? defaultShapeProvider} />
                <Link to={`/${userId}`}>Host Multiplayer Game</Link>
            </>} />
            <Route path="/:organizerUserId" element={<MultiplayerGame />} />
        </Routes>
        <GlobalUI />
    </SinglePlayerGameContextProvider>;
};
