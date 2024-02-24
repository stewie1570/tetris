import React from "react";
import { Organizer } from "./Organizer";
import { useMultiplayerContext } from "./MultiplayerContext";
import { CommandButton } from "./components/CommandButton";
import LocalPlayerGame, {
  initialGameState,
  useLocalPlayerGameContext,
} from "./LocalPlayerGame";
import { StringInput } from "./components/Prompt";
import { stringFrom } from "./domain/serialization";
import { TetrisBoard } from "./components/TetrisBoard";
import { GameMetaFrame } from "./components/GameMetaFrame";
import { Link } from "react-router-dom";
import { GameChat } from "./GameChat";
import { emptyBoard } from "./components/TetrisGame";
import { usePlayerListener } from "./hooks/usePlayerListener";
import { useHelloSender } from "./hooks/useHelloSender";
import { useStatusSender } from "./hooks/useStatusSender";
import { getDisplayTimeFrom } from "./domain/time";
import { selectableDurations } from "./constants";
import { LeaderBoard } from "./ScoreBoard";
import { CenterScreen, Centered, Header, Warning } from "./Styling";
import { useOrganizerId } from "./hooks/useOrganizerId";
import { useLifeCycle } from "./hooks/useLifeCycle";
import styled from "styled-components";
import { CopyButton } from "./components/CopyButton";
import { BigStartButton } from "./BigStartButton";
import { Spinner } from "./components/AnimatedIcons";

const GameDurationSelect = styled.select`
  width: 90%;
`;

const trimHubExceptionMessage = (message) => {
  const seperator = "HubException: ";
  return message.split(seperator)[1] ?? message;
};

