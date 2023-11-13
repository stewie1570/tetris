import "@testing-library/jest-dom";
import { setupServer } from "msw/node";
import { rest } from "msw";

const methods = [rest.delete, rest.get, rest.post, rest.put];
const handler = async (req, res, ctx) => {
  console.error(`${req.method} ${req.url} is not mocked.`);
  return res(ctx.status(400), ctx.json({}));
};
export const server = setupServer(
  ...methods.map((method) => method(/(.*)/, handler))
);
beforeAll(() => server.listen());
afterEach(() => {
  server.resetHandlers();
  window.sessionStorage.clear();
  window.localStorage.clear();
});
afterAll(() => server.close());
