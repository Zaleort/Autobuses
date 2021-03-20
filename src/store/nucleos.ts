import api from '@/lib/ApiNucleos';

export interface NucleosState {
  nucleos: ApiNucleo[];
}

const nucleosState = () => ({
  nucleos: [],
});

const mutations = {
  SET_NUCLEOS: (state: any, nucleos: ApiNucleo[]) => state.nucleos = nucleos,
};

const actions = {
  load: async ({ commit }: any) => {
    try {
      const response = await api.getNucleos();
      commit('SET_NUCLEOS', response);

      return Promise.resolve(response);
    } catch (error) {
      return Promise.reject(error);
    }
  },
};

export default {
  namespaced: true,
  state: nucleosState,
  mutations,
  actions,
};
