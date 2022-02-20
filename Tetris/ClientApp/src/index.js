import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import "bootstrap-css-only";
import { BrowserRouter } from 'react-router-dom';
import { App } from "./App";

setInterval(() => {
  window.dispatchEvent(new CustomEvent("iterate-game"));
}, 1000);

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById("root")
);
