import axios from "axios";

const errorHandled = async (request) => {
  try {
    return (await request)?.data;
  } catch (caughtError) {
    const error = caughtError?.response?.data;
    const message =
      error?.title || caughtError?.message || "An unknown error occurred.";
    window.onerror(message);
  }
};

export const Rest = {
  get: (url) => errorHandled(axios.get(url)),
  post: ({ url, data }) => errorHandled(axios.post(url, data)),
};
