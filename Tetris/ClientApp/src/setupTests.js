import "@testing-library/jest-dom";
import { setupServer } from "msw/node";
import { rest } from "msw";
import { afterAll, afterEach, beforeAll } from 'vitest';

// Define handlers for different HTTP methods
const methods = [rest.delete, rest.get, rest.post, rest.put];

// Default handler for unhandled requests
const handler = async (req, res, ctx) => {
  console.error(`${req.method} ${req.url.toString()} is not mocked.`);
  return res(ctx.status(400), ctx.json({}));
};

// Create MSW server with wildcard handlers for all HTTP methods
export const server = setupServer(
  ...methods.map((method) => method("*", handler))
);

// Start server before all tests
beforeAll(() => {
  server.listen({ 
    onUnhandledRequest: 'error' // Make unhandled requests fail the test
  });
});

// Reset handlers after each test
afterEach(() => {
  server.resetHandlers();
  window.sessionStorage.clear();
  window.localStorage.clear();
});

// Close server after all tests
afterAll(() => server.close());
