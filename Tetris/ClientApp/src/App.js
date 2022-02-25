import React, { useContext } from "react";
import SinglePlayerGame, { SinglePlayerGameContext, SinglePlayerGameContextProvider } from "./SinglePlayerGame";
import { MultiplayerGame } from "./MultiplayerGame";
import { Routes, Route } from 'react-router-dom';
import { shapes } from './components/TetrisGame';
import { MultiplayerContextPassThrough } from "./MultiplayerContext";
import { Dialog } from "./components/Prompt";
import { ErrorMessage } from "./components/ErrorMessage";
import { MultiplayerLinks } from "./MultiplayerLinks";

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
    const selectedShapeProvider = shapeProvider ?? defaultShapeProvider;

    return <SinglePlayerGameContextProvider>
        <Routes>
            <Route
                path="/"
                element={
                    <SinglePlayerGame
                        shapeProvider={selectedShapeProvider}
                        additionalControls={<MultiplayerLinks />} />
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
