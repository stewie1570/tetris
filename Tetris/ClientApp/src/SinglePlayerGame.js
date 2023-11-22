import React from "react";
import { TetrisGame, emptyBoard } from "./components/TetrisGame";
import { StringInput as StringPrompt, usePrompt } from "./components/Prompt";
import { leaderBoardService } from "./services";
import "./App.css";
import { ScoreBoard } from "./ScoreBoard";
import { GameControls } from "./GameControls";
import {
  createManagedContext,
  useLoadingState,
  useMountedOnlyState,
} from "leaf-validator";
import { GameMetaFrame } from "./components/GameMetaFrame";
import { useSessionStorageState } from './hooks/useSessionStorageState';

export const initialGameState = {
  board: emptyBoard,
  isOver: false,
  mobile: false,
  oldScore: 0,
  paused: false,
  score: 0,
};

export const [SinglePlayerGameContextProvider, useSinglePlayerGameContext] =
  createManagedContext(() => {
    const [game, setGame] = useMountedOnlyState(initialGameState);
    const [username, setUsername] = useSessionStorageState("username");
    const { dialogProps, prompt } = usePrompt();

    const [isLoadingScoreBoard, showLoadingScoreBoardWhile] = useLoadingState();

    const postableScore = game.score || game.oldScore;
    const allowScorePost = game.paused && Boolean(postableScore);

    const postScore = async () => {
      const hasUserName = Boolean(username?.trim().length);

      const sendCurrentScoreFor = (name) =>
        leaderBoardService
          .postScore({
            username: name,
            score: postableScore,
          })
          .then(reloadScoreBoard)
          .then((scoreBoard) => {
            const scoreIsOnBoard = scoreBoard.find(
              ({ username }) => username === name
            );
            !scoreIsOnBoard &&
              window.dispatchEvent(
                new CustomEvent("user-error", {
                  detail: `Your score was recorded but didn't make the top ${scoreBoard.length}.`,
                })
              );
          });

      const promptUserNameAndSendScore = () =>
        prompt((exitModal) => (
          <StringPrompt
            filter={(value) => (value ?? "").trim()}
            onSubmitString={(name) =>
              Boolean(name?.length)
                ? sendCurrentScoreFor(name)
                  .then(() => setUsername(name))
                  .then(exitModal, exitModal)
                : exitModal()
            }
            submittingText="Posting Your Score..."
          >
            What user name would you like?
          </StringPrompt>
        ));

      await (hasUserName
        ? sendCurrentScoreFor(username)
        : promptUserNameAndSendScore());
    };

    const reloadScoreBoard = async () => {
      const scoreBoard = await leaderBoardService.get();
      setGame((game) => ({ ...game, scoreBoard }));
      return scoreBoard;
    };

    const pause = async ({ showScoreBoard }) => {
      const paused = !game.paused;
      setGame({
        ...game,
        paused,
        scoreBoard: paused ? game.scoreBoard : undefined,
      });
      paused &&
        showScoreBoard &&
        (await showLoadingScoreBoardWhile(reloadScoreBoard()));
    };

    return {
      game,
      setGame,
      username,
      setUsername,
      dialogProps,
      prompt,
      isLoadingScoreBoard,
      showLoadingScoreBoardWhile,
      postableScore,
      allowScorePost,
      postScore,
      reloadScoreBoard,
      pause,
    };
  });

export const SinglePlayerGame = ({
  shapeProvider,
  children: otherPlayers,
  header,
  additionalControls,
  ...otherProps
}) => {
  const {
    game,
    setGame,
    username,
    pause,
    allowScorePost,
    isLoadingScoreBoard,
    postableScore,
    postScore,
  } = useSinglePlayerGameContext();

  return (
    <GameMetaFrame
      {...otherProps}
      header={
        <>
          {header}
          <p>
            {!game.paused &&
              `Score: ${game.score}` +
              (game.oldScore ? ` (Previous: ${game.oldScore})` : "")}
          </p>
        </>
      }
      game={
        <TetrisGame
          game={game}
          onChange={setGame}
          shapeProvider={shapeProvider}
          onPause={
            !otherPlayers && (() => pause({ showScoreBoard: !otherPlayers }))
          }
        />
      }
      scoreBoard={
        game.paused &&
        (otherPlayers || (
          <ScoreBoard
            allowScorePost={allowScorePost}
            game={game}
            username={username}
            isLoading={isLoadingScoreBoard}
            onPostScore={postScore}
            postableScore={postableScore}
          />
        ))
      }
      controls={
        <>
          <GameControls
            game={game}
            onPause={
              !otherPlayers && (() => pause({ showScoreBoard: !otherPlayers }))
            }
            onToggleMobile={() =>
              setGame((game) => ({ ...game, mobile: !game.mobile }))
            }
          />
          {additionalControls}
        </>
      }
    />
  );
};

export default SinglePlayerGame;
