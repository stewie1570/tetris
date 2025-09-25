import { useLoadingState, useMountedOnlyState } from "leaf-validator";
import React, { useRef } from "react";
import { useLifeCycle } from "./hooks/useLifeCycle";
import { QuietRest } from "./services/rest";
import { Link } from "react-router-dom";
import { Pager } from "./components/Pager";
import styled from "styled-components";
import { MultiplayerLinks } from "./MultiplayerLinks";
import { Spinner } from "./components/AnimatedIcons";

const BoldRed = styled.strong`
  color: #ff6b6b;
  background: rgba(255, 107, 107, 0.2);
  padding: 4px 8px;
  border-radius: 6px;
  font-weight: 600;
  border: 1px solid rgba(255, 107, 107, 0.3);
`;

const BoldGreen = styled.strong`
  color: #2d7d32;
  background: rgba(45, 125, 50, 0.2);
  padding: 4px 8px;
  border-radius: 6px;
  font-weight: 600;
  border: 1px solid rgba(45, 125, 50, 0.3);
`;

const JoinLink = styled(Link)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white !important;
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none !important;
  transition: all 0.3s ease;
  display: inline-block;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    color: white !important;
    text-decoration: none !important;
  }
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
    onUnMount: () => clearTimeout(timerRef.current),
  });

  return (
    <div className="card mt-3 mb-3">
      <div className="card-body" style={{ overflow: 'hidden' }}>
        <h5 className="card-title">Game Rooms</h5>
        <div className="card-text">
          {/* Desktop Table View */}
          <div className="d-none d-md-block">
            <table className="table" style={{ tableLayout: 'fixed' }}>
              <thead>
                <tr>
                  <th style={{ width: '80px' }}></th>
                  <th style={{ width: '140px' }}>Status</th>
                  <th style={{ width: '120px' }}>Players</th>
                  <th style={{ width: '80px' }}>Code</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={4} className="centered">
                      <strong>
                        <Spinner /> Loading...
                      </strong>
                    </td>
                  </tr>
                ) : gameRooms?.items?.length ? (
                  gameRooms?.items?.map((room) => (
                    <tr key={room.organizerId}>
                      <td style={{ verticalAlign: 'middle' }}>
                        <JoinLink to={`/${room.organizerId}`}>Join</JoinLink>
                      </td>
                      <td style={{ whiteSpace: 'nowrap', verticalAlign: 'middle' }}>{Statuses[room.status]}</td>
                      <td style={{ verticalAlign: 'middle' }}>
                        {Object.values(room.players)
                          .map((player) => player.username ?? "[Un-named]")
                          .join(", ")}
                      </td>
                      <td style={{ verticalAlign: 'middle' }}>{room.organizerId}</td>
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
          </div>

          {/* Mobile Card View */}
          <div className="d-block d-md-none">
            {isLoading ? (
              <div className="text-center p-3">
                <strong>
                  <Spinner /> Loading...
                </strong>
              </div>
            ) : gameRooms?.items?.length ? (
              gameRooms?.items?.map((room) => (
                <div key={room.organizerId} style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  padding: '16px',
                  marginBottom: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px'
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '600', color: '#2d3748', marginBottom: '4px' }}>
                      Room {room.organizerId}
                    </div>
                    <div style={{ marginBottom: '2px', fontSize: '0.9rem' }}>
                      <strong style={{ color: '#4a5568' }}>Status:</strong> {Statuses[room.status]}
                    </div>
                    <div style={{ fontSize: '0.9rem' }}>
                      <strong style={{ color: '#4a5568' }}>Players:</strong> {Object.values(room.players)
                        .map((player) => player.username ?? "[Un-named]")
                        .join(", ")}
                    </div>
                  </div>
                  <div style={{ flexShrink: 0 }}>
                    <JoinLink to={`/${room.organizerId}`}>Join</JoinLink>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center p-3">
                <strong>No one is hosting a game right now</strong>
              </div>
            )}
          </div>
          {gameRooms?.items?.length > 0 && (
            <Pager
              page={Math.ceil(gameRooms?.start / ItemsPerPage) + 1}
              numPages={Math.ceil(gameRooms?.total / ItemsPerPage)}
              onPageChange={requestPage}
            />
          )}
          <MultiplayerLinks />
        </div>
      </div>
    </div>
  );
};
