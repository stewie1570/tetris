import React, { useEffect } from "react";
import SinglePlayerGame from "./SinglePlayerGame";
import { MultiplayerGame } from "./MultiplayerGame";
import { Routes, Route, Link } from 'react-router-dom';
import { GameHubContext } from "./SignalRGameHubContext";
import { shapes } from './components/TetrisGame';
import { useSessionStorageState } from "./hooks/useSessionStorageState";


const randomNumberGenerator = {
    between: ({ min, max }) => Math.floor(Math.random() * (max + 1)) + min,
};

const shapeProvider = () =>
    shapes[randomNumberGenerator.between({ min: 0, max: shapes.length - 1 })];

const randomUserIdGenerator = () => Math.random().toString(36).substring(7);

export const App = props => {
    const [userId, setUserId] = useSessionStorageState('userId')

    useEffect(() => {
        const userIdGenerator = props.userIdGenerator || randomUserIdGenerator;
        !userId && setUserId(userIdGenerator());
    }, []);

    return <Routes>
        <Route path="/" element={<>
            <SinglePlayerGame shapeProvider={shapeProvider} />
            <Link to={`/${userId}`}>Host Multiplayer Game</Link>
        </>} />
        <Route path="/:organizerUserId" element={<GameHubContext.Consumer>
            {({ gameHub, isConnected }) => <MultiplayerGame
                userId={userId}
                gameHub={gameHub}
                isConnected={isConnected} />}
        </GameHubContext.Consumer>} />
    </Routes>;
};
