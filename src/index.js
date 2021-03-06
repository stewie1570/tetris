import React from "react";
import ReactDOM from "react-dom";
import SinglePlayerGame from "./SinglePlayerGame";
import "./index.css";
import "bootstrap-css-only";
import { shapes } from "./components/tetris-game";

const randomNumberGenerator = {
  between: ({ min, max }) => Math.floor(Math.random() * (max + 1)) + min,
};
const shapeProvider = () =>
  shapes[randomNumberGenerator.between({ min: 0, max: shapes.length - 1 })];

ReactDOM.render(
  <SinglePlayerGame
    gameIterator={setInterval.bind(window)}
    shapeProvider={shapeProvider}
  />,
  document.getElementById("root")
);
