import { useContext, useEffect } from "react";
import { useParams } from "react-router";
import { MultiplayerContext } from "../MultiplayerContext";
import { SinglePlayerGameContext } from "../SinglePlayerGame";

export const useHelloSender = () => {
    const { organizerUserId } = useParams();
    const {
        gameHub, isConnected, userId: currentUserId, setOtherPlayers
    } = useContext(MultiplayerContext);
    const { username, game } = useContext(SinglePlayerGameContext);
    const isOrganizer = organizerUserId === currentUserId;

    useEffect(() => {
        const isConnectedWithUserId = currentUserId && isConnected;
        isConnectedWithUserId && game.paused && gameHub.send.hello({
            groupId: organizerUserId,
            message: {
                userId: currentUserId,
                name: username,
                isRunning: !game.paused
            }
        }).then(() => {
            game.paused && setOtherPlayers(otherPlayers => ({
                ...otherPlayers,
                [currentUserId]: { name: username, score: 0 }
            }));
        });
    }, [gameHub, isConnected, currentUserId, isOrganizer, game.paused]);
};
