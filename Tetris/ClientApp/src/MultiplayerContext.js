import React, { useEffect, useRef } from "react";
import { HubConnectionBuilder } from '@microsoft/signalr';
import { useUserId } from './hooks/useUserId';

export const MultiplayerContext = React.createContext(null);

export const MultiplayerContextProvider = ({ userIdGenerator, children }) => {
  const [isConnected, setIsConnected] = React.useState(false);
  const connection = useRef(null);
  const gameHub = useRef({
    send: {},
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
        gameHub.current.send.hello = obj => connection.current.send("hello", obj);
        gameHub.current.send.playersListUpdate = obj => connection.current.send("playersListUpdate", obj);
        gameHub.current.send.start = () => connection.current.send("start");
        gameHub.current.send.status = obj => connection.current.send("status", obj);
        gameHub.current.send.gameOver = () => connection.current.send("gameOver");
        gameHub.current.send.result = obj => connection.current.send("result", obj);
        gameHub.current.send.noOrganizer = () => connection.current.send("noOrganizer");
        setIsConnected(true);
      });

    return () => connection.current.stop();
  }, []);

  return <MultiplayerContext.Provider value={{ gameHub: gameHub.current, isConnected, userId }}>
    {children}
  </MultiplayerContext.Provider>;
};
