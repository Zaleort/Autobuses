export default {
  async get(url: string) {
    const token = localStorage.getItem('token');
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

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
    const token = localStorage.getItem('token');
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
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

  async put(url: string, body: any) {
    const token = localStorage.getItem('token');
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
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

  async delete(url: string, body: any) {
    const token = localStorage.getItem('token');
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

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
};
