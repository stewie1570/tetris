import React from "react";
import ReactDOM from "react-dom";
import SinglePlayerGame from "./SinglePlayerGame";
import { MultiplayerGame } from "./MultiplayerGame";
import "./index.css";
import "bootstrap-css-only";
import { shapes } from "./components/TetrisGame";
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

import { GameHubContext, SignalRGameHubContext } from "./SignalRGameHubContext";

const randomNumberGenerator = {
  between: ({ min, max }) => Math.floor(Math.random() * (max + 1)) + min,
};
const shapeProvider = () =>
  shapes[randomNumberGenerator.between({ min: 0, max: shapes.length - 1 })];

setInterval(() => {
  window.dispatchEvent(new CustomEvent("iterate-game"));
}, 1000);

const userId = Math.random().toString(36).substring(7);

ReactDOM.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<>
        <SinglePlayerGame shapeProvider={shapeProvider} />
        <Link to={`/${userId}`}>Host Multiplayer Game</Link>
      </>} />
      <Route path="/:organizerUserId" element={<SignalRGameHubContext>
        <GameHubContext.Consumer>
          {({ gameHub, isConnected }) => <MultiplayerGame gameHub={gameHub} isConnected={isConnected} />}
        </GameHubContext.Consumer>
      </SignalRGameHubContext>} />
    </Routes>
  </BrowserRouter>,
  document.getElementById("root")
);
