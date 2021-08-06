import React from "react";
import { CommandButton } from "./components/command-button";
import { loading } from "./core/constants";

export function ScoreBoard({ game, postableScore, onPostScore: postScore }) {
  const allowScorePost = game.paused && Boolean(postableScore);

  const board = game.scoreBoard &&
    <div
      className="leader-board"
      style={{ height: allowScorePost ? "80%" : "100%" }}
    >
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {game.scoreBoard === loading ? (
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
    {board}
    {allowScorePost && (
      <div className="post-my-score">
        Would you like to post your score?
        <CommandButton
          className="btn btn-primary post-my-score-button"
          onClick={postScore}>
          <span className="glyphicon glyphicon-send">&nbsp;</span>
          Post My Score ({postableScore})
        </CommandButton>
      </div>
    )}
  </>;
}
