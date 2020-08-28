import React from "react";
import SinglePlayerGame from "./SinglePlayerGame";
import { render, screen } from "@testing-library/react";

test("renders", () => {
  render(
    <SinglePlayerGame
      gameIterator={(callback, timeOut) => undefined}
      shapeProvider={() => undefined}
    />
  );
});
