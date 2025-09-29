import React from "react";
import { CenterScreen, Header, Centered, FixedPositionWarningNotification } from "../Styling";
import { Spinner } from "./AnimatedIcons";
import { SinglePlayerGameLink } from "./GameLinks";
import { CommandButton } from "./CommandButton";

export const UserDisconnected = ({ onGameStart }) => (
  <CenterScreen>
    <Header>
      <Spinner /> Connecting to game server...
    </Header>
    <Centered>
      <div>
        <SinglePlayerGameLink onGameStart={onGameStart} />
      </div>
    </Centered>
  </CenterScreen>
);

export const WaitingForOrganizer = ({ onGameStart, onRetry }) => (
  <CenterScreen>
    <Header>Waiting for organizer...</Header>
    <Centered>
      <div>
        <SinglePlayerGameLink onGameStart={onGameStart} />
      </div>
      <div>{onRetry}</div>
    </Centered>
  </CenterScreen>
);

export const OrganizerDisconnected = ({ onGameStart, onRetry }) => (
  <CenterScreen>
    <Header>Organizer has disconnected.</Header>
    <Centered>
      <div>
        <SinglePlayerGameLink onGameStart={onGameStart} />
      </div>
      <div>{onRetry}</div>
    </Centered>
  </CenterScreen>
);

export const ConnectionWarning = ({ isConnected, organizerConnectionStatus, gamePaused }) => {
  if (isConnected === false) {
    return (
      <FixedPositionWarningNotification>
        Reconnecting...
      </FixedPositionWarningNotification>
    );
  }

  if (!gamePaused && organizerConnectionStatus === "disconnected") {
    return (
      <FixedPositionWarningNotification>
        Organizer is disconnected.
      </FixedPositionWarningNotification>
    );
  }

  return null;
};
