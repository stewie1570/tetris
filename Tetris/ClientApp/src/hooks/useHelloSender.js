import { useContext, useEffect, useRef } from "react";
import { MultiplayerContext } from "../MultiplayerContext";
import { useSinglePlayerGameContext } from "../SinglePlayerGame";
import { useOrganizerId } from "./useOrganizerId";

export const useHelloSender = () => {
    const organizerUserId = useOrganizerId();
    const {
        gameHub, isConnected, userId: currentUserId, setOtherPlayers
    } = useContext(MultiplayerContext);
    const { username, game } = useSinglePlayerGameContext();
    const isRunning = useRef(false);
    const isOrganizer = organizerUserId === currentUserId;

    useEffect(() => {
        isRunning.current = !game.paused;
    }, [game.paused]);

    useEffect(() => {
        const isConnectedWithUserId = currentUserId && isConnected;
        isConnectedWithUserId && gameHub.send.hello({
            groupId: organizerUserId,
            message: {
                userId: currentUserId,
                name: username,
                isRunning: isRunning.current
            }
        }).then(() => {
            !isRunning.current && setOtherPlayers(otherPlayers => ({
                ...otherPlayers,
                [currentUserId]: { name: username, score: 0 }
            }));
        });
    }, [gameHub, isConnected, currentUserId, isOrganizer]);
};
