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

const get = async (url) => {
  const response = await fetch(url);
  await assertSuccessfulFetchResponse(response);
  return await response.json();
};

const post = async (url, data) => {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  await assertSuccessfulFetchResponse(response);
  return await response.json();
};

export const Rest = {
  get: (url) => errorHandled(get(url)),
  post: ({ url, data }) => errorHandled(post(url, data)),
};
