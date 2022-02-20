import React, { useContext } from "react";
import SinglePlayerGame, { SinglePlayerGameContext, SinglePlayerGameContextProvider } from "./SinglePlayerGame";
import { MultiplayerGame } from "./MultiplayerGame";
import { Routes, Route, Link } from 'react-router-dom';
import { shapes } from './components/TetrisGame';
import { MultiplayerContextPassThrough } from "./MultiplayerContext";
import { Dialog } from "./components/Prompt";
import { ErrorMessage } from "./components/ErrorMessage";
import { useUserId } from "./hooks/useUserId";

const randomNumberGenerator = {
    between: ({ min, max }) => Math.floor(Math.random() * (max + 1)) + min,
};

const defaultShapeProvider = () =>
    shapes[randomNumberGenerator.between({ min: 0, max: shapes.length - 1 })];

const GlobalUI = () => {
    const { dialogProps } = useContext(SinglePlayerGameContext);

    return <>
        <Dialog {...dialogProps} />
        <ErrorMessage />
    </>;
}

export const App = ({ shapeProvider }) => {
    const userId = useUserId();
    const selectedShapeProvider = shapeProvider ?? defaultShapeProvider;

    return <SinglePlayerGameContextProvider>
        <Routes>
            <Route
                path="/"
                element={
                    <SinglePlayerGame
                        shapeProvider={selectedShapeProvider}
                        additionalControls={<Link
                            style={{ marginTop: "1rem", display: "block" }}
                            to={`/${userId}`}>Host Multiplayer Game</Link>} />
                } />
            <Route
                path="/:organizerUserId"
                element={
                    <MultiplayerContextPassThrough>
                        <MultiplayerGame shapeProvider={selectedShapeProvider} />
                    </MultiplayerContextPassThrough>} />
        </Routes>
        <GlobalUI />
    </SinglePlayerGameContextProvider>;
};
