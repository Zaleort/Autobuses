export default {
  async get(url: string) {
    const response = await fetch(url);

    if (!response.ok) {
      const json = await response.json();
      const error = {
        status: response.status,
        statusText: response.statusText,
        message: json.message,
      };

      return Promise.reject(error);
    }

    return response.json();
  },

  async post(url: string, body: any) {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const json = await response.json();
      const error = {
        status: response.status,
        statusText: response.statusText,
        message: json.message || null,
      };

      return Promise.reject(error);
    }

    return response.json();
  },
};
