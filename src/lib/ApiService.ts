export default {
  async get(url: string) {
    const response = await fetch(url);
    return response.json();
  },

  async post(url: string, body: any) {
    const response = await fetch(url, {
      method: 'POST',
      body,
    });
    return response.json();
  },
};
