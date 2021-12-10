import React, { useContext } from "react";
import { TetrisGame, emptyBoard } from "./components/TetrisGame";
import { StringInput as StringPrompt, usePrompt } from './components/Prompt';
import { leaderBoardService } from "./services";
import "./App.css";
import { ScoreBoard } from "./ScoreBoard";
import { GameControls } from "./GameControls";
import { useLoadingState, useMountedOnlyState } from 'leaf-validator';

export const SinglePlayerGameContext = React.createContext();

export const SinglePlayerGameContextProvider = ({ children }) => {
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

  return <SinglePlayerGameContext.Provider value={{
    game,
    setGame,
    username,
    setUsername,
    dialogProps,
    prompt
  }}>
    {children}
  </SinglePlayerGameContext.Provider>;
};

export const SinglePlayerGame = ({ shapeProvider }) => {
  const {
    game,
    setGame,
    username,
    setUsername,
    prompt
  } = useContext(SinglePlayerGameContext);
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
      filter={value => (value ?? "").trim()}
      onSaveString={name => Boolean(name?.length)
        ? sendCurrentScoreFor(name)
          .then(() => setUsername(name))
          .then(exitModal)
        : exitModal()}
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
              onChange={setGame}
              shapeProvider={shapeProvider}
              onPause={pause}
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
    </div>
  );
}

export default SinglePlayerGame;