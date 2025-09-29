import React from "react";
import { Organizer } from "./Organizer";
import { useMultiplayerContext } from "./MultiplayerContext";
import { CommandButton } from "./components/CommandButton";
import LocalPlayerGame, {
  initialGameState,
  useLocalPlayerGameContext,
} from "./LocalPlayerGame";
import { GameChat } from "./GameChat";
import { usePlayerListener } from "./hooks/usePlayerListener";
import { useHelloSender } from "./hooks/useHelloSender";
import { useStatusSender } from "./hooks/useStatusSender";
import { useOrganizerId } from "./hooks/useOrganizerId";
import { useLifeCycle } from "./hooks/useLifeCycle";
import { BigStartButton } from "./BigStartButton";
import { Spinner } from "./components/AnimatedIcons";
import { ConnectivityInfo } from "./components/ConnectivityInfo";
import { SinglePlayerGameLink } from "./components/GameLinks";
import { GameResults } from "./components/GameResults";
import {
  UserDisconnected,
  WaitingForOrganizer,
  OrganizerDisconnected,
  ConnectionWarning
} from "./components/ConnectionStates";
import { GameHeader } from "./components/GameHeader";
import { PlayerList } from "./components/PlayerList";
import { OtherPlayersGrid } from "./components/OtherPlayersGrid";
import { useGameActions } from "./hooks/useGameActions";
import { useUserNameManagement } from "./hooks/useUserNameManagement";

export const MultiplayerGame = ({ shapeProvider }) => {
  const organizerUserId = useOrganizerId();
  const {
    gameHub,
    userId: currentUserId,
    timeProvider,
    gameEndTime,
    organizerConnectionStatus,
    isConnected,
    otherPlayers,
    gameResults,
    selectedDuration,
    setSelectedDuration,
  } = useMultiplayerContext();
  const { game, setGame, setUsername, username, prompt } =
    useLocalPlayerGameContext();
  const isOrganizer = organizerUserId === currentUserId;
  const timeLeft =
    gameEndTime && Math.max(0, Math.ceil(gameEndTime - timeProvider()));

  useLifeCycle({
    onMount: () => {
      setGame(({ mobile }) => ({ ...initialGameState, mobile, paused: true }));
    },
  });

  usePlayerListener();
  useHelloSender();
  useStatusSender();

  const { handleGameStart, handleReset, handleRetryContact } = useGameActions({
    gameHub,
    organizerUserId,
    currentUserId,
    game,
    username,
    timeLeft,
    isOrganizer,
    setGame
  });

  const { promptUserName } = useUserNameManagement({
    prompt,
    gameHub,
    organizerUserId,
    currentUserId,
    setUsername,
    username
  });

  const Game = isOrganizer ? Organizer : React.Fragment;
  const otherPlayersLink = `${window.location.protocol}//${window.location.host}/${organizerUserId}`;

  // Component instances
  const connectivityInfo = (
    <ConnectivityInfo
      organizerUserId={organizerUserId}
      otherPlayersLink={otherPlayersLink}
    />
  );

  const singlePlayerGameLink = (
    <SinglePlayerGameLink onGameStart={handleGameStart} />
  );

  const resetButton = (
    <CommandButton
      className="btn btn-primary mb-3"
      onClick={handleReset}
      runningText={
        <>
          <Spinner /> Resetting...
        </>
      }
      disableForMilliseconds={1500}
    >
      Reset Game
    </CommandButton>
  );

  const results = gameResults ? (
    <GameResults
      gameResults={gameResults}
      otherPlayers={otherPlayers}
      onGameStart={handleGameStart}
      onReset={resetButton}
    />
  ) : null;

  const retryButton = (
    <CommandButton
      className="btn btn-primary"
      onClick={handleRetryContact}
      runningText={
        <>
          <Spinner /> Contacting organizer...
        </>
      }
    >
      Retry Contacting Organizer
    </CommandButton>
  );

  const waitingForOrganizer = !organizerConnectionStatus && !isOrganizer ? (
    <WaitingForOrganizer
      onGameStart={handleGameStart}
      onRetry={retryButton}
    />
  ) : null;

  const organizerDisconnected =
    organizerConnectionStatus === "disconnected" && !isOrganizer && game.paused ? (
      <OrganizerDisconnected
        onGameStart={handleGameStart}
        onRetry={retryButton}
      />
    ) : null;

  const userIsDisconnected = isConnected === undefined ? (
    <UserDisconnected onGameStart={handleGameStart} />
  ) : null;

  const gameHeader = (
    <GameHeader
      isOrganizer={isOrganizer}
      gamePaused={game.paused}
      selectedDuration={selectedDuration}
      onDurationChange={setSelectedDuration}
      gameEndTime={gameEndTime}
      timeLeft={timeLeft}
    />
  );

  return (
    <>
      <Game>
        {userIsDisconnected ||
          waitingForOrganizer ||
          organizerDisconnected ||
          results || (
            <div className="row" style={{ margin: "1rem auto auto auto" }}>
              <LocalPlayerGame
                shapeProvider={shapeProvider}
                header={gameHeader}
                additionalControls={<>{singlePlayerGameLink}</>}
                className="col-xs-12 col-md-4"
                nextShapeStyle={{ transform: "scale(0.5)", transformOrigin: "0 0" }}
              >
                <PlayerList
                  otherPlayers={otherPlayers}
                  currentUserId={currentUserId}
                  onSetUserName={promptUserName}
                />
              </LocalPlayerGame>
              {game.paused ? (
                <div className="col-xs-12 col-md-8">
                  {connectivityInfo}
                  <GameChat />
                  <BigStartButton />
                </div>
              ) : (
                <OtherPlayersGrid
                  otherPlayers={otherPlayers}
                  currentUserId={currentUserId}
                />
              )}
            </div>
          )}
      </Game>
      <ConnectionWarning
        isConnected={isConnected}
        organizerConnectionStatus={organizerConnectionStatus}
        gamePaused={game.paused}
      />
    </>
  );
};
