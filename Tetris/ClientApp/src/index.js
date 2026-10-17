import React from "react";
import { createRoot } from "react-dom/client";
import "bootstrap-css-only";
import { BrowserRouter } from "react-router";
import { App } from "./App";

setInterval(() => {
  window.dispatchEvent(new CustomEvent("iterate-game"));
}, 1000);

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
