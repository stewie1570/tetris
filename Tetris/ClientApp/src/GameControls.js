import React from "react";
import { CommandButton } from "./components/command-button";

export function GameControls({ onPause: pause, game, onToggleMobile: toggleMobile }) {
  return <div className="controls">
    <CommandButton
      className="btn btn-primary"
      runningText="Loading Score Board..."
      onClick={pause}>
      <span
        className={`glyphicon glyphicon-${game.paused ? "play" : "pause"}`}
      >
        &nbsp;
      </span>
      <span>{game.paused ? "Continue" : "Pause"}</span>
    </CommandButton>
    <div>
      <p />
      <CommandButton
        className="btn btn-primary"
        onClick={toggleMobile}
        disabled={game.paused}
      >
        {game.mobile
          ? "No Mobile Controls"
          : "Mobile Controls"}
      </CommandButton>
    </div>
  </div>;
}
