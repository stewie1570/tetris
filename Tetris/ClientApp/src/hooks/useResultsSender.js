import { useEffect } from "react";
import { namesAndScoresFrom } from "../domain/players";
import { useMultiplayerContext } from "../MultiplayerContext";
import { useSinglePlayerGameContext } from "../SinglePlayerGame";
import { useOrganizerId } from "./useOrganizerId";

export const useResultsSender = () => {
    const {
        gameHub, userId: currentUserId, timeProvider, gameEndTime, otherPlayers
    } = useMultiplayerContext();
    const organizerUserId = useOrganizerId();
    const { username, game } = useSinglePlayerGameContext();
    const timeLeft = gameEndTime && Math.max(0, Math.ceil(gameEndTime - timeProvider()));

    useEffect(() => {
        timeLeft === 0 && gameHub.invoke.results({
            groupId: organizerUserId,
            message: namesAndScoresFrom({
                ...otherPlayers,
                [currentUserId]: { name: username, score: game.score }
            })
        });
    }, [timeLeft, gameHub, currentUserId, username, game.score, otherPlayers]);
};
