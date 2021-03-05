import api from '@/lib/ApiService';

const urlBase = 'http://localhost:3000/api/';

export default {
  getLineas: async (): Promise<ApiLinea[]> => api.get(`${urlBase}lineas`),
  getLinea: async (id: string): Promise<ApiLinea> => {
    if (!id) return Promise.reject();
    return api.get(`${urlBase}lineas/${id}`);
  },
};
