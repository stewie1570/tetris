import { rest } from "msw";
import { Rest } from "./rest";
import { server } from "../setupTests";
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

let receivedUserErrors = [];

const addEvent = (event) => receivedUserErrors.push({ detail: event.detail });

beforeEach(() => {
  receivedUserErrors = [];
  window.addEventListener("user-error", addEvent);
});

afterEach(() => {
  window.removeEventListener("user-error", addEvent);
  server.resetHandlers();
});

describe('Rest service', () => {
  it("can make a successful get request", async () => {
    server.use(
      rest.get("/something", (req, res, ctx) =>
        res(ctx.json({ prop1: "the expected value" }))
      )
    );

    expect(await Rest.get("/something")).toEqual({
      prop1: "the expected value",
    });
  });

  it("network error is handled", async () => {
    server.use(rest.get("/something", (req, res) => res.networkError()));

    let caughtError;
    try {
      await Rest.get("/something");
    } catch (error) {
      caughtError = error;
    }

    expect(receivedUserErrors).toEqual([{ detail: "Network Error" }]);
    expect(caughtError.message).toEqual("Network error");
  });

  it("can make a successful post request", async () => {
    server.use(
      rest.post("/something", async (req, res, ctx) => {
        const body = await req.json();
        return res(ctx.json(body));
      })
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

  it("can make a successful post request with no response payload expected", async () => {
    server.use(rest.post("/something", (req, res, ctx) => res(ctx.status(200))));

    expect(
      await Rest.post({
        url: "/something",
        data: { prop1: "the expected value" },
      })
    ).toEqual("");
  });

  it("handles failed post request with title", async () => {
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

  it("handles failed post request with message", async () => {
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

  it("handles failed post request with status text", async () => {
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

  it("handling error with title", async () => {
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

  it("handling error with message", async () => {
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

  it("handling error with status text", async () => {
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
});
