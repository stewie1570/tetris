import React, { useContext } from "react";
import SinglePlayerGame, { SinglePlayerGameContext, SinglePlayerGameContextProvider } from "./SinglePlayerGame";
import { MultiplayerGame } from "./MultiplayerGame";
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { shapes } from './components/TetrisGame';
import { MultiplayerContextPassThrough } from "./MultiplayerContext";
import { Dialog } from "./components/Prompt";
import { ErrorMessage } from "./components/ErrorMessage";
import { useUserId } from "./hooks/useUserId";
import { StringInput } from "./components/Prompt";

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

const MultiplayerLinks = () => {
    const userId = useUserId();
    const { prompt } = useContext(SinglePlayerGameContext);
    const navigate = useNavigate();

    const goToMultiplayerGame = () => prompt(exitModal => <StringInput
        filter={value => (value ?? "").trim()}
        onSaveString={organizerId => {
            if (organizerId) {
                navigate(`/${organizerId}`);
                exitModal();
            }
        }}
        submittingText="Posting Your Score...">
        Game Code:
    </StringInput>);

    return <>
        <Link
            style={{ marginTop: "1rem", display: "block" }}
            to={`/${userId}`}>Host Multiplayer Game</Link>

        <button type="button" className="btn btn-link" onClick={goToMultiplayerGame}>
            Join Multiplayer Game
        </button>
    </>;
}
