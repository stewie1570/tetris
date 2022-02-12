import React, { useContext, useEffect } from "react";
import { useParams } from "react-router";
import { namesAndScoresFrom } from "./domain/players";
import { MultiplayerContext } from "./MultiplayerContext";
import { initialEmptyPlayersList } from "./MultiplayerGame";
import { SinglePlayerGameContext } from "./SinglePlayerGame";

export const Organizer = ({ children, otherPlayers }) => {
    const {
        gameHub,
        isConnected,
        userId: currentUserId,
        timeProvider,
        gameEndTime
    } = useContext(MultiplayerContext);
    const { organizerUserId } = useParams();
    const { username, game } = useContext(SinglePlayerGameContext);
    const timeLeft = gameEndTime && Math.max(0, Math.ceil(gameEndTime - timeProvider()));

    useEffect(() => {
        const isConnectedWithUserId = currentUserId && isConnected;
        isConnectedWithUserId
            && otherPlayers !== initialEmptyPlayersList
            && gameHub.send.playersListUpdate({
                groupId: organizerUserId,
                message: {
                    players: [
                        { userId: currentUserId, name: username },
                        ...Object
                            .keys(otherPlayers)
                            .map(userId => ({ userId, name: otherPlayers[userId].name }))
                    ]
                }
            });
    }, [Object.keys(otherPlayers).join(','), gameHub, isConnected, currentUserId]);

    useEffect(() => {
        timeLeft === 0 && gameHub.invoke.results({
            groupId: organizerUserId,
            message: namesAndScoresFrom({
                ...otherPlayers,
                [currentUserId]: { name: username, score: game.score }
            })
        });
    }, [timeLeft]);

    return <>
        {children}
    </>;
};
