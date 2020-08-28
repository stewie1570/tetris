import React from "react";
import SinglePlayerGame from "./SinglePlayerGame";
import { render, screen, fireEvent, within } from "@testing-library/react";
import { shapes } from "./components/tetris-game";
import { keys } from "./core/constants";
import { stringFrom, tetrisBoardFrom } from "./domain/serialization";

const lineShape = shapes[1];

test("game play", async () => {
  let iterate = undefined;
  const { container } = render(
    <SinglePlayerGame
      gameIterator={(callback, timeOut) => {
        iterate = callback;
      }}
      shapeProvider={() => lineShape}
    />
  );

  iterate();
  iterate();
  iterate();
  fireEvent.keyDown(container, {
    key: "ArrowUp",
    keyCode: keys.up,
  });

  expect(await getSerializedBoard()).toBe(
    stringFrom(
      tetrisBoardFrom(`
      ----------
      ----------
      ****------
      ----------
      ----------
      ----------
      ----------
      ----------
      ----------
      ----------
      ----------
      ----------
      ----------
      ----------
      ----------
      ----------`)
    )
  );
});

async function getSerializedBoard() {
  return (
    "\n" +
    (await screen.findAllByTestId("row"))
      .map((row) =>
        within(row)
          .getAllByTestId("space")
          .map(({ title }) => title)
          .join("")
      )
      .join("\n")
  );
}
