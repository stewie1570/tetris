import React from "react";
import { TetrisBoard } from "./TetrisBoard";
import { GameMetaFrame } from "./GameMetaFrame";
import { emptyBoard } from "./TetrisGame";

export const OtherPlayersGrid = ({ 
  otherPlayers, 
  currentUserId 
}) => {
  const otherPlayerIds = Object.keys(otherPlayers);
  
  return (
    <>
      {otherPlayerIds
        .filter(
          (userId) =>
            userId !== currentUserId &&
            otherPlayers[userId].board &&
            !otherPlayers[userId].disconnected
        )
        .map((userId) => (
          <div className="col-xs-12 col-md-4" key={userId}>
            <GameMetaFrame
              game={
                <TetrisBoard
                  board={otherPlayers[userId].board ?? emptyBoard}
                />
              }
              header={
                <>
                  <p>
                    {otherPlayers[userId].name ?? "[Un-named player]"}
                  </p>
                  <p>Score: {otherPlayers[userId].score ?? 0}</p>
                </>
              }
            />
          </div>
        ))}
    </>
  );
};
