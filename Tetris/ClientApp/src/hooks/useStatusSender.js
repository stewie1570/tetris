import { useContext, useRef } from "react";
import { useParams } from "react-router";
import { MultiplayerContext } from "../MultiplayerContext";
import { SinglePlayerGameContext } from "../SinglePlayerGame";
import { useAsyncEffect } from './useAsyncEffect';
import { stringFrom } from '../domain/serialization';

export const useStatusSender = () => {
    const { organizerUserId } = useParams();
    const isFirstRun = useRef(true);
    const {
        gameHub, isConnected, userId: currentUserId, timeProvider, gameEndTime
    } = useContext(MultiplayerContext);
    const { game, username } = useContext(SinglePlayerGameContext);
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
