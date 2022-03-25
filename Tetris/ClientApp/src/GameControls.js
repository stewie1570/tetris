import React from "react";
import { CommandButton } from "./components/CommandButton";
import styled from 'styled-components';

const Controls = styled.div`
  padding-top: 10px;
`;

export function GameControls({ onPause: togglePause, game, onToggleMobile: toggleMobile }) {
  return <Controls>
    {togglePause && <CommandButton
      className="btn btn-primary"
      runningText="Loading Score Board..."
      onClick={togglePause}>
      <span
        className={`glyphicon glyphicon-${game.paused ? "play" : "pause"}`}
      >
        &nbsp;
      </span>
      <span>{game.paused ? "Continue" : "Pause"}</span>
    </CommandButton>}
    <div>
      <p />
      <CommandButton className="btn btn-primary" onClick={toggleMobile}>
        {game.mobile ? "No Mobile Controls" : "Mobile Controls"}
      </CommandButton>
    </div>
  </Controls>;
}
