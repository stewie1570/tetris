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

const ModernButton = styled(CommandButton)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
  border: none !important;
  border-radius: 12px !important;
  padding: 12px 24px !important;
  font-weight: 600 !important;
  color: white !important;
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3) !important;
  transition: all 0.3s ease !important;
  
  &:hover {
    transform: translateY(-2px) !important;
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4) !important;
  }
  
  &:active {
    transform: translateY(0) !important;
  }
`;

export function GameControls({ onPause: togglePause, game, ...otherProps }) {
  return <Controls {...otherProps}>
    {togglePause && <ModernButton
      className="btn btn-primary m-3"
      runningText={<><Spinner /> Loading Score Board...</>}
      onClick={togglePause}>
      <span>{game.paused
        ? <><FontAwesomeIcon icon={faPlay} />&nbsp;Continue</>
        : <><FontAwesomeIcon icon={faPause} />&nbsp;Pause</>}</span>
    </ModernButton>}
  </Controls>;
}
