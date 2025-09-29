import { useCallback } from "react";
import { stringFrom } from "../domain/serialization";

export const useGameActions = ({
  gameHub,
  organizerUserId,
  currentUserId,
  game,
  username,
  timeLeft,
  isOrganizer,
  setGame
}) => {
  const handleGameStart = useCallback(() => {
    setGame((game) => ({ ...game, paused: false }));
  }, [setGame]);

  const handleReset = useCallback(() => {
    return gameHub.invoke.reset({ groupId: organizerUserId });
  }, [gameHub, organizerUserId]);

  const handleRetryContact = useCallback(() => {
    return gameHub.invoke.status({
      groupId: organizerUserId,
      message: {
        userId: currentUserId,
        board: stringFrom(game.board),
        score: game.score,
        name: username,
        timeLeft: isOrganizer ? timeLeft : undefined,
      },
    });
  }, [gameHub, organizerUserId, currentUserId, game, username, timeLeft, isOrganizer]);

  return {
    startGame: handleGameStart,
    resetGame: handleReset,
    retryContact: handleRetryContact
  };
};
