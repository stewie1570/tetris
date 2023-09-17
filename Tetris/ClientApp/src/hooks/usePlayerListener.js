import { useEffect, useRef } from "react";
import { update, process } from "../domain/players";
import { useMultiplayerContext } from "../MultiplayerContext";
import { initialGameState, useSinglePlayerGameContext } from "../SinglePlayerGame";
import { stringFrom } from '../domain/serialization';
import { useOrganizerId } from "./useOrganizerId";

export const usePlayerListener = () => {
    const organizerUserId = useOrganizerId();
    const {
        gameHub,
        isConnected,
        userId: currentUserId,
        timeProvider,
        setGameEndTime,
        setOrganizerConnectionStatus,
        setOtherPlayers,
        setGameResults,
        selectedDuration,
        setCanGuestStartGame
    } = useMultiplayerContext();
    const {
        game, setGame, username,
    } = useSinglePlayerGameContext();
    const isOrganizer = organizerUserId === currentUserId;
    const externalsRef = useRef({ gameHub, isOrganizer, username, selectedDuration });
    externalsRef.current = { gameHub, isOrganizer, username, selectedDuration };

    useEffect(() => {
        const isConnectedWithUserId = currentUserId && isConnected;

        isConnectedWithUserId && externalsRef.current.gameHub.receive.setHandlers({
            hello: ({ userId, ...otherProps }) => {
                setOtherPlayers(otherPlayers => ({ ...otherPlayers, [userId]: { ...otherPlayers[userId], ...otherProps } }));
            },
            playersListUpdate: ({ players: updatedPlayersList, isStartable }) => {
                setOtherPlayers(otherPlayers => update(otherPlayers).with(updatedPlayersList));
                setOrganizerConnectionStatus('connected');
                setCanGuestStartGame(isStartable);
                const isInPlayersList = updatedPlayersList.some(({ userId }) => userId === currentUserId);
                !isInPlayersList && externalsRef.current.gameHub.invoke.status({
                    groupId: organizerUserId,
                    message: {
                        userId: currentUserId,
                        board: stringFrom(game.board),
                        score: game.score,
                        name: externalsRef.current.username
                    }
                });
            },
            status: ({ userId, timeLeft, ...otherUpdates }) => {
                setOtherPlayers(otherPlayers => process(otherUpdates).on(userId).in(otherPlayers));
                !externalsRef.current.isOrganizer && timeLeft && setGameEndTime(timeProvider() + timeLeft);
            },
            start: () => {
                setGame(({ mobile }) => ({ ...initialGameState, mobile, paused: false }));
                setGameResults(null);
                externalsRef
                    .current
                    .isOrganizer && setGameEndTime(timeProvider() + externalsRef.current.selectedDuration);
            },
            results: results => {
                setGameResults(results);
                setGameEndTime(null);
                setGame(game => ({ ...game, paused: true }));
            },
            disconnect: ({ userId }) => setOtherPlayers(currentOtherPlayers => {
                const { [userId]: removedPlayer, ...otherPlayers } = currentOtherPlayers;
                return otherPlayers;
            }),
            noOrganizer: () => {
                setOrganizerConnectionStatus('disconnected');
            },
            reset: () => {
                setGameResults(null);
                setGameEndTime(null);
                setGame(({ mobile }) => ({ ...initialGameState, mobile, paused: true }));
                setOtherPlayers(otherPlayers => [{}, ...Object.keys(otherPlayers)].reduce((currentPlayers, userId) => ({
                    ...currentPlayers,
                    [userId]: { name: otherPlayers[userId].name, score: 0 }
                })));
            }
        });
    }, [isConnected, currentUserId]);
};
