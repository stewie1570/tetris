import { useEffect } from "react";
import { useMultiplayerContext } from "../MultiplayerContext";
import { initialEmptyPlayersList } from "../constants";
import { useOrganizerId } from "./useOrganizerId";

export const usePlayerListSender = () => {
    const {
        gameHub, isConnected, userId: currentUserId, otherPlayers, gameEndTime
    } = useMultiplayerContext();
    const organizerUserId = useOrganizerId();
    const isStartable = gameEndTime === null;

    useEffect(() => {
        const isConnectedWithUserId = currentUserId && isConnected;
        isConnectedWithUserId
            && otherPlayers !== initialEmptyPlayersList
            && gameHub.send.playersListUpdate({
                groupId: organizerUserId,
                message: {
                    players: Object
                        .keys(otherPlayers)
                        .map(userId => ({ userId, name: otherPlayers[userId].name })),
                    isStartable
                }
            });
    }, [Object.keys(otherPlayers).join(','), gameHub, isConnected, currentUserId, isStartable]);
};
