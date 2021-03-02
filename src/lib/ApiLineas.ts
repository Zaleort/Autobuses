import { ApiLinea } from '@/interfaces/apiResponses';
import api from '@/lib/ApiService';
import store from '@/store';

const urlBase = store.state.urlBase;

export default {
  getLineas: async (): Promise<ApiLinea[]> => api.get(`${urlBase}lineas`),
  getLinea: async (id: string): Promise<ApiLinea> => {
    if (!id) return Promise.reject();
    return api.get(`${urlBase}lineas/${id}`);
  }
}