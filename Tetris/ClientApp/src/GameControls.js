import React from "react";
import { CommandButton } from "./components/CommandButton";
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause } from '@fortawesome/free-solid-svg-icons';

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
      <span>{game.paused
        ? <><FontAwesomeIcon icon={faPlay} />&nbsp;Continue</>
        : <><FontAwesomeIcon icon={faPause} />&nbsp;Pause</>}</span>
    </CommandButton>}
    <p />
    <CommandButton className="btn btn-primary" onClick={toggleMobile}>
      {game.mobile ? "No Mobile Controls" : "Mobile Controls"}
    </CommandButton>
  </Controls>;
}
