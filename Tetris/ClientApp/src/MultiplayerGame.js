import React, { useContext, useEffect } from "react";
import { useParams } from "react-router";
import { update, process } from "./domain/players";
import { Organizer } from "./Organizer";
import { Player } from "./Player";
import { MultiplayerContext } from "./MultiplayerContext";
import { CommandButton } from "./components/CommandButton";
import SinglePlayerGame, { initialGameState, SinglePlayerGameContext } from "./SinglePlayerGame";
import { StringInput } from "./components/Prompt";
import { useAsyncEffect } from './hooks/useAsyncEffect';
import { stringFrom } from './domain/serialization';
import { TetrisBoard } from "./components/TetrisBoard";
import { GameMetaFrame } from "./components/GameMetaFrame";
import { Link } from "react-router-dom";

export const initialEmptyPlayersList = {};

export const MultiplayerGame = ({ shapeProvider }) => {
    const [otherPlayers, setOtherPlayers] = React.useState(initialEmptyPlayersList);
    const { organizerUserId } = useParams();
    const {
        gameHub,
        isConnected,
        userId: currentUserId,
        timeProvider,
        gameEndTime,
        setGameEndTime,
        isOrganizerDisconnected,
        setIsOrganizerDisconnected
    } = useContext(MultiplayerContext);
    const {
        game,
        setGame,
        setUsername,
        username,
        prompt
    } = useContext(SinglePlayerGameContext);
    const isOrganizer = organizerUserId === currentUserId;
    const isAccepted = Boolean(otherPlayers[currentUserId])
    const timeLeft = gameEndTime && Math.max(0, Math.ceil(gameEndTime - timeProvider()));
    const [gameResults, setGameResults] = React.useState(null);

    useEffect(() => {
        const isConnectedWithUserId = currentUserId && isConnected;

        isConnectedWithUserId && gameHub.receive.setHandlers({
            hello: ({ userId, ...otherProps }) => {
                setOtherPlayers(otherPlayers => ({ ...otherPlayers, [userId]: { ...otherProps } }));
            },
            playersListUpdate: ({ players: updatedPlayersList }) => {
                setIsOrganizerDisconnected(false);
                setOtherPlayers(otherPlayers => update(otherPlayers).with(updatedPlayersList));
                const isInPlayersList = updatedPlayersList.some(({ userId }) => userId === currentUserId);
                !isInPlayersList && gameHub.invoke.status({
                    groupId: organizerUserId,
                    message: {
                        userId: currentUserId,
                        board: stringFrom(game.board),
                        score: game.score,
                        timeLeft: isOrganizer ? timeLeft : undefined
                    }
                })
            },
            status: ({ userId, ...userUpdates }) => {
                const { timeLeft, ...otherUpdates } = userUpdates;
                setIsOrganizerDisconnected(false);
                setOtherPlayers(otherPlayers => process(otherUpdates).on(userId).in(otherPlayers));
                !isOrganizer && timeLeft && setGameEndTime(timeProvider() + timeLeft);
            },
            start: () => {
                setGame(game => ({ ...game, paused: false }));
                isOrganizer && setGameEndTime(timeProvider() + 60000);
            },
            results: results => {
                setGameResults(results);
                setGame(game => ({ ...game, paused: true }));
            },
            disconnect: ({ userId }) => setOtherPlayers(currentOtherPlayers => {
                const { [userId]: removedPlayer, ...otherPlayers } = currentOtherPlayers;
                return otherPlayers;
            }),
            noOrganizer: () => {
                setIsOrganizerDisconnected(true);
            },
            reset: () => {
                setGame({ ...initialGameState, paused: true });
                setGameResults(null);
                setGameEndTime(null);
                setOtherPlayers(otherPlayers => [{}, ...Object.keys(otherPlayers)].reduce((currentPlayers, userId) => ({
                    ...currentPlayers,
                    [userId]: { name: otherPlayers[userId].name, score: 0 }
                })));
            }
        });
        isConnectedWithUserId && gameHub.send.hello({
            groupId: organizerUserId,
            message: {
                userId: currentUserId,
                name: username
            }
        });

        setGame({ ...initialGameState, paused: true });
    }, [gameHub, isConnected, currentUserId, isOrganizer]);

    useAsyncEffect(async () => isConnected && !game.paused && gameHub.invoke.status({
        groupId: organizerUserId,
        message: {
            userId: currentUserId,
            board: stringFrom(game.board),
            score: game.score,
            timeLeft: isOrganizer ? timeLeft : undefined
        }
    }), [isConnected, game.paused, game.board]);

    const promptUserName = () => prompt(exitModal => <StringInput
        filter={value => (value ?? "").trim()}
        onSaveString={async name => {
            name && await gameHub.send.status({
                groupId: organizerUserId,
                message: {
                    userId: currentUserId,
                    name: name,
                }
            });
            setUsername(name);
            exitModal();
        }}
        submittingText="Setting user name...">
        What user name would you like?
    </StringInput>);

    const startGame = () => gameHub.send.start({ groupId: organizerUserId });

    const Game = isOrganizer ? Organizer : Player;
    const otherPlayerIds = Object.keys(otherPlayers);
    const singlePlayerGameLink = <Link
        style={{ display: "block", marginTop: "1rem" }}
        onClick={() => setGame(game => ({ ...game, paused: false }))}
        to="/">
        Single Player Game
    </Link>;

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
            timeLeft: isOrganizer ? timeLeft : undefined
        }
    })}>
        Retry Contacting Organizer
    </CommandButton>;

    const waitingForOrganizer = (!isAccepted && !isOrganizer)
        ? () => <>
            <h1 style={{ textAlign: "center", color: "black" }}>
                Unable to contact organizer...
            </h1>
            <div style={{ textAlign: "center" }}>
                <div>{singlePlayerGameLink}</div>
                <div>{retryButton}</div>
            </div>
        </> : undefined;

    const organizerDisconnected = isOrganizerDisconnected
        ? () => <>
            <h1 style={{ textAlign: "center", color: "black" }}>
                Organizer has disconnected.
            </h1>
            <div style={{ textAlign: "center" }}>
                <div>{singlePlayerGameLink}</div>
                <div>{retryButton}</div>
            </div>
        </> : undefined

    return <Game otherPlayers={otherPlayers}>
        {
            organizerDisconnected?.()
            || waitingForOrganizer?.()
            || results?.()
            || <div className="row" style={{ margin: "auto" }}>
                <SinglePlayerGame
                    shapeProvider={shapeProvider}
                    header={gameEndTime && `Game ends in ${Math.floor(timeLeft / 1000)} seconds`}
                    additionalControls={singlePlayerGameLink}
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
                                Set user name
                            </CommandButton>
                        </div>
                        <div style={{ marginTop: "1rem" }}>
                            <CommandButton onClick={startGame} runningText="Starting..." className="btn btn-primary">
                                Start game
                            </CommandButton>
                        </div>
                    </div>
                </SinglePlayerGame>
                {otherPlayerIds
                    .filter(userId => userId !== currentUserId && otherPlayers[userId].board)
                    .map(userId => <div className="col-xs-12 col-md-4" key={userId}>
                        {otherPlayers[userId].board &&
                            <GameMetaFrame
                                game={<TetrisBoard board={otherPlayers[userId].board} />}
                                header={<>
                                    <p>{otherPlayers[userId].name ?? "[Un-named player]"}</p>
                                    <p>Score: {otherPlayers[userId].score ?? 0}</p>
                                </>} />}
                    </div>)}
            </div>}
    </Game>;
}
