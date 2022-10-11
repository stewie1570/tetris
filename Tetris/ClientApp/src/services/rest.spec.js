import { rest } from "msw";
import { Rest } from "./rest";
import { server } from "../setupTests";

let receivedUserErrors = [];

const addEvent = (event) => receivedUserErrors.push({ detail: event.detail });

beforeEach(() => {
  window.addEventListener("user-error", addEvent);
});
afterEach(() => {
  receivedUserErrors = [];
  window.removeEventListener("user-error", addEvent);
});

test("can make a successful get request", async () => {
  server.use(
    rest.get("/something", (req, res, ctx) =>
      res(ctx.json({ prop1: "the expected value" }))
    )
  );

  expect(await Rest.get("/something")).toEqual({
    prop1: "the expected value",
  });
});

test("network error is handled", async () => {
  server.use(rest.get("/something", (req, res, ctx) => res.networkError()));

  let caughtError;
  try {
    await Rest.get("/something");
  } catch (error) {
    caughtError = error;
  }

  expect(receivedUserErrors).toEqual([{ detail: "Network Error" }]);
  expect(caughtError.message).toEqual("Network error");
});

test("can make a successful post request", async () => {
  server.use(
    rest.post("/something", (req, res, ctx) => res(ctx.json(req.body)))
  );

  expect(
    await Rest.post({
      url: "/something",
      data: { prop1: "the expected value" },
    })
  ).toEqual({
    prop1: "the expected value",
  });
});

test("can make a successful post request with no response payload expected", async () => {
  server.use(rest.post("/something", (req, res, ctx) => res(ctx.status(200))));

  expect(
    await Rest.post({
      url: "/something",
      data: { prop1: "the expected value" },
    })
  ).toEqual("");
});

test("handles failed post request with title", async () => {
  server.use(
    rest.post("/something", (req, res, ctx) =>
      res(
        ctx.status(500),
        ctx.json({
          title: "the response title",
          message: "the response message",
        })
      )
    )
  );

  let caughtError;

  try {
    await Rest.post({ url: "/something" });
  } catch (error) {
    const {
      message,
      response: { status },
    } = error;
    caughtError = { message, status };
  }

  expect(receivedUserErrors).toEqual([{ detail: "the response title" }]);
  expect(caughtError).toEqual({
    message: "Request failed with status code 500",
    status: 500,
  });
});

test("handles failed post request with message", async () => {
  server.use(
    rest.post("/something", (req, res, ctx) =>
      res(
        ctx.status(500),
        ctx.json({
          message: "the response message",
        })
      )
    )
  );

  let caughtError;

  try {
    await Rest.post({ url: "/something" });
  } catch (error) {
    const {
      message,
      response: { status },
    } = error;
    caughtError = { message, status };
  }

  expect(receivedUserErrors).toEqual([{ detail: "the response message" }]);
  expect(caughtError).toEqual({
    message: "Request failed with status code 500",
    status: 500,
  });
});

test("handles failed post request with status text", async () => {
  server.use(rest.post("/something", (req, res, ctx) => res(ctx.status(500))));

  let caughtError;

  try {
    await Rest.post({ url: "/something" });
  } catch (error) {
    const {
      message,
      response: { status },
    } = error;
    caughtError = { message, status };
  }

  expect(receivedUserErrors).toEqual([
    { detail: "An unknown error occurred." },
  ]);
  expect(caughtError).toEqual({
    message: "Request failed with status code 500",
    status: 500,
  });
});

test("handling error with title", async () => {
  server.use(
    rest.get("/something", (req, res, ctx) =>
      res(
        ctx.status(500),
        ctx.json({
          title: "the response title",
          message: "the response message",
        })
      )
    )
  );

  let caughtError;

  try {
    await Rest.get("/something");
  } catch (error) {
    const {
      message,
      response: { status },
    } = error;
    caughtError = { message, status };
  }

  expect(receivedUserErrors).toEqual([{ detail: "the response title" }]);
  expect(caughtError).toEqual({
    message: "Request failed with status code 500",
    status: 500,
  });
});

test("handling error with message", async () => {
  server.use(
    rest.get("/something", (req, res, ctx) =>
      res(
        ctx.status(500),
        ctx.json({
          message: "the response message",
        })
      )
    )
  );

  let caughtError;

  try {
    await Rest.get("/something");
  } catch (error) {
    const {
      message,
      response: { status },
    } = error;
    caughtError = { message, status };
  }

  expect(receivedUserErrors).toEqual([{ detail: "the response message" }]);
  expect(caughtError).toEqual({
    message: "Request failed with status code 500",
    status: 500,
  });
});

test("handling error with status text", async () => {
  server.use(rest.get("/something", (req, res, ctx) => res(ctx.status(500))));

  let caughtError;

  try {
    await Rest.get("/something");
  } catch (error) {
    const {
      message,
      response: { status },
    } = error;
    caughtError = { message, status };
  }

  expect(receivedUserErrors).toEqual([
    { detail: "An unknown error occurred." },
  ]);
  expect(caughtError).toEqual({
    message: "Request failed with status code 500",
    status: 500,
  });
});
