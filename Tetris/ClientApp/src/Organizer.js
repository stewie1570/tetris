import React, { useContext, useEffect } from "react";
import { useParams } from "react-router";
import { MultiplayerContext } from "./MultiplayerContext";
import { initialEmptyPlayersList } from "./MultiplayerGame";

export const Organizer = ({ children, otherPlayers }) => {
    const { gameHub, isConnected, userId: currentUserId } = useContext(MultiplayerContext);
    const { organizerUserId } = useParams();

    useEffect(() => {
        const isConnectedWithUserId = currentUserId && isConnected;
        isConnectedWithUserId
            && otherPlayers !== initialEmptyPlayersList
            && gameHub.send.playersListUpdate({
                groupId: organizerUserId,
                message: {
                    players: [currentUserId, ...Object.keys(otherPlayers)]
                }
            });
    }, [Object.keys(otherPlayers).join(','), gameHub, isConnected, currentUserId]);

    return <>
        {children}
    </>;
};
