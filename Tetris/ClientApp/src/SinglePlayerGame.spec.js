import React from "react";
import SinglePlayerGame from "./SinglePlayerGame";
import {
  render,
  screen,
  fireEvent,
  within,
  waitFor,
} from "@testing-library/react";
import { shapes } from "./components/tetris-game";
import { keys } from "./core/constants";
import { rest } from "msw";
import { setupServer } from "msw/node";

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

test("score a point and post score", async () => {
  const { iterate, container } = getIterableBoard();

  scorePointOnEmptyBoard({ iterate, container });

  screen.getByText(/Pause/).click();
  screen.getByText(/Post My Score/).click();

  var userNameTextInput = await within(
    screen.getByRole("dialog")
  ).findByLabelText(/What user name would you like/);
  fireEvent.change(userNameTextInput, {
    target: { value: "Stewie" },
  });

  screen.getByText(/Ok/).click();

  await waitFor(() =>
    expect(scorePosts).toEqual([{ username: "Stewie", score: 1 }])
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

let scorePosts = [];
const server = setupServer(
  rest.get("/api/userScores", async (req, res, ctx) => {
    return res(ctx.json(scorePosts));
  }),
  rest.post("/api/userScores", async (req, res, ctx) => {
    scorePosts.push(req.body);
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
beforeEach(() => {
  scorePosts = [];
});
afterAll(() => server.close());
