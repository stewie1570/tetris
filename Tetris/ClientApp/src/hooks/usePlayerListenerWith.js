import { useContext, useEffect } from "react";
import { useParams } from "react-router";
import { update, process } from "../domain/players";
import { MultiplayerContext } from "../MultiplayerContext";
import { initialGameState, SinglePlayerGameContext } from "../SinglePlayerGame";
import { stringFrom } from '../domain/serialization';

export const usePlayerListenerWith = ({ setOtherPlayers, setGameResults }) => {
    const { organizerUserId } = useParams();
    const {
        gameHub, isConnected, userId: currentUserId, timeProvider, gameEndTime, setGameEndTime, setIsOrganizerDisconnected
    } = useContext(MultiplayerContext);
    const {
        game, setGame, username,
    } = useContext(SinglePlayerGameContext);
    const isOrganizer = organizerUserId === currentUserId;
    const timeLeft = gameEndTime && Math.max(0, Math.ceil(gameEndTime - timeProvider()));

    useEffect(() => {
        const isConnectedWithUserId = currentUserId && isConnected;

        isConnectedWithUserId && gameHub.receive.setHandlers({
            hello: ({ userId, ...otherProps }) => {
                setOtherPlayers(otherPlayers => ({ ...otherPlayers, [userId]: { ...otherProps } }));
            },
            playersListUpdate: ({ players: updatedPlayersList }) => {
                setIsOrganizerDisconnected(false);
                setGame({ ...initialGameState, paused: true });
                setGameResults(null);
                setGameEndTime(null);
                setOtherPlayers(otherPlayers => update(otherPlayers).with(updatedPlayersList));
                const isInPlayersList = updatedPlayersList.some(({ userId }) => userId === currentUserId);
                !isInPlayersList && gameHub.invoke.status({
                    groupId: organizerUserId,
                    message: {
                        userId: currentUserId,
                        board: stringFrom(game.board),
                        score: game.score,
                        name: username,
                        timeLeft: isOrganizer ? timeLeft : undefined
                    }
                });
            },
            status: ({ userId, ...userUpdates }) => {
                const { timeLeft, ...otherUpdates } = userUpdates;
                setOtherPlayers(otherPlayers => process(otherUpdates).on(userId).in(otherPlayers));
                !isOrganizer && timeLeft && setGameEndTime(timeProvider() + timeLeft);
            },
            start: () => {
                setGame(game => ({ ...game, paused: false }));
                isOrganizer && setGameEndTime(timeProvider() + 60000);
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
                setIsOrganizerDisconnected(true);
            },
            reset: () => {
                setGame({ ...initialGameState, paused: true });
                setGameResults(null);
                setGameEndTime(null);
                setOtherPlayers(otherPlayers => [{}, ...Object.keys(otherPlayers)].reduce((currentPlayers, userId) => ({
                    ...currentPlayers,
                    [userId]: { name: otherPlayers[userId].name, score: 0 }
                })));
            }
        });

        setGame({ ...initialGameState, paused: true });
    }, [gameHub, isConnected, currentUserId, isOrganizer, username]);
};
