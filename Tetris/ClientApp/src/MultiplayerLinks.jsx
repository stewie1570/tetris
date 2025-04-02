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
      <div className="d-flex flex-column-reverse flex-lg-row-reverse align-items-center">
        <Link
          style={{ width: "100%" }}
          className="btn btn-success space-top ml-sm-2"
          to={`/host`}>
          Host Multiplayer Game
        </Link>

        <button
          type="button"
          style={{ width: "100%" }}
          className="btn btn-success space-top ml-sm-2"
          onClick={goToMultiplayerGame}
        >
          Join Multiplayer Game
        </button>
      </div>
    </>
  );
};