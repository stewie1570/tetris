import React from "react";
import ReactDOM from "react-dom";
import SinglePlayerGame from "./SinglePlayerGame";
import "./index.css";
import "bootstrap-css-only";
import { shapes } from "./components/TetrisGame";

const randomNumberGenerator = {
  between: ({ min, max }) => Math.floor(Math.random() * (max + 1)) + min,
};
const shapeProvider = () =>
  shapes[randomNumberGenerator.between({ min: 0, max: shapes.length - 1 })];

setInterval(() => {
  window.dispatchEvent(new CustomEvent("iterate-game"));
}, 1000);

ReactDOM.render(
  <SinglePlayerGame shapeProvider={shapeProvider} />,
  document.getElementById("root")
);
