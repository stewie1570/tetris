import React from "react";
import { ErrorMessage } from "./components/error-message";
import { TetrisGame, emptyBoard } from "./components/tetris-game";
import { StringInput as StringPrompt, Dialog, usePrompt } from './components/dialog';
import { leaderBoardService } from "./services";
import "./App.css";
import { ScoreBoard } from "./ScoreBoard";
import { GameControls } from "./GameControls";
import { useLoadingState } from 'leaf-validator';

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
  const { dialogProps, prompt } = usePrompt();
  const [isLoadingScoreBoard, showLoadingScoreBoardWhile] = useLoadingState();

  const postableScore = game.score || game.oldScore;

  const postScore = async () => {
    const updateUserName = async enteredName => {
      const name = (username || enteredName || "").trim();

      name.length && await leaderBoardService
        .postScore({
          username: name,
          score: postableScore
        })
        .then(reloadScoreBoard)
        .then(() => setUsername(name));
    }

    await prompt(exitModal => <StringPrompt
      onSaveString={name => updateUserName(name).then(exitModal)}
      runningText="Posting Your Score...">
      What user name would you like?
    </StringPrompt>);
  }

  const reloadScoreBoard = async () => {
    const scoreBoard = await showLoadingScoreBoardWhile(leaderBoardService.get());
    setGame(game => ({ ...game, scoreBoard }));
  };

  const pause = async () => {
    const paused = !game.paused;
    setGame({ ...game, paused, scoreBoard: paused ? game.scoreBoard : undefined });
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
              game={game}
              onChange={(gameStateUpdates) => setGame(oldGameState => ({ ...oldGameState, ...gameStateUpdates }))}
              shapeProvider={shapeProvider}
            />
            <ScoreBoard
              game={game}
              isLoading={isLoadingScoreBoard}
              onPostScore={postScore}
              postableScore={postableScore} />
          </div>
          <GameControls
            game={game}
            onPause={pause}
            onToggleMobile={() => setGame(game => ({ ...game, mobile: !game.mobile }))} />
        </div>
      </center>
      <Dialog {...dialogProps} />
      <ErrorMessage />
    </div>
  );
}

export default SinglePlayerGame;