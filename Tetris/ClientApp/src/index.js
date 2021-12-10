import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import "bootstrap-css-only";
import { BrowserRouter } from 'react-router-dom';
import { App } from "./App";
import { MultiplayerContextProvider } from "./MultiplayerContext";

setInterval(() => {
  window.dispatchEvent(new CustomEvent("iterate-game"));
}, 1000);

ReactDOM.render(
  <BrowserRouter>
    <MultiplayerContextProvider>
      <App />
    </MultiplayerContextProvider>
  </BrowserRouter>,
  document.getElementById("root")
);
