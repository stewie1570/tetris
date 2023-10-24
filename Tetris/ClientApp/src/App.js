import React, { Suspense } from "react";
import SinglePlayerGame, {
  SinglePlayerGameContextProvider,
  useSinglePlayerGameContext,
} from "./SinglePlayerGame";
import { Routes, Route } from "react-router-dom";
import { shapes } from "./components/TetrisGame";
import { Dialog } from "./components/Prompt";
import { ErrorMessage } from "./components/ErrorMessage";
import { MultiplayerLinks } from "./MultiplayerLinks";
import { ReloadRecoveryErrorBoundary } from "./components/ReloadRecoveryErrorBoundary";
import { Header } from "./Styling";

const MultiplayerGameWithContext = React.lazy(() =>
  import("./MultiplayerGameWithContext")
);

const randomNumberGenerator = {
  between: ({ min, max }) => Math.floor(Math.random() * (max + 1)) + min,
};

const defaultShapeProvider = () =>
  shapes[randomNumberGenerator.between({ min: 0, max: shapes.length - 1 })];

const GlobalUI = () => {
  const { dialogProps } = useSinglePlayerGameContext();

  return (
    <>
      <Dialog {...dialogProps} />
      <ErrorMessage />
    </>
  );
};

export const App = ({ shapeProvider }) => {
  const selectedShapeProvider = shapeProvider ?? defaultShapeProvider;

  return (
    <SinglePlayerGameContextProvider>
      <Routes>
        <Route
          path="/"
          element={
            <SinglePlayerGame
              shapeProvider={selectedShapeProvider}
              additionalControls={<MultiplayerLinks />}
              isStartable
            />
          }
        />
        <Route
          path="/:organizerUserId"
          element={
            <ReloadRecoveryErrorBoundary>
              <Suspense fallback={<Header>Loading...</Header>}>
                <MultiplayerGameWithContext
                  shapeProvider={selectedShapeProvider}
                />
              </Suspense>
            </ReloadRecoveryErrorBoundary>
          }
        />
      </Routes>
      <GlobalUI />
    </SinglePlayerGameContextProvider>
  );
};
