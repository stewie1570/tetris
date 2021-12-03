import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import "bootstrap-css-only";
import { BrowserRouter } from 'react-router-dom';
import { App } from "./App";
import { SignalRGameHubContext } from "./SignalRGameHubContext";

const randomUserIdGenerator = () => Math.random().toString(36).substring(7);

setInterval(() => {
  window.dispatchEvent(new CustomEvent("iterate-game"));
}, 1000);

ReactDOM.render(
  <BrowserRouter>
    <SignalRGameHubContext userIdGenerator={randomUserIdGenerator}>
      <App />
    </SignalRGameHubContext>
  </BrowserRouter>,
  document.getElementById("root")
);
