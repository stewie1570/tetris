import { useContext, useEffect } from "react";
import { useParams } from "react-router";
import { MultiplayerContext } from "../MultiplayerContext";
import { initialEmptyPlayersList } from "../constants";

export const usePlayerListSender = () => {
    const {
        gameHub, isConnected, userId: currentUserId, otherPlayers
    } = useContext(MultiplayerContext);
    const { organizerUserId } = useParams();

    useEffect(() => {
        const isConnectedWithUserId = currentUserId && isConnected;
        isConnectedWithUserId
            && otherPlayers !== initialEmptyPlayersList
            && gameHub.send.playersListUpdate({
                groupId: organizerUserId,
                message: {
                    players: Object
                        .keys(otherPlayers)
                        .map(userId => ({ userId, name: otherPlayers[userId].name }))
                }
            });
    }, [Object.keys(otherPlayers).join(','), gameHub, isConnected, currentUserId]);
};
