import React, { useContext } from "react";
import { SinglePlayerGameContext } from "./SinglePlayerGame";
import { Link, useNavigate } from 'react-router-dom';
import { useUserId } from "./hooks/useUserId";
import { StringInput } from "./components/Prompt";

export const MultiplayerLinks = () => {
    const userId = useUserId();
    const { prompt } = useContext(SinglePlayerGameContext);
    const navigate = useNavigate();

    const goToMultiplayerGame = () => prompt(exitModal => <StringInput
        filter={value => (value ?? "").trim()}
        onSaveString={organizerId => {
            organizerId && navigate(`/${organizerId}`);
            exitModal();
        }}
        submittingText="Posting Your Score...">
        Code:
    </StringInput>);

    return <>
        <Link
            style={{ marginTop: "1rem", display: "block" }}
            to={`/${userId}`}>Host Multiplayer Game</Link>

        <button type="button" className="btn btn-link" onClick={goToMultiplayerGame}>
            Join Multiplayer Game
        </button>
    </>;
};
