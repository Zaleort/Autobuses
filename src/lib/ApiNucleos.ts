import { ApiNucleo } from '@/interfaces/apiResponses';
import api from '@/lib/ApiService';
import store from '@/store';

const urlBase = store.state.urlBase;

export default {
  getNucleos: async (): Promise<ApiNucleo[]> => api.get(`${urlBase}Nucleos`),
  getNucleo: async (id: string): Promise<ApiNucleo> => {
    if (!id) return Promise.reject();
    return api.get(`${urlBase}nucleos/${id}`);
  }
}