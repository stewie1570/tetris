import React from "react";
import { LeaderBoard } from "../ScoreBoard";
import { CommandButton } from "./CommandButton";

export const PlayerList = ({ 
  otherPlayers, 
  currentUserId, 
  onSetUserName 
}) => {
  return (
    <LeaderBoard style={{ height: "100%" }}>
      Players:
      {Object.keys(otherPlayers)
        .filter((userId) => !otherPlayers[userId].disconnected)
        .map((userId) => (
          <div
            className={userId === currentUserId ? "bold" : ""}
            key={userId}
          >
            {otherPlayers[userId].name ?? "[Un-named player]"}
          </div>
        ))}
      <div>
        <CommandButton
          onClick={onSetUserName}
          className="btn btn-primary"
        >
          Set User Name
        </CommandButton>
      </div>
    </LeaderBoard>
  );
};
