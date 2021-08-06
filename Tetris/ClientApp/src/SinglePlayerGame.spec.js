import React from "react";
import SinglePlayerGame from "./SinglePlayerGame";
import {
  render,
  screen,
  fireEvent,
  within,
  waitFor,
  act,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import { shapes } from "./components/tetris-game";
import { keys } from "./core/constants";
import { rest } from "msw";
import { server } from "./setupTests";

const lineShape = shapes[1];

test("score a point", async () => {
  const { iterate, container } = getIterableBoard();

  screen.getByText("Score: 0");

  await act(async () => {
    await scorePointOnEmptyBoard({ iterate, container });
  });

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
  server.use(
    rest.get("/api/userScores", async (req, res, ctx) => {
      return res(ctx.json(scorePosts));
    }),
    rest.post("/api/userScores", async (req, res, ctx) => {
      scorePosts.push(req.body);
      return res(ctx.status(200));
    })
  );
  const { iterate, container } = getIterableBoard();

  await act(async () => {
    await scorePointOnEmptyBoard({ iterate, container });
  });

  screen.getByText(/Pause/).click();
  (await screen.findByText(/Post My Score/)).click();

  const userNameTextInput = await within(
    await screen.findByRole("dialog")
  ).findByLabelText(/What user name would you like/);
  fireEvent.change(userNameTextInput, {
    target: { value: "Stewie" },
  });

  screen.getByText(/Ok/).click();

  await waitForElementToBeRemoved(() => screen.getByText(/What user name would you like/));

  expect(scorePosts).toEqual([{ username: "Stewie", score: 1 }]);
});

test("score a point and cancels posting a score", async () => {
  server.use(
    rest.get("/api/userScores", async (req, res, ctx) => {
      return res(ctx.json(scorePosts));
    }),
    rest.post("/api/userScores", async (req, res, ctx) => {
      scorePosts.push(req.body);
      return res(ctx.status(200));
    })
  );
  const { iterate, container } = getIterableBoard();

  await act(async () => {
    await scorePointOnEmptyBoard({ iterate, container });
  });

  screen.getByText(/Pause/).click();
  (await screen.findByText(/Post My Score/)).click();

  const userNameTextInput = await within(
    await screen.findByRole("dialog")
  ).findByLabelText(/What user name would you like/);
  fireEvent.change(userNameTextInput, {
    target: { value: "Stewie" },
  });

  screen.getByText(/Cancel/).click();

  await waitForElementToBeRemoved(() => screen.getByText(/What user name would you like/));

  await waitFor(() =>
    expect(scorePosts).toEqual([])
  );
});

test("score a point and entering a blank username cancels posting the score", async () => {
  server.use(
    rest.get("/api/userScores", async (req, res, ctx) => {
      return res(ctx.json(scorePosts));
    }),
    rest.post("/api/userScores", async (req, res, ctx) => {
      scorePosts.push(req.body);
      return res(ctx.status(200));
    })
  );
  const { iterate, container } = getIterableBoard();

  await act(async () => {
    await scorePointOnEmptyBoard({ iterate, container });
  });

  screen.getByText(/Pause/).click();
  (await screen.findByText(/Post My Score/)).click();

  const userNameTextInput = await within(
    await screen.findByRole("dialog")
  ).findByLabelText(/What user name would you like/);
  fireEvent.change(userNameTextInput, {
    target: { value: " " },
  });

  screen.getByText(/Ok/).click();

  await waitForElementToBeRemoved(() => screen.getByText(/What user name would you like/));

  await waitFor(() =>
    expect(scorePosts).toEqual([])
  );
});

const wait = () => new Promise(resolve => setTimeout(resolve, 1));

async function scorePointOnEmptyBoard({ iterate, container }) {
  await wait();
  iterate();
  await wait();
  fireEvent.keyDown(container, { keyCode: keys.up });
  await wait()
  fireEvent.keyDown(container, { keyCode: keys.space });
  await wait();
  iterate();
  await wait();
  fireEvent.keyDown(container, { keyCode: keys.up });
  await wait();
  fireEvent.keyDown(container, { keyCode: keys.right });
  await wait();
  fireEvent.keyDown(container, { keyCode: keys.right });
  await wait();
  fireEvent.keyDown(container, { keyCode: keys.right });
  await wait();
  fireEvent.keyDown(container, { keyCode: keys.right });
  await wait();
  fireEvent.keyDown(container, { keyCode: keys.space });
  await wait();
  iterate();
  await wait();
  fireEvent.keyDown(container, { keyCode: keys.right });
  await wait();
  fireEvent.keyDown(container, { keyCode: keys.right });
  await wait();
  fireEvent.keyDown(container, { keyCode: keys.right });
  await wait();
  fireEvent.keyDown(container, { keyCode: keys.right });
  await wait();
  fireEvent.keyDown(container, { keyCode: keys.right });
  await wait();
  fireEvent.keyDown(container, { keyCode: keys.right });
  await wait();
  fireEvent.keyDown(container, { keyCode: keys.right });
  await wait();
  fireEvent.keyDown(container, { keyCode: keys.right });
  await wait();
  fireEvent.keyDown(container, { keyCode: keys.right });
  await wait();
  fireEvent.keyDown(container, { keyCode: keys.space });
  await wait();
  iterate();
  await wait();
  fireEvent.keyDown(container, { keyCode: keys.right });
  await wait();
  fireEvent.keyDown(container, { keyCode: keys.right });
  await wait();
  fireEvent.keyDown(container, { keyCode: keys.right });
  await wait();
  fireEvent.keyDown(container, { keyCode: keys.right });
  await wait();
  fireEvent.keyDown(container, { keyCode: keys.right });
  await wait();
  fireEvent.keyDown(container, { keyCode: keys.right });
  await wait();
  fireEvent.keyDown(container, { keyCode: keys.right });
  await wait();
  fireEvent.keyDown(container, { keyCode: keys.right });
  await wait();
  fireEvent.keyDown(container, { keyCode: keys.space });
  await wait();
  iterate();
  await wait();
}

function getIterableBoard() {
  const { container } = render(
    <SinglePlayerGame shapeProvider={() => lineShape} />
  );

  return {
    iterate: () => window.dispatchEvent(new CustomEvent("iterate-game")),
    container
  };
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
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
beforeEach(() => {
  scorePosts = [];
});
afterAll(() => server.close());
