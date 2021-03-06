import api from '@/lib/ApiService';

const urlBase = 'http://localhost:3000/auth/';

export default {
  register: async (usuario: AuthUsuario): Promise<AuthUsuario> => {
    if (!usuario) return Promise.reject();
    return api.post(`${urlBase}register`, usuario);
  },
  login: async (usuario: AuthUsuario): Promise<AuthUsuario> => {
    if (!usuario) return Promise.reject();
    return api.post(`${urlBase}login`, usuario);
  },
  logout: async (): Promise<any> => api.get(`${urlBase}logout`),
  checkToken: async (): Promise<AuthUsuario> => api.get(`${urlBase}token`),
};
