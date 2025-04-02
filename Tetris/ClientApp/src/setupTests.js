import "@testing-library/jest-dom";
import { setupServer } from "msw/node";
import { rest } from "msw";
import { afterAll, afterEach, beforeAll } from 'vitest';

// Create a global fetch mock to handle all network requests
global.fetch = async (url, options) => {
  // This will be overridden by MSW handlers
  console.error(`Fetch called with ${url} but no handler was defined`);
  return {
    ok: false,
    status: 400,
    json: async () => ({}),
    text: async () => "",
    headers: new Headers({ 'content-type': 'application/json' }),
  };
};

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
    onUnhandledRequest: 'bypass' // Allow unhandled requests without failing tests
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
