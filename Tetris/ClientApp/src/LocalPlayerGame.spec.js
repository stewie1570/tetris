import React from "react";
import {
  render,
  screen,
  fireEvent,
  within,
  waitFor,
  act,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import { shapes } from "./components/TetrisGame";
import { keys } from "./core/constants";
import { rest } from "msw";
import { server } from "./setupTests";
import { MemoryRouter } from "react-router";
import { App } from "./App";
import { MultiplayerContext } from "./MultiplayerContext";

const lineShape = shapes[1];

beforeEach(() => {
  server.use(
    rest.get("/api/gameRooms", async (req, res, ctx) => {
      return res(ctx.json([]));
    })
  );
});

test("score a point", async () => {
  const { iterate, container } = getIterableBoard();

  screen.getByText("Score: 0");

  await act(async () => {
    await scorePointOnEmptyBoard({ iterate, container });
  });

  await waitForAnimation();

  const result = getSerializedBoard();
  const expected = `
      *
      *
      * 
      * 
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
      --------##`.replace(/ /gi, "");
  expect(result).toBe(expected);
  screen.getByText("Score: 1");
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

  await waitForAnimation();

  screen.getByText(/Pause/).click();
  (await screen.findByText(/Post My Score/)).click();

  const userNameTextInput = await within(
    await screen.findByRole("dialog")
  ).findByLabelText(/What user name would you like/);
  fireEvent.change(userNameTextInput, {
    target: { value: " Stewie  " },
  });

  screen.getByText(/Ok/).click();

  await waitForElementToBeRemoved(() =>
    screen.getByText(/What user name would you like/)
  );

  expect(scorePosts).toEqual([{ username: "Stewie", score: 1 }]);
});

test("score a point and fail to post score", async () => {
  server.use(
    rest.get("/api/userScores", async (req, res, ctx) => {
      return res(ctx.json(scorePosts));
    }),
    rest.post("/api/userScores", async (req, res, ctx) => {
      return res.networkError("Failed to connect");
    })
  );
  const { iterate, container } = getIterableBoard();

  await act(async () => {
    await scorePointOnEmptyBoard({ iterate, container });
  });

  await waitForAnimation();

  screen.getByText(/Pause/).click();
  (await screen.findByText(/Post My Score/)).click();

  const userNameTextInput = await within(
    await screen.findByRole("dialog")
  ).findByLabelText(/What user name would you like/);
  fireEvent.change(userNameTextInput, {
    target: { value: " Stewie  " },
  });

  screen.getByText(/Ok/).click();

  await waitFor(() => {
    within(screen.getByText("Error").parentElement.parentElement).getByText(
      /Network Error/
    );
  });
});

test("score a point and post score twice", async () => {
  server.use(
    rest.get("/api/userScores", async (req, res, ctx) => {
      return res(ctx.json([]));
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

  await waitForAnimation();

  screen.getByText(/Pause/).click();
  (await screen.findByText(/Post My Score/)).click();

  const userNameTextInput = await within(
    await screen.findByRole("dialog")
  ).findByLabelText(/What user name would you like/);
  fireEvent.change(userNameTextInput, {
    target: { value: "Stewie" },
  });

  screen.getByText(/Ok/).click();

  await waitForElementToBeRemoved(() =>
    screen.queryByText(/What user name would you like/)
  );

  (await screen.findByText(/Post My Score/)).click();
  await screen.findByText("Posting your score...");
  await waitForElementToBeRemoved(() =>
    screen.queryByText("Posting your score...")
  );

  expect(scorePosts).toEqual([
    { username: "Stewie", score: 1 },
    { username: "Stewie", score: 1 },
  ]);
});

test("posting a score too low to show up on the board displays an error", async () => {
  server.use(
    rest.get("/api/userScores", async (req, res, ctx) => {
      return res(
        ctx.json(
          new Array(20).fill(null).map((_, i) => ({
            username: "user" + i,
            score: i,
          }))
        )
      );
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

  await waitForAnimation();

  screen.getByText(/Pause/).click();
  (await screen.findByText(/Post My Score/)).click();

  const userNameTextInput = await within(
    await screen.findByRole("dialog")
  ).findByLabelText(/What user name would you like/);
  fireEvent.change(userNameTextInput, {
    target: { value: "Stewie" },
  });

  screen.getByText(/Ok/).click();

  await waitForElementToBeRemoved(() =>
    screen.queryByText(/What user name would you like/)
  );

  (await screen.findByText(/Post My Score/)).click();
  await screen.findByText("Posting your score...");
  await waitForElementToBeRemoved(() =>
    screen.queryByText("Posting your score...")
  );
  await screen.findByText(
    "Your score was recorded but didn't make the top 20."
  );
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

  await waitForAnimation();

  screen.getByText(/Pause/).click();
  (await screen.findByText(/Post My Score/)).click();

  const userNameTextInput = await within(
    await screen.findByRole("dialog")
  ).findByLabelText(/What user name would you like/);
  fireEvent.change(userNameTextInput, {
    target: { value: "Stewie" },
  });

  screen.getByText(/Cancel/).click();

  await waitForElementToBeRemoved(() =>
    screen.getByText(/What user name would you like/)
  );

  await waitFor(() => expect(scorePosts).toEqual([]));
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

  await waitForAnimation();

  screen.getByText(/Pause/).click();
  (await screen.findByText(/Post My Score/)).click();

  const userNameTextInput = await within(
    await screen.findByRole("dialog")
  ).findByLabelText(/What user name would you like/);
  fireEvent.change(userNameTextInput, {
    target: { value: " " },
  });

  screen.getByText(/Ok/).click();

  await waitForElementToBeRemoved(() =>
    screen.getByText(/What user name would you like/)
  );

  await waitFor(() => expect(scorePosts).toEqual([]));
});

function wait() {
  return new Promise((resolve) => setTimeout(resolve, 1));
}

function waitForAnimation() {
  return new Promise((resolve) => setTimeout(resolve, 600));
}

async function scorePointOnEmptyBoard({ iterate, container }) {
  await wait();
  iterate();
  await wait();
  fireEvent.keyDown(container, { keyCode: keys.up });
  await wait();
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
    <MemoryRouter initialEntries={["/"]}>
      <MultiplayerContext.Provider value={{ userId: "userId" }}>
        <App shapeProvider={() => lineShape} />
      </MultiplayerContext.Provider>
    </MemoryRouter>
  );

  return {
    iterate: () => window.dispatchEvent(new CustomEvent("iterate-game")),
    container,
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
beforeEach(() => {
  scorePosts = [];
});
