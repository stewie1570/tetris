import React from "react";
import { CommandButton } from "./components/CommandButton";
import styled from 'styled-components';

const Controls = styled.div`
  padding-top: 10px;
  width: 100%;
`;

export function GameControls({ onPause: togglePause, game, onToggleMobile: toggleMobile }) {
  return <Controls>
    {togglePause && <CommandButton
      className="btn btn-primary"
      runningText="Loading Score Board..."
      onClick={togglePause}>
      <span>{game.paused ? "Continue" : "Pause"}</span>
    </CommandButton>}
    <p />
    <CommandButton className="btn btn-primary" onClick={toggleMobile}>
      {game.mobile ? "No Mobile Controls" : "Mobile Controls"}
    </CommandButton>
  </Controls>;
}
