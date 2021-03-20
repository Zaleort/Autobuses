import { InjectionKey } from 'vue';
import { createStore, useStore as baseUseStore, Store } from 'vuex';
import linea from '@/store/linea';
import lineas from '@/store/lineas';
import nucleos from '@/store/nucleos';
import usuario from '@/store/usuario';

export interface State {
  [key: string]: any;
  urlBase: string;
}

export const key: InjectionKey<Store<State>> = Symbol('storeKey');

export default createStore<State>({
  state: {
    urlBase: 'http://localhost:3000/api/',
  },

  mutations: {
  },
  actions: {
  },
  modules: {
    linea,
    lineas,
    nucleos,
    usuario,
  },
});

export function useStore() {
  return baseUseStore(key);
}
