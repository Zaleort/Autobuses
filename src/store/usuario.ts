import auth from '@/lib/AuthUsuarios';

export interface UsuarioState {
  _id: string;
  usuario: string;
  autobuses: object | null;
}

const usuarioState = (): UsuarioState => ({
  _id: '',
  usuario: '',
  autobuses: null,
});

const mutations = {
  SET_ID: (state: any, id: string) => state._id = id,
  SET_USUARIO: (state: any, usuario: string) => state.usuario = usuario,
  SET_AUTOBUSES: (state: any, autobuses: ApiHorarios) => state.autobuses = autobuses,
  PUT_LINEA: (state: any, linea: ApiParada[]) => state.autobuses.lineas.push(linea),
  DELETE_LINEA: (state: any, linea: string[]) => state.autobuses.lineas.slice(1, 0),
  PUT_RECORRIDO: (state: any, recorrido: string[]) => state.autobuses.recorridos.push(recorrido),
  DELETE_RECORRIDO: (state: any, recorrido: ApiNucleo[]) => state.autobuses.recorridos.slice(1, 0),
};

const actions = {
  login: async (state: any, usuario: AuthUsuario) => {
    if (!usuario) return Promise.reject(new Error('Sin datos'));
    if (!usuario.usuario) return Promise.reject(new Error('Debes especificar un usuario'));
    if (!usuario.contrasena) return Promise.reject(new Error('Debes especificar una contraseña'));

    try {
      const log = await auth.login(usuario);

      state.commit('SET_ID', log._id);
      state.commit('SET_USUARIO', log.usuario);
      state.commit('SET_AUTOBUSES', log.autobuses);

      return Promise.resolve(log);
    } catch (error) {
      return Promise.reject(error);
    }
  },

  register: async (state: any, usuario: AuthUsuario) => {
    if (!usuario) return Promise.reject(new Error('Sin datos'));
    if (!usuario.usuario) return Promise.reject(new Error('Debes especificar un usuario'));
    if (!usuario.contrasena) return Promise.reject(new Error('Debes especificar una contraseña'));

    try {
      const log = await auth.register(usuario);

      state.commit('SET_ID', log._id);
      state.commit('SET_USUARIO', log.usuario);
      state.commit('SET_AUTOBUSES', log.autobuses);

      return Promise.resolve(log);
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
