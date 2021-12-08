import React, { useContext, useEffect } from "react";
import { useParams } from "react-router";
import { update } from "./domain/players";
import { Organizer } from "./Organizer";
import { Player } from "./Player";
import { GameHubContext } from "./SignalRGameHubContext";

export const initialEmptyPlayersList = {};

export const MultiplayerGame = () => {
    const [otherPlayers, setOtherPlayers] = React.useState(initialEmptyPlayersList);
    const { organizerUserId } = useParams();
    const { gameHub, isConnected, userId: currentUserId } = useContext(GameHubContext);
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
            status: ({ userId, ...updatedUser }) => {
                setOtherPlayers(otherPlayers => ({ ...otherPlayers, [userId]: updatedUser }));
            },
        });
        isConnectedWithUserId && gameHub.send.hello({
            groupId: organizerUserId,
            message: {
                userId: currentUserId
            }
        });
    }, [gameHub, isConnected, currentUserId]);

    const Game = isOrganizer ? Organizer : Player;

    return <Game otherPlayers={otherPlayers}>
        Players:
        {
            Object
                .keys(otherPlayers)
                .map(userId => <div key={userId}>
                    {otherPlayers[userId].name ?? "[Un-named player]"}
                </div>)
        }
    </Game>;
}

