import React, { Suspense } from "react";
import LocalPlayerGame, {
  SinglePlayerGameContextProvider,
  useLocalPlayerGameContext,
} from "./LocalPlayerGame";
import { Routes, Route } from "react-router-dom";
import { shapes } from "./components/TetrisGame";
import { Dialog } from "./components/Prompt";
import { ErrorMessage } from "./components/ErrorMessage";
import { MultiplayerLinks } from "./MultiplayerLinks";
import { ReloadRecoveryErrorBoundary } from "./components/ReloadRecoveryErrorBoundary";
import { CenterScreen, Header } from "./Styling";
import { GameRoomGrid } from "./GameRoomGrid";
import { GameRooms } from "./GameRooms";
import { ControlLegend } from "./ControlLegend";

const MultiplayerGameWithContext = React.lazy(() =>
  import("./MultiplayerGameWithContext")
);

const randomNumberGenerator = {
  between: ({ min, max }) => Math.floor(Math.random() * (max + 1)) + min,
};

const defaultShapeProvider = () =>
  shapes[randomNumberGenerator.between({ min: 0, max: shapes.length - 1 })];

const GlobalUI = () => {
  const { dialogProps } = useLocalPlayerGameContext();

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
            <GameRoomGrid
              left={
                <LocalPlayerGame
                  shapeProvider={selectedShapeProvider}
                  additionalControls={<MultiplayerLinks />}
                  isOnlyPlayer
                />
              }
              right={
                <>
                  <ControlLegend />
                  <GameRooms />
                </>
              }
            />
          }
        />
        <Route
          path="/:organizerUserId"
          element={
            <ReloadRecoveryErrorBoundary>
              <Suspense
                fallback={
                  <CenterScreen>
                    <Header>Loading...</Header>
                  </CenterScreen>
                }
              >
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
