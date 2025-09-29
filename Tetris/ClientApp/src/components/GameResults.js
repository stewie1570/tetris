import React from "react";
import { Centered, Header } from "../Styling";
import { GameChat } from "../GameChat";
import { InitiallyDisabledPlayerGameLink } from "./GameLinks";

export const GameResults = ({
  gameResults,
  otherPlayers,
  onGameStart,
  onReset
}) => {
  if (!gameResults) return null;

  return (
    <Centered>
      <Header style={{ width: "90%", display: "inline-block" }}>
        Game Over
      </Header>
      <div
        className="card mb-3"
        style={{ display: "inline-block", width: "90%", textAlign: "left" }}
      >
        <div className="card-header">Results</div>
        <div className="card-body p-0">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(otherPlayers)
                .filter(
                  (userId) =>
                    !otherPlayers[userId].disconnected ||
                    otherPlayers[userId].score
                )
                .map((userId) => (
                  <tr key={userId}>
                    <td>
                      {otherPlayers[userId].name ?? "[Un-named Player]"}
                    </td>
                    <td>{gameResults[userId].score}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
      <GameChat style={{ width: "90%", display: "inline-block" }} />
      <div>
        <InitiallyDisabledPlayerGameLink onGameStart={onGameStart} />
      </div>
      <div>{onReset}</div>
    </Centered>
  );
};
