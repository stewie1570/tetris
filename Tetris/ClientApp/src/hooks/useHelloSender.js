import { useContext, useEffect, useRef } from "react";
import { useParams } from "react-router";
import { MultiplayerContext } from "../MultiplayerContext";
import { SinglePlayerGameContext } from "../SinglePlayerGame";

export const useHelloSender = () => {
    const { organizerUserId } = useParams();
    const {
        gameHub, isConnected, userId: currentUserId, setOtherPlayers
    } = useContext(MultiplayerContext);
    const { username, game } = useContext(SinglePlayerGameContext);
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
