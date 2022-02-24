import { useContext, useEffect } from "react";
import { useParams } from "react-router";
import { MultiplayerContext } from "../MultiplayerContext";
import { initialEmptyPlayersList } from "../MultiplayerGame";
import { SinglePlayerGameContext } from "../SinglePlayerGame";

export const usePlayerListSenderWith = ({ otherPlayers }) => {
    const {
        gameHub, isConnected, userId: currentUserId
    } = useContext(MultiplayerContext);
    const { organizerUserId } = useParams();
    const { username } = useContext(SinglePlayerGameContext);

    useEffect(() => {
        const isConnectedWithUserId = currentUserId && isConnected;
        isConnectedWithUserId
            && otherPlayers !== initialEmptyPlayersList
            && gameHub.send.playersListUpdate({
                groupId: organizerUserId,
                message: {
                    players: [
                        { userId: currentUserId, name: username },
                        ...Object
                            .keys(otherPlayers)
                            .map(userId => ({ userId, name: otherPlayers[userId].name }))
                    ]
                }
            });
    }, [Object.keys(otherPlayers).join(','), gameHub, isConnected, currentUserId]);
};
