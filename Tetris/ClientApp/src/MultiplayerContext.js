import React, { useContext, useEffect, useRef } from "react";
import { HubConnectionBuilder, HttpTransportType } from '@microsoft/signalr';
import { useUserId } from './hooks/useUserId';
import { useLocation, useParams } from 'react-router-dom';
import { initialEmptyPlayersList, selectableDurations } from './constants'
import { createManagedContext, useMountedOnlyState } from "leaf-validator";

const signals = [
  'hello',
  'playersListUpdate',
  'status',
  'start',
  'gameOver',
  'results',
  'disconnect',
  'noOranizer',
  'reset',
  'sendChat',
  'setChatLines'
];

export const [MultiplayerContextProvider, useMultiplayerContext, MultiplayerContext] = createManagedContext(() => {
  const [isConnected, setIsConnected] = React.useState();
  const location = useLocation();
  const connection = useRef(null);
  const gameHub = useRef({
    send: {},
    invoke: {},
    receive: {}
  });
  const userId = useUserId();
  const { organizerUserId: organizerIdParam } = useParams();
  const organizerId = organizerIdParam.toLowerCase() === "host" ? userId : organizerIdParam;
  const isOrganizer = organizerId === userId;
  const [gameEndTime, setGameEndTime] = React.useState(null);
  const [canGuestStartGame, setCanGuestStartGame] = React.useState(false);
  const [organizerConnectionStatus, setOrganizerConnectionStatus] = React.useState(null);
  const [otherPlayers, setOtherPlayers] = useMountedOnlyState(initialEmptyPlayersList);
  const [gameResults, setGameResults] = React.useState(null);
  const [selectedDuration, setSelectedDuration] = React.useState(selectableDurations[0] * 1000);
  const [chatLines, setChatLines] = React.useState([]);
  const [soundEnabled, setSoundEnabled] = React.useState(true);
  const [fullscreenEnabled, setFullscreenEnabled] = React.useState(false);

  const instanceRef = useRef({ organizerId });
  instanceRef.current = { organizerId };

  useEffect(() => {
    setGameEndTime(null);
  }, [location]);

  useEffect(() => {
    let isActive = true;

    const conn = new HubConnectionBuilder()
      .withUrl("/gameHub", { transport: HttpTransportType.WebSockets })
      .withAutomaticReconnect()
      .build();

    connection.current = conn;

    gameHub.current.receive.setHandlers = handlers => Object
      .keys(handlers)
      .forEach(key => {
        conn.off(key);
        conn.on(key, handlers[key]);
      });

    conn.onclose(() => isActive && setIsConnected(false));
    conn.onreconnecting(() => isActive && setIsConnected(false));
    conn.onreconnected(() => isActive && setIsConnected(true));

    conn
      .start()
      .then(() => {
        if (!isActive) {
          return;
        }

        signals.forEach(signal => {
          gameHub.current.invoke[signal] = obj => conn.invoke(signal, obj);
          gameHub.current.send[signal] = obj => conn.send(signal, obj);
        });
        setIsConnected(true);
        isOrganizer && gameHub.current.invoke.setChatLines({
          groupId: instanceRef.current.organizerId,
          message: []
        });
      })
      .catch(() => {
        if (!isActive) {
          return;
        }

        setIsConnected(false);
      });

    return () => {
      isActive = false;
      conn.stop().catch(() => {});
    };
  }, []);

  return {
    gameHub: gameHub.current,
    isConnected,
    userId,
    timeProvider: () => new Date().getTime(),
    gameEndTime,
    setGameEndTime,
    organizerConnectionStatus,
    setOrganizerConnectionStatus,
    otherPlayers,
    setOtherPlayers,
    gameResults,
    setGameResults,
    selectedDuration,
    setSelectedDuration,
    canGuestStartGame,
    setCanGuestStartGame,
    chatLines,
    setChatLines,
    soundEnabled,
    setSoundEnabled,
    fullscreenEnabled,
    setFullscreenEnabled
  };
});

export const MultiplayerContextPassThrough = ({ children }) => {
  const parentContext = useContext(MultiplayerContext);

  return parentContext
    ? children
    : <MultiplayerContextProvider>
      {children}
    </MultiplayerContextProvider>;
};