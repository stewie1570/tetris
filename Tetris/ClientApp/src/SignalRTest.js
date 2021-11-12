import React, { useEffect } from "react";
import { HubConnectionBuilder } from '@microsoft/signalr';
import { Link, useParams } from 'react-router-dom';

export const SignalRTest = () => {
  const [hellos, setHellos] = React.useState([]);
  const { organizerUserId } = useParams();

  useEffect(() => {
    const connection = new HubConnectionBuilder()
      .withUrl("/gameHub")
      .withAutomaticReconnect()
      .build();

    connection.on("Hello", (hello) => {
      setHellos(hellos => [...hellos, hello]);
    });

    connection
      .start()
      .then(() => connection.send("Hello", { userId: connection.connectionId }))
      .catch((err) => console.error(err));
  }, []);

  return <>
    Hello {organizerUserId}:
    {
      hellos.map(hello => <div key={hello.userId}>{hello.userId}</div>)
    }
    <Link to="/">Back</Link>
  </>;
};
