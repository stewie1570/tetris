import React, { useEffect, useRef } from "react";
import { HubConnectionBuilder, HttpTransportType } from '@microsoft/signalr';
import { useUserId } from './hooks/useUserId';
import { useLocation } from 'react-router-dom';
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
  'reset'
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
  const [gameEndTime, setGameEndTime] = React.useState(null);
  const [canGuestStartGame, setCanGuestStartGame] = React.useState(false);
  const [organizerConnectionStatus, setOrganizerConnectionStatus] = React.useState(null);
  const [otherPlayers, setOtherPlayers] = useMountedOnlyState(initialEmptyPlayersList);
  const [gameResults, setGameResults] = React.useState(null);
  const [selectedDuration, setSelectedDuration] = React.useState(selectableDurations[0] * 1000);

  useEffect(() => {
    setGameEndTime(null);
  }, [location]);

  useEffect(() => {
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
      });

    return () => connection.current.stop();
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
    setCanGuestStartGame
  };
});

export const MultiplayerContextPassThrough = ({ children }) => {
  const parentContext = useMultiplayerContext();

  return parentContext
    ? children
    : <MultiplayerContextProvider>
      {children}
    </MultiplayerContextProvider>;
};