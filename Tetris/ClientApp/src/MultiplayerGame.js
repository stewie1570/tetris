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

export const initialEmptyPlayersList = {};

export const MultiplayerGame = ({ shapeProvider }) => {
    const [otherPlayers, setOtherPlayers] = React.useState(initialEmptyPlayersList);
    const { organizerUserId } = useParams();
    const { gameHub, isConnected, userId: currentUserId } = useContext(MultiplayerContext);
    const {
        game,
        setGame,
        setUsername,
        prompt
    } = useContext(SinglePlayerGameContext);
    const isOrganizer = organizerUserId === currentUserId;

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
                setOtherPlayers(otherPlayers => process(userUpdates).on(userId).in(otherPlayers));
            },
            start: () => setGame(game => ({ ...game, paused: false })),
        });
        isConnectedWithUserId && gameHub.send.hello({
            groupId: organizerUserId,
            message: {
                userId: currentUserId
            }
        });

        setGame({ ...initialGameState, paused: true });
    }, [gameHub, isConnected, currentUserId]);

    useAsyncEffect(async () => isConnected && !game.paused && gameHub.invoke.status({
        groupId: organizerUserId,
        message: {
            userId: currentUserId,
            board: stringFrom(game.board)
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

    return <Game otherPlayers={otherPlayers}>
        <SinglePlayerGame shapeProvider={shapeProvider}>
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
            <div>
                <CommandButton onClick={startGame} className="btn btn-primary">
                    Start game
                </CommandButton>
            </div>
        </SinglePlayerGame>
        <div>
            {Object
                .keys(otherPlayers)
                .filter(userId => userId !== currentUserId && otherPlayers[userId].board)
                .map(userId => <div key={userId}>
                    {otherPlayers[userId].board && <TetrisBoard board={otherPlayers[userId].board} />}
                </div>)}
        </div>
    </Game>;
}
