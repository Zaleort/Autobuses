import api from '@/lib/ApiLineas';

export interface LineasState {
  lineas: ApiLinea[];
}

const lineasState = () => ({
  lineas: [],
});

const mutations = {
  SET_LINEAS: (state: any, lineas: ApiLinea[]) => state.lineas = lineas,
};

const actions = {
  load: async ({ commit }: any) => {
    try {
      const response = await api.getLineas();
      commit('SET_LINEAS', response);

      return Promise.resolve(response);
    } catch (error) {
      return Promise.reject(error);
    }
  },
};

export default {
  namespaced: true,
  state: lineasState,
  mutations,
  actions,
};
