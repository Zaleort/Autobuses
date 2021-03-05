import api from '@/lib/ApiService';

const urlBase = 'http://localhost:3000/api/';

export default {
  getNucleos: async (): Promise<ApiNucleo[]> => api.get(`${urlBase}nucleos`),
  getNucleo: async (id: string): Promise<ApiNucleo> => {
    if (!id) return Promise.reject();
    return api.get(`${urlBase}nucleos/${id}`);
  },
};
