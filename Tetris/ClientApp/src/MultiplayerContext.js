import React, { useEffect, useRef } from "react";
import { HubConnectionBuilder, HttpTransportType } from '@microsoft/signalr';
import { useUserId } from './hooks/useUserId';
import { useLocation } from 'react-router-dom';

export const MultiplayerContext = React.createContext(null);

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

export const MultiplayerContextProvider = ({ userIdGenerator, children }) => {
  const [isConnected, setIsConnected] = React.useState(false);
  const location = useLocation();
  const connection = useRef(null);
  const gameHub = useRef({
    send: {},
    invoke: {},
    receive: {}
  });
  const userId = useUserId(userIdGenerator);
  const [gameEndTime, setGameEndTime] = React.useState(null);
  const [organizerConnectionStatus, setOrganizerConnectionStatus] = React.useState(null);

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
    connection.current.onreconnected(() => setIsConnected(true));

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

  return <MultiplayerContext.Provider value={{
    gameHub: gameHub.current,
    isConnected,
    userId,
    timeProvider: () => new Date().getTime(),
    gameEndTime,
    setGameEndTime,
    organizerConnectionStatus,
    setOrganizerConnectionStatus
  }}>
    {children}
  </MultiplayerContext.Provider>;
};

export const MultiplayerContextPassThrough = ({ children, ...otherProps }) => {
  const parentContext = React.useContext(MultiplayerContext);

  return parentContext
    ? children
    : <MultiplayerContextProvider {...otherProps}>
      {children}
    </MultiplayerContextProvider>;
};