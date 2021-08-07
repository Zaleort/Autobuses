import api from '@/lib/ApiUsuarios';
import auth from '@/lib/AuthUsuarios';

export interface Tarjeta {
  _id: string;
  nombre: string;
  saldo: number;
  viajes: number;
}

export interface UsuarioState {
  _id: string;
  usuario: string;
  autobuses: {
    lineas: string[];
    tarjetas: Tarjeta[];
    recorridos: any[];
  } | null;
  token: string | null;
  lineas: ApiLinea[];
}

const usuarioState = (): UsuarioState => ({
  _id: '',
  usuario: '',
  autobuses: null,
  token: null,
  lineas: [],
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

  SET_LINEAS: (state: any, lineas: ApiLinea[]) => state.lineas = lineas,
  PUT_LINEA: (state: any, linea: ApiLinea | ApiLinea[]) => {
    if (Array.isArray(linea)) {
      state.lineas.push(...linea);
    } else {
      state.lineas.push(linea);
    }
  },

  DELETE_LINEA: (state: any, linea: string | string[]) => {
    const lineas = [];
    lineas.push(...state.lineas);

    if (Array.isArray(linea)) {
      state.lineas = lineas.filter((l: ApiLinea) => !linea.some(id => id === l._id));
    } else {
      state.lineas = lineas.filter((l: ApiLinea) => l._id !== linea);
    }
  },

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

  getLineasFavoritas: async ({ state, commit }: any) => {
    try {
      const res = await api.getLineasFavoritas(state.usuario);
      commit('SET_LINEAS', res);
      return Promise.resolve(res);
    } catch (error) {
      return Promise.reject(error);
    }
  },

  addLineaFavorita: async ({ state, commit, rootState }: any, id: string | string[]) => {
    if (!id || id.length === 0) return null;

    try {
      const res = await api.addLineaFavorita(state.usuario, id);
      commit('SET_AUTOBUSES', res.autobuses);

      const { lineas } = rootState.lineas;
      let linea;

      if (Array.isArray(id)) {
        linea = lineas.filter((l: ApiLinea) => id.some(_id => _id === l._id));
      } else {
        linea = lineas.find((l: ApiLinea) => l._id === id);
      }

      commit('PUT_LINEA', linea);
      return Promise.resolve(res);
    } catch (error) {
      return Promise.reject(error);
    }
  },

  removeLineaFavorita: async ({ state, commit }: any, linea: string | string[]) => {
    if (!linea || linea.length === 0) return null;

    try {
      const res = await api.removeLineaFavorita(state.usuario, linea);
      commit('SET_AUTOBUSES', res.autobuses);
      commit('DELETE_LINEA', linea);

      return Promise.resolve(res);
    } catch (error) {
      return Promise.reject(error);
    }
  },

  addTarjeta: async ({ state, commit }: any, tarjeta: Tarjeta) => {
    if (!tarjeta) return Promise.reject(new Error('No se ha especificado ninguna tarjeta que añadir'));

    try {
      const res = await api.addTarjeta(state.usuario, tarjeta);
      commit('SET_AUTOBUSES', res.autobuses);

      return Promise.resolve(res);
    } catch (error) {
      return Promise.reject(error);
    }
  },

  editTarjeta: async ({ state, commit }: any, tarjeta: Tarjeta) => {
    if (!tarjeta || !tarjeta._id) return Promise.reject(new Error('No se ha especificado ninguna tarjeta que editar'));

    try {
      const res = await api.editTarjeta(state.usuario, tarjeta);
      commit('SET_AUTOBUSES', res.autobuses);

      return Promise.resolve(res);
    } catch (error) {
      return Promise.reject(error);
    }
  },

  removeTarjeta: async ({ state, commit }: any, id: string) => {
    if (!id) return Promise.reject(new Error('Debes especificar un ID'));

    try {
      const res = await api.removeTarjeta(state.usuario, id);
      commit('SET_AUTOBUSES', res.autobuses);

      return Promise.resolve(res);
    } catch (error) {
      return Promise.reject(error);
    }
  },
};

export default {
  namespaced: true,
  state: usuarioState,
  mutations,
  actions,
};
