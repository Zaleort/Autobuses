import api from '@/lib/ApiService';

const urlBase = 'http://localhost:3000/api/';

export default {
  getUsuarios: async (): Promise<AuthUsuario[]> => api.get(`${urlBase}usuarios`),
  getUsuario: async (id: string): Promise<AuthUsuario> => {
    if (!id) return Promise.reject();
    return api.get(`${urlBase}usuarios/${id}`);
  },

  getLineasFavoritas: async (usuario: string): Promise<ApiLinea[]> => {
    if (!usuario) return Promise.reject();
    return api.get(`${urlBase}usuarios/${usuario}/lineas`);
  },

  addLineaFavorita: async (usuario: string, id: string | string[]): Promise<AuthUsuario> => {
    if (!id) return Promise.reject();
    return api.post(`${urlBase}usuarios/${usuario}/lineas`, { linea: id });
  },

  removeLineaFavorita: async (usuario: string, id: string | string[]): Promise<AuthUsuario> => {
    if (!id) return Promise.reject();
    return api.delete(`${urlBase}usuarios/${usuario}/lineas`, { linea: id });
  },
};
