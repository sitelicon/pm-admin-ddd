import queryString from 'query-string';

const STORAGE_KEY = 'accessToken';
const VERSION_API = process.env.NEXT_PUBLIC_API_VERSION;

const evaluateResponse = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json().then((json) => {
      // If response status is 401, remove token from localStorage and reload the page
      if (response.status === 401 && json.message === 'Unauthenticated.') {
        globalThis.localStorage.removeItem(STORAGE_KEY);
        globalThis.location.reload();
      }
      const error = new Error(json.message);
      error.response = response;
      error.data = json;
      throw error;
    });
  }
  const error = new Error(response.statusText);
  error.response = response;
  throw error;
};

const handleResponseFormat = (response) => {
  const contentType = response.headers.get('content-type');

  // JSON response
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  }

  // File response
  if (contentType && contentType.includes('application/octet-stream')) {
    return response.blob();
  }

  // Text response
  return response.text();
};

const DEFAULT_OPTIONS = {
  useToken: true,
  params: {},
};

/**
 * Helper function to make a request to the API.
 * @param {String} url - The URL to make the request to (i.e. "auth/login").
 * @param {Object} options - The options to pass to the fetch request.
 * @param {String} options.method - The HTTP method to use (i.e. "GET", "POST").
 * @param {Object} options.params - The query params to pass to the request.
 * @param {Object} options.body - The body of the request.
 * @param {Object} options.headers - The headers of the request.
 * @param {Object} options.useToken - Whether to use the token from localStorage.
 * @returns {Promise} - The response from the API.
 */
export const apiRequest = async (url, options = DEFAULT_OPTIONS) => {
  const { useToken, params, version, ...rest } = options;
  const includeToken = useToken || useToken === undefined;
  const useVersion = version ?? VERSION_API;

  if (includeToken) {
    const token = globalThis.localStorage.getItem(STORAGE_KEY);

    if (token) {
      rest.headers = {
        ...rest.headers,
        Authorization: `Bearer ${token}`,
      };
    }
  }

  const urlWithParams = queryString.stringifyUrl(
    {
      url: `${process.env.NEXT_PUBLIC_API_URL}/api${
        url.startsWith('/') ? `/${useVersion}${url}` : `/${useVersion}/${url}`
      }`,
      query: params,
    },
    {
      arrayFormat: 'index',
    },
  );

  return fetch(urlWithParams, {
    ...rest,
    method: rest.method || 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...rest.headers,
    },
  })
    .then(evaluateResponse)
    .then(handleResponseFormat);
};
