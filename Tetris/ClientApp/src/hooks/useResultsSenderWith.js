import { useContext, useEffect } from "react";
import { useParams } from "react-router";
import { namesAndScoresFrom } from "../domain/players";
import { MultiplayerContext } from "../MultiplayerContext";
import { SinglePlayerGameContext } from "../SinglePlayerGame";

export const useResultsSenderWith = ({ otherPlayers }) => {
    const {
        gameHub, userId: currentUserId, timeProvider, gameEndTime
    } = useContext(MultiplayerContext);
    const { organizerUserId } = useParams();
    const { username, game } = useContext(SinglePlayerGameContext);
    const timeLeft = gameEndTime && Math.max(0, Math.ceil(gameEndTime - timeProvider()));

    useEffect(() => {
        timeLeft === 0 && gameHub.invoke.results({
            groupId: organizerUserId,
            message: namesAndScoresFrom({
                ...otherPlayers,
                [currentUserId]: { name: username, score: game.score }
            })
        });
    }, [timeLeft]);
};
