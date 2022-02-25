import { useContext, useEffect } from "react";
import { useParams } from "react-router";
import { MultiplayerContext } from "../MultiplayerContext";
import { initialEmptyPlayersList } from "../MultiplayerGame";

export const usePlayerListSenderWith = ({ otherPlayers }) => {
    const {
        gameHub, isConnected, userId: currentUserId
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
