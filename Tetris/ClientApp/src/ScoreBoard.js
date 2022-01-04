import React from "react";
import { CommandButton } from "./components/CommandButton";

export function ScoreBoard({ game, postableScore, onPostScore: postScore, isLoading, username }) {
  const allowScorePost = game.paused && Boolean(postableScore);

  const scoreBoard = game.paused && (game.scoreBoard || isLoading) &&
    <div
      className="leader-board"
      style={{ height: allowScorePost ? "80%" : "100%" }}
    >
      <table className="table">
        <thead>
          {Boolean(game.scoreBoard?.length) && <tr>
            <th colSpan="2" style={{ textAlign: "center" }}>
              Top {game.scoreBoard?.length} scores
            </th>
          </tr>}
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td>
                <b>Loading...</b>
              </td>
            </tr>
          ) : (
            game.scoreBoard.map(userScore => (
              <tr key={userScore.username}>
                <td>{userScore.username}</td>
                <td>{userScore.score}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>;

  return <>
    {scoreBoard}
    {allowScorePost && (
      <div className="post-my-score">
        Would you like to post your score?
        <CommandButton
          className="btn btn-primary post-my-score-button"
          runningText={Boolean(username) ? "Posting your score..." : undefined}
          onClick={postScore}>
          <span className="glyphicon glyphicon-send">&nbsp;</span>
          Post My Score ({postableScore})
        </CommandButton>
      </div>
    )}
  </>;
}
