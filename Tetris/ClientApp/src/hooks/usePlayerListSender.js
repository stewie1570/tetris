import { useEffect, useRef } from "react";
import { useMultiplayerContext } from "../MultiplayerContext";
import { initialEmptyPlayersList } from "../constants";
import { useOrganizerId } from "./useOrganizerId";

export const usePlayerListSender = () => {
    const {
        gameHub, isConnected, userId: currentUserId, otherPlayers, gameEndTime
    } = useMultiplayerContext();
    const organizerUserId = useOrganizerId();
    const isStartable = gameEndTime === null;
    const externalsRef = useRef({ gameHub, isConnected, currentUserId, isStartable });
    externalsRef.current = { gameHub, isConnected, currentUserId, isStartable };

    useEffect(() => {
        const isConnectedWithUserId = externalsRef.current.currentUserId && externalsRef.current.isConnected;
        isConnectedWithUserId
            && otherPlayers !== initialEmptyPlayersList
            && externalsRef.current.gameHub.send.playersListUpdate({
                groupId: organizerUserId,
                message: {
                    players: Object
                        .keys(otherPlayers)
                        .map(userId => ({
                            userId,
                            name: otherPlayers[userId].name,
                            disconnected: Boolean(otherPlayers[userId].disconnected)
                        })),
                    isStartable: externalsRef.current.isStartable
                }
            });
    }, [
        Object
            .keys(otherPlayers)
            .map(userId => `${userId}:${Boolean(otherPlayers[userId].disconnected)}`)
            .join(',')
    ]);
};
