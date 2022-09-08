import React, { useContext } from "react";
import { SinglePlayerGameContext } from "./SinglePlayerGame";
import { Link, useNavigate } from "react-router-dom";
import { StringInput } from "./components/Prompt";

export const MultiplayerLinks = () => {
  const { prompt, game } = useContext(SinglePlayerGameContext);
  const navigate = useNavigate();

  const goToMultiplayerGame = async () => {
    if (!game.paused) {
        game?.behaviors?.pause?.();
    }
    await prompt((exitModal) => (
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
      <Link style={{ marginTop: "1rem", display: "block" }} to={`/host`}>
        Host Multiplayer Game
      </Link>

      <button
        type="button"
        className="btn btn-link"
        onClick={goToMultiplayerGame}
      >
        Join Multiplayer Game
      </button>
    </>
  );
};
