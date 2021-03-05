import api from '@/lib/ApiLineas';

export interface LineaState {
  _id: string | null;
  name: string | null;
  accesible: boolean | null;
  horarios: ApiHorarios | null;
  paradas: ApiParada[] | null;
  paradasIda: string[] | null;
  paradasVuelta: string[] | null;
  nucleos: ApiNucleo[] | null;
  nucleosIda: string[] | null;
  nucleosVuelta: string[] | null;
  saltos: number | null;
}

const lineaState = (): LineaState => ({
  _id: null,
  name: null,
  accesible: null,
  horarios: null,
  paradas: null,
  paradasIda: null,
  paradasVuelta: null,
  nucleos: null,
  nucleosIda: null,
  nucleosVuelta: null,
  saltos: null,
});

const mutations = {
  SET_ID: (state: any, id: string) => state._id = id,
  SET_NAME: (state: any, name: string) => state.name = name,
  SET_ACCESIBLE: (state: any, accesible: boolean) => state.accesible = accesible,
  SET_HORARIOS: (state: any, horarios: ApiHorarios) => state.horarios = horarios,
  SET_PARADAS: (state: any, paradas: ApiParada[]) => state.paradas = paradas,
  SET_PARADAS_IDA: (state: any, paradas: string[]) => state.paradasIda = paradas,
  SET_PARADAS_VUELTA: (state: any, paradas: string[]) => state.paradasVuelta = paradas,
  SET_NUCLEOS: (state: any, nucleos: ApiNucleo[]) => state.nucleos = nucleos,
  SET_NUCLEOS_IDA: (state: any, nucleos: string[]) => state.nucleosIda = nucleos,
  SET_NUCLEOS_VUELTA: (state: any, nucleos: string[]) => state.nucleosVuelta = nucleos,
  SET_SALTOS: (state: any, saltos: number) => state.saltos = saltos,
};

const actions = {
  loadLinea: async (state: any, id: string): Promise<ApiLinea> => {
    if (!id) return Promise.reject(new Error('No se ha especificado un ID'));

    try {
      const res = await api.getLinea(id);
      state.commit('SET_ID', res._id);
      state.commit('SET_NAME', res.name);
      state.commit('SET_ACCESIBLE', res.accesible);
      state.commit('SET_HORARIOS', res.horarios);
      state.commit('SET_PARADAS', res.paradasInfo);
      state.commit('SET_PARADAS_IDA', res.paradasIda);
      state.commit('SET_PARADAS_VUELTA', res.paradasVuelta);
      state.commit('SET_NUCLEOS', res.nucleosInfo);
      state.commit('SET_NUCLEOS_IDA', res.nucleosIda);
      state.commit('SET_NUCLEOS_VUELTA', res.nucleosVuelta);
      state.commit('SET_SALTOS', res.saltos);

      return Promise.resolve(res);
    } catch (error) {
      return Promise.reject(error);
    }
  },
};

export default {
  state: lineaState,
  mutations,
  actions,
};
