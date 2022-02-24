import { useContext, useEffect } from "react";
import { useParams } from "react-router";
import { MultiplayerContext } from "../MultiplayerContext";
import { SinglePlayerGameContext } from "../SinglePlayerGame";

export const useHelloSender = () => {
    const { organizerUserId } = useParams();
    const {
        gameHub, isConnected, userId: currentUserId
    } = useContext(MultiplayerContext);
    const { username } = useContext(SinglePlayerGameContext);
    const isOrganizer = organizerUserId === currentUserId;

    useEffect(() => {
        const isConnectedWithUserId = currentUserId && isConnected;
        isConnectedWithUserId && gameHub.send.hello({
            groupId: organizerUserId,
            message: {
                userId: currentUserId,
                name: username
            }
        });
    }, [gameHub, isConnected, currentUserId, isOrganizer]);
};
