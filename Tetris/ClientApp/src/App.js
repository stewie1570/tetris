import React, { Suspense, useContext } from "react";
import SinglePlayerGame, { SinglePlayerGameContext, SinglePlayerGameContextProvider } from "./SinglePlayerGame";
import { Routes, Route } from 'react-router-dom';
import { shapes } from './components/TetrisGame';
import { Dialog } from "./components/Prompt";
import { ErrorMessage } from "./components/ErrorMessage";
import { MultiplayerLinks } from "./MultiplayerLinks";
import { ReloadRecoveryErrorBoundary } from './components/ReloadRecoveryErrorBoundary';

const MultiplayerGameWithContext = React.lazy(() => import("./MultiplayerGameWithContext"));

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
                element={<ReloadRecoveryErrorBoundary>
                    <Suspense
                        fallback={<h1 style={{ textAlign: "center", color: "black" }}>
                            Loading...
                        </h1>}>
                        <MultiplayerGameWithContext shapeProvider={selectedShapeProvider} />
                    </Suspense>
                </ReloadRecoveryErrorBoundary>} />
        </Routes>
        <GlobalUI />
    </SinglePlayerGameContextProvider>;
};
