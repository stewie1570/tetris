import React from "react";
import { ErrorMessage } from "./components/error-message";
import { CommandButton } from "./components/command-button";
import { TetrisGame, emptyBoard } from "./components/tetris-game";
import { PromptDialog, usePrompt } from "./components/prompt-dialog";
import { leaderBoardService } from "./services";
import { loading } from "./core/constants";
import "./App.css";

export const SinglePlayerGame = ({ shapeProvider }) => {
  const [game, setGame] = React.useState({
    board: emptyBoard,
    isOver: false,
    mobile: false,
    oldScore: 0,
    paused: false,
    score: 0
  });
  const [username, setUsername] = React.useState();
  const { prompt, promptDialogProps } = usePrompt();

  var postableScore = game.score || game.oldScore;
  var allowScorePost = game.paused && Boolean(postableScore);

  const postScore = async () => {
    const name = username || await prompt("What user name would you like?");

    name && await leaderBoardService.postScore({
      username: name,
      score: postableScore
    });

    await reloadScoreBoard()

    setUsername(name);
  }

  const reloadScoreBoard = async () => {
    const scoreBoard = await leaderBoardService.get();
    setGame(game => ({ ...game, scoreBoard }));
  };

  const pause = async () => {
    const paused = !game.paused;
    setGame({ ...game, paused, scoreBoard: paused ? loading : undefined });
    paused && await reloadScoreBoard();
  }

  return (
    <div>
      <center>
        <div className="well app">
          <p>
            {`Score: ${game.score}` +
              (game.oldScore
                ? ` (Previous: ${game.oldScore})`
                : "")}
          </p>
          <div className="game">
            <TetrisGame
              {...game}
              paused={game.paused}
              onChange={(gameStateUpdates) => setGame(oldGameState => ({ ...oldGameState, ...gameStateUpdates }))}
              shapeProvider={shapeProvider}
            />
            {game.scoreBoard && (
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
              </div>
            )}
            {allowScorePost && (
              <div className="post-my-score">
                Would you like to post your score?
                <CommandButton
                  className="btn btn-primary post-my-score-button"
                  runningText="Posting Your Score..."
                  onClick={postScore}>
                  <span className="glyphicon glyphicon-send">&nbsp;</span>
                  Post My Score ({postableScore})
                </CommandButton>
              </div>
            )}
          </div>
          <div className="controls">
            <CommandButton
              className="btn btn-primary"
              runningText="Loading Score Board..."
              onClick={pause}>
              <span
                className={`glyphicon glyphicon-${game.paused ? "play" : "pause"
                  }`}
              >
                &nbsp;
              </span>
              <span>{game.paused ? "Continue" : "Pause"}</span>
            </CommandButton>
            <div>
              <p />
              <CommandButton
                className="btn btn-primary"
                onClick={() => setGame(game => ({ ...game, mobile: !game.mobile }))}
                disabled={game.paused}
              >
                {game.mobile
                  ? "No Mobile Controls"
                  : "Mobile Controls"}
              </CommandButton>
            </div>
          </div>
        </div>
      </center>
      <PromptDialog {...promptDialogProps} />
      <ErrorMessage />
    </div>
  );
}

export default SinglePlayerGame;
