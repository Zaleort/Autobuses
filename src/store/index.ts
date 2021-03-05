import { InjectionKey } from 'vue';
import { createStore, useStore as baseUseStore, Store } from 'vuex';
import linea, { LineaState } from '@/store/linea';

export interface State {
  linea: LineaState;
  urlBase: string;
}

export const key: InjectionKey<Store<State>> = Symbol('storeKey');

export default createStore<State>({
  state: {
    linea: linea.state(),
    urlBase: 'http://localhost:3000/api/',
  },

  mutations: {
  },
  actions: {
  },
  modules: {
    linea,
  },
});

export function useStore() {
  return baseUseStore(key);
}
