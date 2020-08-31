import React from "react";
import SinglePlayerGame from "./SinglePlayerGame";
import { render, screen, fireEvent, within } from "@testing-library/react";
import { shapes } from "./components/tetris-game";
import { keys } from "./core/constants";

const lineShape = shapes[1];

test("score a point", () => {
  const { iterate, container } = getIterableBoard();

  screen.getByText("Score: 0");

  scorePointOnEmptyBoard({ iterate, container });

  screen.getByText("Score: 1");
  expect(getSerializedBoard()).toBe(
    `
      *---------
      *---------
      *---------
      *---------
      ----------
      ----------
      ----------
      ----------
      ----------
      ----------
      ----------
      ----------
      ----------
      --------##
      --------##
      --------##`.replace(/ /gi, "")
  );
});

function scorePointOnEmptyBoard({ iterate, container }) {
  iterate();
  fireEvent.keyDown(container, { keyCode: keys.up });
  fireEvent.keyDown(container, { keyCode: keys.space });
  iterate();
  fireEvent.keyDown(container, { keyCode: keys.up });
  fireEvent.keyDown(container, { keyCode: keys.right });
  fireEvent.keyDown(container, { keyCode: keys.right });
  fireEvent.keyDown(container, { keyCode: keys.right });
  fireEvent.keyDown(container, { keyCode: keys.right });
  fireEvent.keyDown(container, { keyCode: keys.space });
  iterate();
  fireEvent.keyDown(container, { keyCode: keys.right });
  fireEvent.keyDown(container, { keyCode: keys.right });
  fireEvent.keyDown(container, { keyCode: keys.right });
  fireEvent.keyDown(container, { keyCode: keys.right });
  fireEvent.keyDown(container, { keyCode: keys.right });
  fireEvent.keyDown(container, { keyCode: keys.right });
  fireEvent.keyDown(container, { keyCode: keys.right });
  fireEvent.keyDown(container, { keyCode: keys.right });
  fireEvent.keyDown(container, { keyCode: keys.right });
  fireEvent.keyDown(container, { keyCode: keys.space });
  iterate();
  fireEvent.keyDown(container, { keyCode: keys.right });
  fireEvent.keyDown(container, { keyCode: keys.right });
  fireEvent.keyDown(container, { keyCode: keys.right });
  fireEvent.keyDown(container, { keyCode: keys.right });
  fireEvent.keyDown(container, { keyCode: keys.right });
  fireEvent.keyDown(container, { keyCode: keys.right });
  fireEvent.keyDown(container, { keyCode: keys.right });
  fireEvent.keyDown(container, { keyCode: keys.right });
  fireEvent.keyDown(container, { keyCode: keys.space });
  iterate();
}

function getIterableBoard() {
  let iterate = undefined;
  const { container } = render(
    <SinglePlayerGame
      gameIterator={(callback, timeOut) => {
        iterate = callback;
      }}
      shapeProvider={() => lineShape}
    />
  );

  return { iterate, container };
}

function getSerializedBoard() {
  return (
    "\n" +
    screen
      .getAllByTestId("row")
      .map((row) =>
        within(row)
          .getAllByTestId("space")
          .map(({ title }) => title)
          .join("")
      )
      .join("\n")
  );
}
