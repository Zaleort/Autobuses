import { ApiNucleo } from '@/interfaces/apiResponses';
import api from '@/lib/ApiService';
import store from '@/store';

const { urlBase } = store.state;

export default {
  getNucleos: async (): Promise<ApiNucleo[]> => api.get(`${urlBase}nucleos`),
  getNucleo: async (id: string): Promise<ApiNucleo> => {
    if (!id) return Promise.reject();
    return api.get(`${urlBase}nucleos/${id}`);
  },
};
