import React, { useContext, useEffect, useRef } from "react";
import { HubConnectionBuilder, HttpTransportType } from '@microsoft/signalr';
import { useUserId } from './hooks/useUserId';
import { useLocation, useParams } from 'react-router-dom';
import { initialEmptyPlayersList, selectableDurations } from './constants'
import { createManagedContext, useMountedOnlyState } from "leaf-validator";
import { useLifeCycle } from "./hooks/useLifeCycle";

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

  const instanceRef = useRef({ organizerId });
  instanceRef.current = { organizerId };

  useEffect(() => {
    setGameEndTime(null);
  }, [location]);

  useLifeCycle({
    onMount: () => {
      connection.current = new HubConnectionBuilder()
        .withUrl("/gameHub", { transport: HttpTransportType.WebSockets })
        .withAutomaticReconnect()
        .build();

      gameHub.current.receive.setHandlers = handlers => Object
        .keys(handlers)
        .forEach(key => {
          connection.current.off(key);
          connection.current.on(key, handlers[key]);
        });

      connection.current.onclose(() => setIsConnected(false));
      connection.current.onreconnecting(() => setIsConnected(false));
      connection.current.onreconnected(() => {
        setIsConnected(true);
      });

      connection
        .current
        .start()
        .then(() => {
          signals.forEach(signal => {
            gameHub.current.invoke[signal] = obj => connection.current.invoke(signal, obj);
            gameHub.current.send[signal] = obj => connection.current.send(signal, obj);
          });
          setIsConnected(true);
          isOrganizer && gameHub.current.invoke.setChatLines({
            groupId: instanceRef.current.organizerId,
            message: []
          });
        });
    },
    onUnMount: () => connection.current.stop()
  });

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
    setSoundEnabled
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