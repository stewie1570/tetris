import { useContext, useRef } from "react";
import { MultiplayerContext } from "../MultiplayerContext";
import { useSinglePlayerGameContext } from "../SinglePlayerGame";
import { useAsyncEffect } from './useAsyncEffect';
import { stringFrom } from '../domain/serialization';
import { useOrganizerId } from "./useOrganizerId";

export const useStatusSender = () => {
    const organizerUserId = useOrganizerId();
    const isFirstRun = useRef(true);
    const {
        gameHub, isConnected, userId: currentUserId, timeProvider, gameEndTime
    } = useContext(MultiplayerContext);
    const { game, username } = useSinglePlayerGameContext();
    const isOrganizer = organizerUserId === currentUserId;
    const timeLeft = gameEndTime && Math.max(0, Math.ceil(gameEndTime - timeProvider()));

    useAsyncEffect(async () => {
        if (isFirstRun.current) {
            isFirstRun.current = false;
            return;
        }

        return isConnected && !game.paused && gameHub.invoke.status({
            groupId: organizerUserId,
            message: {
                userId: currentUserId,
                board: stringFrom(game.board),
                score: game.score,
                name: username,
                timeLeft: isOrganizer ? timeLeft : undefined
            }
        })
    }, [isConnected, game.paused, game.board]);
};
