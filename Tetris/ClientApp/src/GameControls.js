import React from "react";
import { CommandButton } from "./components/CommandButton";
import { Spinner } from './components/AnimatedIcons';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause } from '@fortawesome/free-solid-svg-icons';

const Controls = styled.div`
  padding-top: 20px;
  width: 100%;
  display: flex;
  justify-content: center;
`;

export function GameControls({ onPause: togglePause, game, ...otherProps }) {
  return <Controls {...otherProps}>
    {togglePause && <CommandButton
      className="btn btn-primary m-3"
      runningText={<><Spinner /> Loading Score Board...</>}
      onClick={togglePause}>
      <span>{game.paused
        ? <><FontAwesomeIcon icon={faPlay} />&nbsp;Continue</>
        : <><FontAwesomeIcon icon={faPause} />&nbsp;Pause</>}</span>
    </CommandButton>}
  </Controls>;
}
