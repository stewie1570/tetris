import React from "react";
import { useLocalPlayerGameContext } from "./LocalPlayerGame";
import { Link, useNavigate } from "react-router-dom";
import { StringInput } from "./components/Prompt";

export const MultiplayerLinks = () => {
  const { prompt, pause, game } = useLocalPlayerGameContext();
  const navigate = useNavigate();

  const goToMultiplayerGame = () => {
    !game.paused && pause({ showScoreBoard: true });
    prompt((exitModal) => (
      <StringInput
        filter={(value) => (value ?? "").trim()}
        inputFilter={(value) => value.toUpperCase().substring(0, 5)}
        onSubmitString={(organizerId) => {
          organizerId && navigate(`/${organizerId}`);
          exitModal();
        }}
      >
        Code:
      </StringInput>
    ));
  };

  return (
    <>
      <Link className="mt-3" to={`/host`}>
        Host Multiplayer Game
      </Link>

      <button
        type="button"
        className="m-3 btn btn-link"
        onClick={goToMultiplayerGame}
      >
        Join Multiplayer Game
      </button>
    </>
  );
};