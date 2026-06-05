import React, { useRef } from "react";
import { Organizer } from "./Organizer";
import { useMultiplayerContext } from "./MultiplayerContext";
import { CommandButton } from "./components/CommandButton";
import LocalPlayerGame, {
  initialGameState,
  useLocalPlayerGameContext,
} from "./LocalPlayerGame";
import { GameChat } from "./GameChat";
import { GameOptions } from "./GameOptions";
import { useMultiplayerFullscreen } from "./hooks/useMultiplayerFullscreen";
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
    fullscreenEnabled,
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

  const { startGame, resetGame, retryContact } = useGameActions({
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
    <SinglePlayerGameLink onGameStart={startGame} />
  );

  const resetButton = (
    <CommandButton
      className="btn btn-primary mb-3"
      onClick={resetGame}
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
      onGameStart={startGame}
      resetButton={resetButton}
    />
  ) : null;

  const retryButton = (
    <CommandButton
      className="btn btn-primary"
      onClick={retryContact}
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
      onGameStart={startGame}
      retryButton={retryButton}
    />
  ) : null;

  const organizerDisconnected =
    organizerConnectionStatus === "disconnected" && !isOrganizer && game.paused ? (
      <OrganizerDisconnected
        onGameStart={startGame}
        retryButton={retryButton}
      />
    ) : null;

  const userIsDisconnected = isConnected === undefined ? (
    <UserDisconnected onGameStart={startGame} />
  ) : null;

  const isFullscreenLayout = fullscreenEnabled && !game.paused;
  const gameContainerRef = useRef(null);

  useMultiplayerFullscreen({
    containerRef: gameContainerRef,
    enabled: fullscreenEnabled,
    active: !game.paused,
  });

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
            <div
              ref={gameContainerRef}
              className={`row${isFullscreenLayout ? " multiplayer-fullscreen-layout" : ""}`}
              style={{
                margin: "1rem auto auto auto",
                ...(isFullscreenLayout && {
                  background: "var(--color-page-bg, #1a1a2e)",
                  minHeight: "100vh",
                  padding: "1rem",
                }),
              }}
            >
              <div
                className={
                  isFullscreenLayout ? "col-xs-12 col-md-8" : "col-xs-12 col-md-4"
                }
              >
                <LocalPlayerGame
                  shapeProvider={shapeProvider}
                  header={gameHeader}
                  additionalControls={<>{singlePlayerGameLink}</>}
                  nextShapeStyle={{ transform: "scale(0.5)", transformOrigin: "0 0" }}
                >
                  <PlayerList
                    otherPlayers={otherPlayers}
                    currentUserId={currentUserId}
                    onSetUserName={promptUserName}
                  />
                </LocalPlayerGame>
              </div>
              {game.paused ? (
                <div className="col-xs-12 col-md-8">
                  {connectivityInfo}
                  <GameChat />
                  <GameOptions />
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
