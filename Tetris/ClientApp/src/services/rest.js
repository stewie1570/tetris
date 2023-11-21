class HttpError extends Error {
  constructor(message, response) {
    super(message);
    this.response = response;
  }
}

const errorHandled = async (request) => {
  try {
    return await request;
  } catch (caughtError) {
    const error = caughtError?.response?.data;
    const message =
      error?.title ||
      caughtError?.response?.data?.message ||
      "An unknown error occurred.";

    window.dispatchEvent(new CustomEvent("user-error", { detail: message }));
    throw caughtError;
  }
};

async function assertSuccessfulFetchResponse(response) {
  if (!response.ok) {
    let data;
    try {
      data = await response.json();
    } catch (error) {}
    throw new HttpError(`Request failed with status code ${response.status}`, {
      ...response,
      data,
    });
  }
}

const makeFetchRequest = async (...args) => {
  try {
    return await fetch(...args);
  } catch (networkError) {
    throw new HttpError("Network error", {
      data: { title: "Network Error" },
    });
  }
};

const get = async (url) => {
  const response = await makeFetchRequest(url);
  await assertSuccessfulFetchResponse(response);
  return await response.json();
};

const post = async (url, data) => {
  const response = await makeFetchRequest(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  await assertSuccessfulFetchResponse(response);
  const contentType = response.headers.get("content-type");
  return contentType && contentType.indexOf("application/json") !== -1
    ? response.json()
    : response.text();
};

export const Rest = {
  get: (url) => errorHandled(get(url)),
  post: ({ url, data }) => errorHandled(post(url, data)),
};

export const QuietRest = {
  get: (url) => get(url),
  post: ({ url, data }) => post(url, data),
};
