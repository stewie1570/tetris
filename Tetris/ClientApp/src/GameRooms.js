import { useLoadingState, useMountedOnlyState } from "leaf-validator";
import React, { useRef } from "react";
import { useLifeCycle } from "./hooks/useLifeCycle";
import { QuietRest } from "./services/rest";
import { Link } from "react-router-dom";
import { Pager } from "./components/Pager";
import styled from "styled-components";
import { MultiplayerLinks } from "./MultiplayerLinks";
import { Spinner } from "./components/Spinner";

const BoldRed = styled.strong`
  color: red;
`;

const BoldGreen = styled.strong`
  color: green;
`;

const Statuses = [
  <BoldRed>Playing</BoldRed>,
  <BoldGreen>Waiting for players</BoldGreen>,
];
const ItemsPerPage = 5;

export const GameRooms = () => {
  const [gameRooms, setGameRooms] = useMountedOnlyState();
  const [isLoading, showLoadingWhile] = useLoadingState();
  const pageRef = useRef(1);
  const timerRef = useRef();

  const refresh = async () => {
    try {
      const url = `/api/gameRooms?start=${(pageRef.current - 1) * ItemsPerPage
        }&count=${ItemsPerPage}`;
      await QuietRest.get(url).then(setGameRooms);
    } catch (err) {
      console.warn(err);
    } finally {
      timerRef.current = setTimeout(refresh, 10000);
    }
  };

  const requestPage = (page) => {
    clearTimeout(timerRef.current);
    pageRef.current = page;
    return refresh();
  };

  useLifeCycle({
    onMount: () => showLoadingWhile(refresh()),
    onUnMount: () => clearTimeout(timerRef.current)
  });

  return (
    <div className="card mt-3 mb-3">
      <div className="card-body">
        <h5 className="card-title">Game Rooms</h5>
        <div className="card-text">
          {isLoading ? (
            <strong><Spinner /> Loading...</strong>
          ) : (
            <>
              <table className="table">
                <thead>
                  <tr>
                    <th></th>
                    <th>Status</th>
                    <th>Players</th>
                    <th>Code</th>
                  </tr>
                </thead>
                <tbody>
                  {gameRooms?.items?.length ? (
                    gameRooms?.items?.map((room) => (
                      <tr key={room.organizerId}>
                        <td>
                          <Link to={`/${room.organizerId}`}>Join</Link>
                        </td>
                        <td>{Statuses[room.status]}</td>
                        <td>
                          {Object.values(room.players)
                            .map(
                              (player) => player.username ?? "[Un-named]"
                            )
                            .join(", ")}
                        </td>
                        <td>{room.organizerId}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4}>
                        <strong>No one is hosting a game right now</strong>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              {gameRooms?.items?.length > 0 && (
                <Pager
                  page={Math.ceil(gameRooms?.start / ItemsPerPage) + 1}
                  numPages={Math.ceil(gameRooms?.total / ItemsPerPage)}
                  onPageChange={requestPage}
                />
              )}
            </>
          )}
          <MultiplayerLinks />
        </div>
      </div>
    </div>
  );
};
