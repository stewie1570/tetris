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
    const hasUserName = Boolean(username?.trim().length);
    const sendCurrentScoreFor = name => leaderBoardService
      .postScore({
        username: name,
        score: postableScore
      })
      .then(reloadScoreBoard);
    const promptUserNameAndSendScore = () => prompt(exitModal => <StringPrompt
      onSaveString={name => {
        const trimmedName = name?.trim();
        return Boolean(trimmedName?.length)
          ? sendCurrentScoreFor(trimmedName)
            .then(() => setUsername(trimmedName))
            .then(exitModal)
          : exitModal();
      } }
      submittingText="Posting Your Score...">
      What user name would you like?
    </StringPrompt>);

    await (hasUserName ? sendCurrentScoreFor(username) : promptUserNameAndSendScore());
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
              username={username}
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