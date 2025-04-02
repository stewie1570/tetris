import React from "react";
import { CommandButton } from "./components/CommandButton";
import { useOrganizerId } from "./hooks/useOrganizerId";
import { useMultiplayerContext } from "./MultiplayerContext";
import { Spinner } from "./components/AnimatedIcons";

export const BigStartButton = () => {
  const organizerUserId = useOrganizerId();
  const {
    gameHub,
    userId: currentUserId,
    canGuestStartGame,
  } = useMultiplayerContext();
  const isOrganizer = organizerUserId === currentUserId;
  const isStartable = isOrganizer || canGuestStartGame;

  const startGame = () => gameHub.invoke.start({ groupId: organizerUserId });

  return (
    <CommandButton
      style={{ width: "100%" }}
      disabled={!isStartable}
      onClick={startGame}
      runningText={<><Spinner /> Starting...</>}
      className="btn btn-success btn-lg mb-3"
    >
      Start Game
    </CommandButton>
  );
};
