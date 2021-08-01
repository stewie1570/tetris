import React from "react";
import { ErrorMessage } from "./components/error-message";
import { TetrisGame, emptyBoard } from "./components/tetris-game";
import { PromptDialog, usePrompt } from "./components/prompt-dialog";
import { leaderBoardService } from "./services";
import { loading } from "./core/constants";
import "./App.css";
import { ScoreBoard } from "./ScoreBoard";
import { GameControls } from "./GameControls";

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

  const postableScore = game.score || game.oldScore;

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
              game={game}
              onChange={(gameStateUpdates) => setGame(oldGameState => ({ ...oldGameState, ...gameStateUpdates }))}
              shapeProvider={shapeProvider}
            />
            <ScoreBoard
              game={game}
              onPostScore={postScore}
              postableScore={postableScore} />
          </div>
          <GameControls
            game={game}
            onPause={pause}
            onToggleMobile={() => setGame(game => ({ ...game, mobile: !game.mobile }))} />
        </div>
      </center>
      <PromptDialog {...promptDialogProps} />
      <ErrorMessage />
    </div>
  );
}

export default SinglePlayerGame;