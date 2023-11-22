import { useEffect, useRef } from "react";
import { namesAndScoresFrom } from "../domain/players";
import { useMultiplayerContext } from "../MultiplayerContext";
import { useLocalPlayerGameContext } from "../LocalPlayerGame";
import { useOrganizerId } from "./useOrganizerId";

export const useResultsSender = () => {
    const {
        gameHub, userId: currentUserId, timeProvider, gameEndTime, otherPlayers
    } = useMultiplayerContext();
    const organizerUserId = useOrganizerId();
    const { username, game } = useLocalPlayerGameContext();
    const timeLeft = gameEndTime && Math.max(0, Math.ceil(gameEndTime - timeProvider()));
    const externalsRef = useRef({ gameHub, currentUserId, username, game, otherPlayers });
    externalsRef.current = { gameHub, currentUserId, username, game, otherPlayers };

    useEffect(() => {
        timeLeft === 0 && externalsRef.current.gameHub.invoke.results({
            groupId: organizerUserId,
            message: namesAndScoresFrom({
                ...externalsRef.current.otherPlayers,
                [externalsRef.current.currentUserId]: {
                    name: externalsRef.current.username,
                    score: externalsRef.current.game.score
                }
            })
        });
    }, [timeLeft]);
};
