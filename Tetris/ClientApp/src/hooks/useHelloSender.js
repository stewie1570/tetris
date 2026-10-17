import { useEffect, useRef } from "react";
import { useMultiplayerContext } from "../MultiplayerContext";
import { useLocalPlayerGameContext } from "../LocalPlayerGame";
import { useOrganizerId } from "./useOrganizerId";

export const useHelloSender = () => {
    const organizerUserId = useOrganizerId();
    const {
        gameHub, isConnected, userId: currentUserId, setOtherPlayers
    } = useMultiplayerContext();
    const { username, game } = useLocalPlayerGameContext();
    const externalsRef = useRef({ isRunning: !game.paused, gameHub });

    externalsRef.current = { isRunning: !game.paused, gameHub };

    useEffect(() => {
        const isConnectedWithUserId = currentUserId && isConnected;
        isConnectedWithUserId && externalsRef.current.gameHub.send.hello({
            groupId: organizerUserId,
            message: {
                userId: currentUserId,
                name: username,
                isRunning: externalsRef.current.isRunning
            }
        }).then(() => {
            if (externalsRef.current.isRunning) {
                return;
            }

            setOtherPlayers(otherPlayers => {
                const existing = otherPlayers[currentUserId] ?? {};
                return {
                    ...otherPlayers,
                    [currentUserId]: {
                        ...existing,
                        name: username ?? existing.name,
                        score: 0
                    }
                };
            });
        });
    }, [isConnected, currentUserId]);
};
