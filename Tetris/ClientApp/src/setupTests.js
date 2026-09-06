import "@testing-library/jest-dom/vitest";
import { setupServer } from "msw/node";
import { http, HttpResponse } from "msw";
import { vi } from "vitest";

globalThis.jest = vi;
window.scrollTo = () => {};

export const server = setupServer(
  http.all("*", ({ request }) => {
    console.error(`${request.method} ${request.url} is not mocked.`);
    return HttpResponse.json({}, { status: 400 });
  })
);
beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => {
  server.resetHandlers();
  window.sessionStorage.clear();
  window.localStorage.clear();
});
afterAll(() => server.close());
