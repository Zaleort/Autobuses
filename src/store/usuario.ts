import auth from '@/lib/AuthUsuarios';
import api from '@/lib/ApiUsuarios';

export interface UsuarioState {
  _id: string;
  usuario: string;
  autobuses: object | null;
  token: string | null;
}

const usuarioState = (): UsuarioState => ({
  _id: '',
  usuario: '',
  autobuses: null,
  token: null,
});

const mutations = {
  SET_ID: (state: any, id: string) => {
    localStorage.setItem('id', id);
    state._id = id;
  },

  DELETE_ID: (state: any) => {
    localStorage.removeItem('id');
    state._id = null;
  },

  SET_USUARIO: (state: any, usuario: string) => {
    localStorage.setItem('usuario', usuario);
    state.usuario = usuario;
  },

  DELETE_USUARIO: (state: any) => {
    localStorage.removeItem('usuario');
    state.usuario = null;
  },

  SET_AUTOBUSES: (state: any, autobuses: ApiHorarios) => {
    localStorage.setItem('autobuses', JSON.stringify(autobuses));
    state.autobuses = autobuses;
  },

  DELETE_AUTOBUSES: (state: any) => {
    localStorage.removeItem('autobuses');
    state.autobuses = null;
  },

  PUT_LINEA: (state: any, linea: ApiParada[]) => state.autobuses.lineas.push(linea),
  DELETE_LINEA: (state: any, linea: string[]) => state.autobuses.lineas.slice(1, 0),
  PUT_RECORRIDO: (state: any, recorrido: string[]) => state.autobuses.recorridos.push(recorrido),
  DELETE_RECORRIDO: (state: any, recorrido: ApiNucleo[]) => state.autobuses.recorridos.slice(1, 0),

  SET_TOKEN: (state: any, token: string) => {
    localStorage.setItem('token', token);
    state.token = token;
  },

  DELETE_TOKEN: (state: any) => {
    localStorage.removeItem('token');
    state.token = null;
  },
};

const actions = {
  clearUsuario: ({ commit }: any) => {
    commit('DELETE_ID');
    commit('DELETE_USUARIO');
    commit('DELETE_AUTOBUSES');
    commit('DELETE_TOKEN');
  },

  checkToken: async ({ commit }: any) => {
    const token = localStorage.getItem('token');
    if (!token) return Promise.reject(new Error('Sin token'));

    try {
      const response = await auth.checkToken();
      commit('SET_ID', response._id);
      commit('SET_USUARIO', response.usuario);
      commit('SET_AUTOBUSES', response.autobuses);
      commit('SET_TOKEN', response.token);
      return Promise.resolve(response);
    } catch (error) {
      return Promise.reject(error);
    }
  },

  login: async (context: any, usuario: AuthUsuario) => {
    if (!usuario) return Promise.reject(new Error('Sin datos'));
    if (!usuario.usuario) return Promise.reject(new Error('Debes especificar un usuario'));
    if (!usuario.contrasena) return Promise.reject(new Error('Debes especificar una contraseña'));

    try {
      const log = await auth.login(usuario);

      context.commit('SET_ID', log._id);
      context.commit('SET_USUARIO', log.usuario);
      context.commit('SET_AUTOBUSES', log.autobuses);
      context.commit('SET_TOKEN', log.token);

      return Promise.resolve(log);
    } catch (error) {
      return Promise.reject(error);
    }
  },

  register: async (context: any, usuario: AuthUsuario) => {
    if (!usuario) return Promise.reject(new Error('Sin datos'));
    if (!usuario.usuario) return Promise.reject(new Error('Debes especificar un usuario'));
    if (!usuario.contrasena) return Promise.reject(new Error('Debes especificar una contraseña'));

    try {
      const log = await auth.register(usuario);

      context.commit('SET_ID', log._id);
      context.commit('SET_USUARIO', log.usuario);
      context.commit('SET_AUTOBUSES', log.autobuses);
      context.commit('SET_TOKEN', log.token);

      return Promise.resolve(log);
    } catch (error) {
      return Promise.reject(error);
    }
  },

  logout: async ({ state, commit }: any) => {
    if (!state.usuario || !state.token) {
      return Promise.reject(new Error('El usuario no tiene la sesión iniciada'));
    }

    try {
      const res = await auth.logout();
      commit('DELETE_ID');
      commit('DELETE_USUARIO');
      commit('DELETE_AUTOBUSES');
      commit('DELETE_TOKEN');
      return Promise.resolve(res);
    } catch (error) {
      return Promise.reject(error);
    }
  },

  addLineaFavorita: async ({ state, commit }: any, linea: string) => {
    if (!linea) return Promise.reject(new Error('No se ha especificado ninguna línea'));

    try {
      const res = await api.addLineaFavorita(state.usuario, linea);
      commit('SET_AUTOBUSES', res.autobuses);

      return Promise.resolve(res);
    } catch (error) {
      return Promise.reject(error);
    }
  },
};

export default {
  state: usuarioState,
  mutations,
  actions,
};
