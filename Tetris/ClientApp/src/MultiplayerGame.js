import React, { useContext } from "react";
import { useParams } from "react-router";
import { Organizer } from "./Organizer";
import { MultiplayerContext } from "./MultiplayerContext";
import { CommandButton } from "./components/CommandButton";
import SinglePlayerGame, { SinglePlayerGameContext } from "./SinglePlayerGame";
import { StringInput } from "./components/Prompt";
import { stringFrom } from './domain/serialization';
import { TetrisBoard } from "./components/TetrisBoard";
import { GameMetaFrame } from "./components/GameMetaFrame";
import { Link } from "react-router-dom";
import { emptyBoard } from "./components/TetrisGame";
import { usePlayerListener } from "./hooks/usePlayerListener";
import { useHelloSender } from "./hooks/useHelloSender";
import { useStatusSender } from "./hooks/useStatusSender";
import { getDisplayTimeFrom } from './domain/time';
import { selectableDurations } from "./constants";

export const MultiplayerGame = ({ shapeProvider }) => {
    const { organizerUserId } = useParams();
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
        setSelectedDuration
    } = useContext(MultiplayerContext);
    const {
        game,
        setGame,
        setUsername,
        username,
        prompt
    } = useContext(SinglePlayerGameContext);
    const isOrganizer = organizerUserId === currentUserId;
    const timeLeft = gameEndTime && Math.max(0, Math.ceil(gameEndTime - timeProvider()));

    usePlayerListener();
    useHelloSender();
    useStatusSender();

    const promptUserName = () => prompt(exitModal => <StringInput
        filter={value => (value ?? "").trim()}
        onSubmitString={async name => {
            name && await gameHub.send.status({
                groupId: organizerUserId,
                message: {
                    userId: currentUserId,
                    name: name,
                }
            }).then(() => setUsername(name));
            exitModal();
        }}
        submittingText="Setting user name...">
        What user name would you like?
    </StringInput>);

    const startGame = () => gameHub.send.start({ groupId: organizerUserId });

    const Game = isOrganizer ? Organizer : React.Fragment;
    const otherPlayerIds = Object.keys(otherPlayers);

    const gameContextInfo = <table style={{ marginTop: "2rem" }} className="table">
        <tbody>
            <tr>
                <th>Code</th>
                <td>{organizerUserId}</td>
            </tr>
            <tr>
                <th>URL</th>
                <td>
                    {window.location.toString()}
                </td>
            </tr>
        </tbody>
    </table>;

    const singlePlayerGameLink = <>
        <Link
            style={{ display: "block", marginTop: "1rem" }}
            onClick={() => setGame(game => ({ ...game, paused: false }))}
            to="/">
            Single Player Game
        </Link>
    </>

    const resetButton = <CommandButton
        className="btn btn-primary"
        onClick={() => gameHub.invoke.reset({ groupId: organizerUserId })}>
        Reset Game
    </CommandButton>;

    const results = gameResults
        ? () => <>
            <div style={{ textAlign: "center" }}>
                <h1 style={{ color: "black" }}>Game Over</h1>
            </div>
            <table className="table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Score</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.keys(gameResults).map(userId => <tr key={userId}>
                        <td>{gameResults[userId].name}</td>
                        <td>{gameResults[userId].score}</td>
                    </tr>)}
                </tbody>
            </table>
            <div style={{ textAlign: "center" }}>
                <div>{singlePlayerGameLink}</div>
                <div>{resetButton}</div>
            </div>
        </> : undefined;

    const retryButton = <CommandButton className="btn btn-primary" onClick={() => gameHub.invoke.status({
        groupId: organizerUserId,
        message: {
            userId: currentUserId,
            board: stringFrom(game.board),
            score: game.score,
            name: username,
            timeLeft: isOrganizer ? timeLeft : undefined
        }
    })}>
        Retry Contacting Organizer
    </CommandButton>;

    const waitingForOrganizer = (!organizerConnectionStatus && !isOrganizer)
        ? () => <>
            <h1 style={{ textAlign: "center", color: "black" }}>
                Waiting for organizer...
            </h1>
            <div style={{ textAlign: "center" }}>
                <div>{singlePlayerGameLink}</div>
                <div>{retryButton}</div>
            </div>
        </> : undefined;

    const organizerDisconnected = (organizerConnectionStatus === 'disconnected' && !isOrganizer)
        ? () => <>
            <h1 style={{ textAlign: "center", color: "black" }}>
                Organizer has disconnected.
            </h1>
            <div style={{ textAlign: "center" }}>
                <div>{singlePlayerGameLink}</div>
                <div>{retryButton}</div>
            </div>
        </> : undefined

    const userIsDisconnected = isConnected ? undefined : () => <>
        <h1 style={{ textAlign: "center", color: "black" }}>
            Attempting to {isConnected === false ? " reconnect..." : " connect..."}
        </h1>
        <div style={{ textAlign: "center" }}>
            <div>{singlePlayerGameLink}</div>
        </div>
    </>

    const gameHeader = <>
        {isOrganizer && game.paused && <>
            <label htmlFor="duration">Duration:</label>
            <select
                name="duration"
                className="form-control"
                style={{ width: "242px" }}
                value={selectedDuration}
                onChange={e => setSelectedDuration(parseInt(e.target.value))}>
                {selectableDurations.map(duration => <option
                    key={duration}
                    value={duration * 1000}>
                    {getDisplayTimeFrom(duration)}
                </option>)}
            </select>
        </>}

        {gameEndTime && `Game ends in ${getDisplayTimeFrom(Math.floor(timeLeft / 1000))} seconds`}
    </>;

    return <Game>
        {
            userIsDisconnected?.()
            || waitingForOrganizer?.()
            || organizerDisconnected?.()
            || results?.()
            || <div className="row" style={{ margin: "auto" }}>
                <SinglePlayerGame
                    shapeProvider={shapeProvider}
                    header={gameHeader}
                    additionalControls={<>
                        {singlePlayerGameLink}
                        {gameContextInfo}
                    </>}
                    className={otherPlayerIds.length > 0 ? "col-xs-12 col-md-4" : undefined}>
                    <div className="leader-board" style={{ height: "100%" }}>
                        Players:
                        {Object
                            .keys(otherPlayers)
                            .map(userId => <div key={userId}>
                                {otherPlayers[userId].name ?? "[Un-named player]"}
                            </div>)}
                        <div>
                            <CommandButton onClick={promptUserName} className="btn btn-primary">
                                Set User Name
                            </CommandButton>
                        </div>
                        <div style={{ marginTop: "1rem" }}>
                            <CommandButton onClick={startGame} runningText="Starting..." className="btn btn-primary">
                                Start Game
                            </CommandButton>
                        </div>
                    </div>
                </SinglePlayerGame>
                {!game.paused && otherPlayerIds
                    .filter(userId => userId !== currentUserId && otherPlayers[userId].board)
                    .map(userId => <div className="col-xs-12 col-md-4" key={userId}>
                        <GameMetaFrame
                            game={<TetrisBoard board={otherPlayers[userId].board ?? emptyBoard} />}
                            header={<>
                                <p>{otherPlayers[userId].name ?? "[Un-named player]"}</p>
                                <p>Score: {otherPlayers[userId].score ?? 0}</p>
                            </>} />
                    </div>)}
            </div>}
    </Game>;
}
