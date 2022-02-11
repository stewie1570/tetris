import React, { useEffect, useRef } from "react";
import { HubConnectionBuilder } from '@microsoft/signalr';
import { useUserId } from './hooks/useUserId';

export const MultiplayerContext = React.createContext(null);

const signals = [
  'hello',
  'playersListUpdate',
  'status',
  'start',
  'gameOver',
  'results'
];

export const MultiplayerContextProvider = ({ userIdGenerator, children }) => {
  const [isConnected, setIsConnected] = React.useState(false);
  const connection = useRef(null);
  const gameHub = useRef({
    send: {},
    invoke: {},
    receive: {}
  });
  const userId = useUserId(userIdGenerator);

  useEffect(() => {
    connection.current = new HubConnectionBuilder()
      .withUrl("/gameHub")
      .withAutomaticReconnect()
      .build();

    gameHub.current.receive.setHandlers = handlers => Object
      .keys(handlers)
      .forEach(key => {
        connection.current.off(key);
        connection.current.on(key, handlers[key]);
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

  return <MultiplayerContext.Provider value={{
    gameHub: gameHub.current,
    isConnected,
    userId,
    timeProvider: () => new Date().getTime()
  }}>
    {children}
  </MultiplayerContext.Provider>;
};
