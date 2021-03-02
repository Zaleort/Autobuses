import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import Home from '../views/Home.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/lineas',
    name: 'Lineas',
    component: () => import(/* webpackChunkName: "lineas" */ '@/views/Lineas.vue'),
  },
  {
    path: '/lineas/:id',
    name: 'Linea',
    component: () => import(/* webpackChunkName: "linea" */ '@/views/Linea.vue'),
  },
  /* {
    path: '/nucleos',
    name: 'Nucleos',
    component: () => import(/* webpackChunkName: "nucleos" / '@/views/Nucleos.vue'),
  }, */
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