const BoldRed = styled.span`
  font-weight: bold;
  color: red;
`;

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

  const promptUserName = () =>
    prompt((exitModal) => (
      <StringInput
        filter={(value) => (value ?? "").trim()}
        onSubmitString={async (name) => {
          name
            ? await gameHub.invoke
              .status({
                groupId: organizerUserId,
                message: {
                  userId: currentUserId,
                  name: name,
                },
              })
              .then(() => setUsername(name))
              .then(exitModal)
              .catch(({ message }) =>
                window.dispatchEvent(
                  new CustomEvent("user-error", {
                    detail: trimHubExceptionMessage(message),
                  })
                )
              )
            : exitModal();
        }}
        submittingText={
          <>
            <Spinner /> Setting user name...
          </>
        }
        initialValue={username}
      >
        What user name would you like?
      </StringInput>
    ));

  const Game = isOrganizer ? Organizer : React.Fragment;
  const otherPlayerIds = Object.keys(otherPlayers);
  const otherPlayersLink = `${window.location.protocol}//${window.location.host}/${organizerUserId}`;

  const gameContextInfo = (
    <div className="card" style={{ marginTop: "1rem" }}>
      <div className="card-header">Connectivity</div>
      <div className="card-body" style={{ padding: 0 }}>
        <table className="table" style={{ marginBottom: 0 }}>
          <thead>
            <tr>
              <th colSpan={2}>
                Other players can join via the Code or URL below:
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>Code</th>
              <td>
                {organizerUserId}
                <br />
                <CopyButton text={organizerUserId} />
              </td>
            </tr>
            <tr>
              <th>URL</th>
              <td>
                {otherPlayersLink}
                <br />
                <CopyButton text={otherPlayersLink} />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );

  const singlePlayerGameLink = (
    <>
      <Link
        style={{ display: "block" }}
        onClick={() => setGame((game) => ({ ...game, paused: false }))}
        to="/"
      >
        Single Player Game
      </Link>
    </>
  );

  const resetButton = (
    <CommandButton
      className="btn btn-primary mb-3"
      onClick={() => gameHub.invoke.reset({ groupId: organizerUserId })}
    >
      Reset Game
    </CommandButton>
  );

  const results = gameResults
    ? () => (
      <Centered>
        <Header style={{ width: "90%", display: "inline-block" }}>
          Game Over
        </Header>
        <div
          className="card mb-3"
          style={{ display: "inline-block", width: "90%", textAlign: "left" }}
        >
          <div className="card-header">Results</div>
          <div className="card-body p-0">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Score</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(otherPlayers).map((userId) => (
                  <tr key={userId}>
                    <td>
                      {otherPlayers[userId].name ?? "[Un-named Player]"}
                    </td>
                    <td>{gameResults[userId]?.score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <GameChat style={{ width: "90%", display: "inline-block" }} />
        <div>{singlePlayerGameLink}</div>
        <div>{resetButton}</div>
      </Centered>
    )
    : undefined;

  const retryButton = (
    <CommandButton
      className="btn btn-primary m-3"
      onClick={() =>
        gameHub.invoke.status({
          groupId: organizerUserId,
          message: {
            userId: currentUserId,
            board: stringFrom(game.board),
            score: game.score,
            name: username,
            timeLeft: isOrganizer ? timeLeft : undefined,
          },
        })
      }
      runningText={<><Spinner /> Contacting organizer...</>}
    >
      Retry Contacting Organizer
    </CommandButton>
  );

  const waitingForOrganizer =
    !organizerConnectionStatus && !isOrganizer
      ? () => (
        <CenterScreen>
          <Header>Waiting for organizer...</Header>
          <Centered>
            <div>{singlePlayerGameLink}</div>
            <div>{retryButton}</div>
          </Centered>
        </CenterScreen>
      )
      : undefined;

  const organizerDisconnected =
    organizerConnectionStatus === "disconnected" && !isOrganizer && game.paused
      ? () => (
        <CenterScreen>
          <Header>Organizer has disconnected.</Header>
          <Centered>
            <div>{singlePlayerGameLink}</div>
            <div>{retryButton}</div>
          </Centered>
        </CenterScreen>
      )
      : undefined;

  const userIsDisconnected =
    isConnected === undefined
      ? () => (
        <CenterScreen>
          <Header>
            <Spinner /> Connecting to game server...
          </Header>
          <Centered>
            <div>{singlePlayerGameLink}</div>
          </Centered>
        </CenterScreen>
      )
      : undefined;

  const gameHeader = (
    <>
      {isOrganizer && game.paused && (
        <>
          <label htmlFor="duration">Duration:</label>
          <GameDurationSelect
            name="duration"
            className="form-control"
            value={selectedDuration}
            onChange={(e) => setSelectedDuration(parseInt(e.target.value))}
          >
            {selectableDurations.map((duration) => (
              <option key={duration} value={duration * 1000}>
                {getDisplayTimeFrom(duration)}
              </option>
            ))}
          </GameDurationSelect>
        </>
      )}

      {gameEndTime && (
        <BoldRed>
          Game ends in {getDisplayTimeFrom(Math.floor(timeLeft / 1000))}{" "}
          seconds.
        </BoldRed>
      )}
    </>
  );

  return (
    <>
      <Game>
        {userIsDisconnected?.() ||
          waitingForOrganizer?.() ||
          organizerDisconnected?.() ||
          results?.() || (
            <div className="row" style={{ margin: "auto" }}>
              <LocalPlayerGame
                shapeProvider={shapeProvider}
                header={gameHeader}
                additionalControls={<>{singlePlayerGameLink}</>}
                className="col-xs-12 col-md-4"
              >
                <LeaderBoard style={{ height: "100%" }}>
                  Players:
                  {Object.keys(otherPlayers)
                    .filter((userId) => !otherPlayers[userId].disconnected)
                    .map((userId) => (
                      <div
                        className={userId === currentUserId ? "bold" : ""}
                        key={userId}
                      >
                        {otherPlayers[userId].name ?? "[Un-named player]"}
                      </div>
                    ))}
                  <div>
                    <CommandButton
                      onClick={promptUserName}
                      className="btn btn-primary"
                    >
                      Set User Name
                    </CommandButton>
                  </div>
                </LeaderBoard>
              </LocalPlayerGame>
              {game.paused ? (
                <div className="col-xs-12 col-md-8">
                  {gameContextInfo}
                  <GameChat />
                  <BigStartButton />
                </div>
              ) : (
                otherPlayerIds
                  .filter(
                    (userId) =>
                      userId !== currentUserId &&
                      otherPlayers[userId].board &&
                      !otherPlayers[userId].disconnected
                  )
                  .map((userId) => (
                    <div className="col-xs-12 col-md-4" key={userId}>
                      <GameMetaFrame
                        game={
                          <TetrisBoard
                            board={otherPlayers[userId].board ?? emptyBoard}
                          />
                        }
                        header={
                          <>
                            <p>
                              {otherPlayers[userId].name ?? "[Un-named player]"}
                            </p>
                            <p>Score: {otherPlayers[userId].score ?? 0}</p>
                          </>
                        }
                      />
                    </div>
                  ))
              )}
            </div>
          )}
      </Game>
      {isConnected === false && <Warning>Reconnecting...</Warning>}
      {!game.paused && organizerConnectionStatus === "disconnected" && (
        <Warning>Organizer is disconnected.</Warning>
      )}
    </>
  );
};
