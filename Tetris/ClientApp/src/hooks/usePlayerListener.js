import { useContext, useEffect } from "react";
import { update, process } from "../domain/players";
import { MultiplayerContext } from "../MultiplayerContext";
import { initialGameState, SinglePlayerGameContext } from "../SinglePlayerGame";
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
    } = useContext(MultiplayerContext);
    const {
        game, setGame, username,
    } = useContext(SinglePlayerGameContext);
    const isOrganizer = organizerUserId === currentUserId;

    useEffect(() => {
        const isConnectedWithUserId = currentUserId && isConnected;

        isConnectedWithUserId && gameHub.receive.setHandlers({
            hello: ({ userId, ...otherProps }) => {
                setOtherPlayers(otherPlayers => ({ ...otherPlayers, [userId]: { ...otherPlayers[userId], ...otherProps } }));
            },
            playersListUpdate: ({ players: updatedPlayersList, isStartable }) => {
                setOtherPlayers(otherPlayers => update(otherPlayers).with(updatedPlayersList));
                setOrganizerConnectionStatus('connected');
                setCanGuestStartGame(isStartable);
                const isInPlayersList = updatedPlayersList.some(({ userId }) => userId === currentUserId);
                !isInPlayersList && gameHub.invoke.status({
                    groupId: organizerUserId,
                    message: {
                        userId: currentUserId,
                        board: stringFrom(game.board),
                        score: game.score,
                        name: username
                    }
                });
            },
            status: ({ userId, timeLeft, ...otherUpdates }) => {
                setOtherPlayers(otherPlayers => process(otherUpdates).on(userId).in(otherPlayers));
                !isOrganizer && timeLeft && setGameEndTime(timeProvider() + timeLeft);
            },
            start: () => {
                setGame(({ mobile }) => ({ ...initialGameState, mobile, paused: false }));
                isOrganizer && setGameEndTime(timeProvider() + selectedDuration);
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
    }, [gameHub, isConnected, currentUserId, isOrganizer, username, selectedDuration]);
};
