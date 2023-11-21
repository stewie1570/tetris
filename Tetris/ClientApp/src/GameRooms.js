import { useLoadingState, useMountedOnlyState } from "leaf-validator";
import React, { useRef } from "react";
import { useLifeCycle } from "./hooks/useLifeCycle";
import { QuietRest } from "./services/rest";
import { Link } from "react-router-dom";
import { Pager } from "./components/Pager";

const Statuses = ["Playing", "Waiting"];
const ItemsPerPage = 5;

export const GameRooms = () => {
  const [gameRooms, setGameRooms] = useMountedOnlyState();
  const [isLoading, showLoadingWhile] = useLoadingState();
  const pageRef = useRef(1);
  const timerRef = useRef();

  const refresh = async () => {
    try {
      const url = `/api/gameRooms?start=${
        (pageRef.current - 1) * ItemsPerPage
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
  });

  return (
    <div className="card mt-3">
      <div className="card-body">
        <h5 className="card-title">Game Rooms</h5>
        <div className="card-text">
          {isLoading ? (
            <strong>Loading...</strong>
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
                              (player) => player.username ?? "[Un-named Player]"
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
        </div>
      </div>
    </div>
  );
};
