import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import Home from '@/views/Home.vue';

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
  {
    path: '/login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "login" */ '@/views/Login.vue'),
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import(/* webpackChunkName: "register" */ '@/views/Register.vue'),
  },
  {
    path: '/tarifas',
    name: 'Tarifas',
    component: () => import(/* webpackChunkName: "tarifas" */ '@/views/Tarifas.vue'),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
