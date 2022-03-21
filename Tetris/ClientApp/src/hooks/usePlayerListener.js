import { useContext, useEffect } from "react";
import { useParams } from "react-router";
import { update, process } from "../domain/players";
import { MultiplayerContext } from "../MultiplayerContext";
import { initialGameState, SinglePlayerGameContext } from "../SinglePlayerGame";
import { stringFrom } from '../domain/serialization';

export const usePlayerListener = () => {
    const { organizerUserId } = useParams();
    const {
        gameHub,
        isConnected,
        userId: currentUserId,
        timeProvider,
        setGameEndTime,
        setOrganizerConnectionStatus,
        setOtherPlayers,
        setGameResults,
        selectedDuration
    } = useContext(MultiplayerContext);
    const {
        game, setGame, username,
    } = useContext(SinglePlayerGameContext);
    const isOrganizer = organizerUserId === currentUserId;

    useEffect(() => {
        const isConnectedWithUserId = currentUserId && isConnected;

        isConnectedWithUserId && gameHub.receive.setHandlers({
            hello: ({ userId, ...otherProps }) => {
                setOtherPlayers(otherPlayers => ({ ...otherPlayers, [userId]: { ...otherProps } }));
            },
            playersListUpdate: ({ players: updatedPlayersList }) => {
                setOtherPlayers(otherPlayers => update(otherPlayers).with(updatedPlayersList));
                setOrganizerConnectionStatus('connected');
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
            status: ({ userId, ...userUpdates }) => {
                const { timeLeft, ...otherUpdates } = userUpdates;
                setOtherPlayers(otherPlayers => process(otherUpdates).on(userId).in(otherPlayers));
                !isOrganizer && timeLeft && setGameEndTime(timeProvider() + timeLeft);
            },
            start: () => {
                setGame(({ mobile }) => ({ ...initialGameState, mobile, paused: false }));
                isOrganizer && setGameEndTime(timeProvider() + selectedDuration);
            },
            results: results => {
                setGameResults(results);
                setGame(game => ({ ...game, paused: true }));
            },
            disconnect: ({ userId }) => setOtherPlayers(currentOtherPlayers => {
                const { [userId]: removedPlayer, ...otherPlayers } = currentOtherPlayers;
                return otherPlayers;
            }),
            noOrganizer: () => {
                setOrganizerConnectionStatus('disconnected');
                setGame(currentGame => ({ ...currentGame, paused: true }));
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

        setGame(({ mobile }) => ({ ...initialGameState, mobile, paused: true }));
    }, [gameHub, isConnected, currentUserId, isOrganizer, username, selectedDuration]);
};
