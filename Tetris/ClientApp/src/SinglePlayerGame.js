import React, { useContext } from "react";
import { TetrisGame, emptyBoard } from "./components/TetrisGame";
import { StringInput as StringPrompt, usePrompt } from './components/Prompt';
import { leaderBoardService } from "./services";
import "./App.css";
import { ScoreBoard } from "./ScoreBoard";
import { GameControls } from "./GameControls";
import { useLoadingState, useMountedOnlyState } from 'leaf-validator';
import { GameMetaFrame } from "./components/GameMetaFrame";

export const SinglePlayerGameContext = React.createContext();

export const initialGameState = {
  board: emptyBoard,
  isOver: false,
  mobile: false,
  oldScore: 0,
  paused: false,
  score: 0
};

export const SinglePlayerGameContextProvider = ({ children }) => {
  const [game, setGame] = useMountedOnlyState(initialGameState);
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

export const SinglePlayerGame = ({ shapeProvider, children: otherPlayers, header, additionalControls, ...otherProps }) => {
  const {
    game,
    setGame,
    username,
    setUsername,
    prompt
  } = useContext(SinglePlayerGameContext);
  const [isLoadingScoreBoard, showLoadingScoreBoardWhile] = useLoadingState();

  const postableScore = game.score || game.oldScore;
  const allowScorePost = game.paused && Boolean(postableScore);

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
    paused && !otherPlayers && await showLoadingScoreBoardWhile(reloadScoreBoard());
  }

  return (
    <GameMetaFrame
      {...otherProps}
      header={<>
        {header}
        <p>
          {`Score: ${game.score}` +
            (game.oldScore
              ? ` (Previous: ${game.oldScore})`
              : "")}
        </p>
      </>}
      game={<TetrisGame
        game={game}
        onChange={setGame}
        shapeProvider={shapeProvider}
        onPause={!otherPlayers && pause}
      />}
      scoreBoard={game.paused && (otherPlayers || <ScoreBoard
        allowScorePost={allowScorePost}
        game={game}
        username={username}
        isLoading={isLoadingScoreBoard}
        onPostScore={postScore}
        postableScore={postableScore} />)}
      controls={<><GameControls
        game={game}
        onPause={!otherPlayers && pause}
        onToggleMobile={() => setGame(game => ({ ...game, mobile: !game.mobile }))} />
        {additionalControls}
      </>} />
  );
}

export default SinglePlayerGame;