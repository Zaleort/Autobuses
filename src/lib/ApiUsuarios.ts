import api from '@/lib/ApiService';

const urlBase = 'http://localhost:3000/api/';

export default {
  getUsuarios: async (): Promise<AuthUsuario[]> => api.get(`${urlBase}usuarios`),
  getUsuario: async (id: string): Promise<AuthUsuario> => {
    if (!id) return Promise.reject();
    return api.get(`${urlBase}usuarios/${id}`);
  },

  addLineaFavorita: async (usuario: string, id: string): Promise<AuthUsuario> => {
    if (!id) return Promise.reject();
    return api.post(`${urlBase}usuarios/${usuario}/lineas`, { linea: id });
  },

  removeLineaFavorita: async (usuario: string, id: string): Promise<AuthUsuario> => {
    if (!id) return Promise.reject();
    return api.delete(`${urlBase}usuarios/${usuario}/lineas/${id}`);
  },
};
