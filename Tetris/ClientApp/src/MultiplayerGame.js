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
    const [gameEndTime, setGameEndTime] = React.useState(null);
    const { organizerUserId } = useParams();
    const { gameHub, isConnected, userId: currentUserId, timeProvider } = useContext(MultiplayerContext);
    const {
        game,
        setGame,
        setUsername,
        prompt
    } = useContext(SinglePlayerGameContext);
    const isOrganizer = organizerUserId === currentUserId;
    const timeLeft = gameEndTime && Math.ceil(gameEndTime - timeProvider());

    useEffect(() => {
        const isConnectedWithUserId = currentUserId && isConnected;

        isConnectedWithUserId && gameHub.receive.setHandlers({
            hello: ({ userId }) => {
                setOtherPlayers(otherPlayers => ({ ...otherPlayers, [userId]: {} }));
            },
            playersListUpdate: ({ players: updatedPlayersList }) => {
                setOtherPlayers(otherPlayers => update(otherPlayers).with(updatedPlayersList));
            },
            status: ({ userId, ...userUpdates }) => {
                const { timeLeft, ...otherUpdates } = userUpdates;
                setOtherPlayers(otherPlayers => process(otherUpdates).on(userId).in(otherPlayers));
                !isOrganizer && timeLeft && setGameEndTime(timeProvider() + timeLeft);
            },
            start: () => {
                setGame(game => ({ ...game, paused: false }));
                isOrganizer && setGameEndTime(timeProvider() + 60000);
            }
        });
        isConnectedWithUserId && gameHub.send.hello({
            groupId: organizerUserId,
            message: {
                userId: currentUserId
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

    return <Game otherPlayers={otherPlayers}>
        <div className="row" style={{ margin: "auto" }}>
            <SinglePlayerGame
                shapeProvider={shapeProvider}
                header={gameEndTime && `Game ends in ${Math.floor(timeLeft / 1000)} seconds`}
                additionalControls={<Link style={{ display: "block", marginTop: "1rem" }} to="/">Back To Single Player Game</Link>}
                className={otherPlayerIds.length > 0 ? "col-xs-12 col-md-4" : undefined}>
                <div className="leader-board" style={{ height: "100%" }}>
                    Players:
                    {
                        Object
                            .keys(otherPlayers)
                            .map(userId => <div key={userId}>
                                {otherPlayers[userId].name ?? "[Un-named player]"}
                            </div>)
                    }
                    <div>
                        <CommandButton onClick={promptUserName} className="btn btn-primary">
                            Set user name
                        </CommandButton>
                    </div>
                    <div style={{ marginTop: "1rem" }}>
                        <CommandButton onClick={startGame} className="btn btn-primary">
                            Start game
                        </CommandButton>
                    </div>
                </div>
            </SinglePlayerGame>
            {otherPlayerIds
                .filter(userId => userId !== currentUserId && otherPlayers[userId].board)
                .map(userId => <div className="col-xs-12 col-md-4" key={userId}>
                    {
                        otherPlayers[userId].board &&
                        <GameMetaFrame
                            game={<TetrisBoard board={otherPlayers[userId].board} />}
                            header={<>
                                <p>{otherPlayers[userId].name ?? "[Un-named player]"}</p>
                                <p>Score: {otherPlayers[userId].score ?? 0}</p>
                            </>} />
                    }
                </div>)}
        </div>
    </Game>;
}
