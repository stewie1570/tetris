import { Rest, QuietRest } from "./rest";
import { server } from "../setupTests";
import { rest } from "msw";
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

let receivedUserErrors = [];

beforeEach(() => {
  receivedUserErrors = [];
  window.addEventListener("user-error", (e) => {
    receivedUserErrors.push(e);
  });
});

afterEach(() => {
  window.removeEventListener("user-error", () => {});
});

describe('Rest service', () => {
  it("can make a successful get request", async () => {
    server.use(
      rest.get("http://localhost/something", (req, res, ctx) =>
        res(ctx.json({ prop1: "the expected value" }))
      )
    );

    const result = await Rest.get("/something");

    expect(result).toEqual({ prop1: "the expected value" });
  });

  it("network error is handled", async () => {
    server.use(
      rest.get("http://localhost/something", (req, res) => res.networkError("Network Error"))
    );

    let caughtError;
    try {
      await Rest.get("/something");
    } catch (error) {
      caughtError = error;
    }

    expect(caughtError.message).toBe("Network error");
    expect(receivedUserErrors).toEqual([{ detail: "Network Error" }]);
  });

  it("can make a successful post request", async () => {
    server.use(
      rest.post("http://localhost/something", async (req, res, ctx) => {
        const body = await req.json();
        return res(ctx.json(body));
      })
    );

    const result = await Rest.post({
      url: "/something",
      data: { prop1: "the expected value" },
    });

    expect(result).toEqual({ prop1: "the expected value" });
  });

  it("can make a successful post request with no response payload expected", async () => {
    server.use(
      rest.post("http://localhost/something", (req, res, ctx) => res(ctx.status(200)))
    );

    expect(
      await Rest.post({
        url: "/something",
        data: { prop1: "the expected value" },
      })
    ).toBe("");
  });

  it("handles failed post request with title", async () => {
    server.use(
      rest.post("http://localhost/something", (req, res, ctx) =>
        res(
          ctx.status(500),
          ctx.json({
            title: "the response title",
          })
        )
      )
    );

    let caughtError;

    try {
      await Rest.post({ url: "/something" });
    } catch (error) {
      caughtError = {
        message: error.message,
        status: error.response?.status || 500
      };
    }

    expect(receivedUserErrors).toEqual([{ detail: "the response title" }]);
    expect(caughtError).toEqual({
      message: "Request failed with status code 500",
      status: 500,
    });
  });

  it("handles failed post request with message", async () => {
    server.use(
      rest.post("http://localhost/something", (req, res, ctx) =>
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
      caughtError = {
        message: error.message,
        status: error.response?.status || 500
      };
    }

    expect(receivedUserErrors).toEqual([{ detail: "the response message" }]);
    expect(caughtError).toEqual({
      message: "Request failed with status code 500",
      status: 500,
    });
  });

  it("handles failed post request with status text", async () => {
    server.use(
      rest.post("http://localhost/something", (req, res, ctx) => res(ctx.status(500)))
    );

    let caughtError;

    try {
      await Rest.post({ url: "/something" });
    } catch (error) {
      caughtError = {
        message: error.message,
        status: error.response?.status || 500
      };
    }

    expect(receivedUserErrors).toEqual([
      { detail: "Request failed with status code 500" },
    ]);
    expect(caughtError).toEqual({
      message: "Request failed with status code 500",
      status: 500,
    });
  });

  it("handling error with title", async () => {
    server.use(
      rest.get("http://localhost/something", (req, res, ctx) =>
        res(
          ctx.status(500),
          ctx.json({
            title: "the response title",
          })
        )
      )
    );

    let caughtError;

    try {
      await Rest.get("/something");
    } catch (error) {
      caughtError = {
        message: error.message,
        status: error.response?.status || 500
      };
    }

    expect(receivedUserErrors).toEqual([{ detail: "the response title" }]);
    expect(caughtError).toEqual({
      message: "Request failed with status code 500",
      status: 500,
    });
  });

  it("handling error with message", async () => {
    server.use(
      rest.get("http://localhost/something", (req, res, ctx) =>
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
      caughtError = {
        message: error.message,
        status: error.response?.status || 500
      };
    }

    expect(receivedUserErrors).toEqual([{ detail: "the response message" }]);
    expect(caughtError).toEqual({
      message: "Request failed with status code 500",
      status: 500,
    });
  });

  it("handling error with status text", async () => {
    server.use(
      rest.get("http://localhost/something", (req, res, ctx) => res(ctx.status(500)))
    );

    let caughtError;

    try {
      await Rest.get("/something");
    } catch (error) {
      caughtError = {
        message: error.message,
        status: error.response?.status || 500
      };
    }

    expect(receivedUserErrors).toEqual([
      { detail: "Request failed with status code 500" },
    ]);
    expect(caughtError).toEqual({
      message: "Request failed with status code 500",
      status: 500,
    });
  });
});
