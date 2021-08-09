import React from "react";
import { ErrorMessage } from "./components/error-message";
import { TetrisGame, emptyBoard } from "./components/tetris-game";
import { StringInput as StringPrompt, Dialog, usePrompt } from './components/dialog';
import { leaderBoardService } from "./services";
import "./App.css";
import { ScoreBoard } from "./ScoreBoard";
import { GameControls } from "./GameControls";
import { useLoadingState, useMountedOnlyState } from 'leaf-validator';

export const SinglePlayerGame = ({ shapeProvider }) => {
  const [game, setGame] = useMountedOnlyState({
    board: emptyBoard,
    isOver: false,
    mobile: false,
    oldScore: 0,
    paused: false,
    score: 0
  });
  const [username, setUsername] = useMountedOnlyState();
  const { dialogProps, prompt } = usePrompt();
  const [isLoadingScoreBoard, showLoadingScoreBoardWhile] = useLoadingState();

  const postableScore = game.score || game.oldScore;

  const postScore = async () => {

    const sendCurrentScore = name => leaderBoardService
      .postScore({
        username: name,
        score: postableScore
      })
      .then(reloadScoreBoard);

    await (Boolean(username?.trim().length)
      ? sendCurrentScore(username)
      : prompt(exitModal => <StringPrompt
        onSaveString={name => Boolean(name?.trim().length)
          ? sendCurrentScore(name.trim())
            .then(() => setUsername(name.trim()))
            .then(exitModal)
          : exitModal()}
        runningText="Posting Your Score...">
        What user name would you like?
      </StringPrompt>));
  }

  const reloadScoreBoard = async () => {
    const scoreBoard = await leaderBoardService.get();
    setGame(game => ({ ...game, scoreBoard }));
  };

  const pause = async () => {
    const paused = !game.paused;
    setGame({ ...game, paused, scoreBoard: paused ? game.scoreBoard : undefined });
    paused && await showLoadingScoreBoardWhile(reloadScoreBoard());
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