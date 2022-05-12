/**
* Author: Tautvydas Dikšas
* Date: 2022-05-10
* Path: src/router/index
*
*/
import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/statistics',
    name: 'Statistics',
    component: () => import(/* webpackChunkName: "dashboard" */ '../views/Statistics.vue'),
  },
  {
    path: '/calendar',
    name: 'Calendar',
    component: () => import(/* webpackChunkName: "calendar" */ '../views/Calendar.vue'),
  },
  {
    path: '/workouts',
    name: 'Workouts',
    component: () => import(/* webpackChunkName: "workouts" */ '../views/Workouts.vue'),
  },
  {
    path: '/supervisors',
    name: 'Supervisors',
    component: () => import(/* webpackChunkName: "supervisors" */ '../views/Supervisors.vue'),
  },
  {
    path: '/exercises',
    name: 'Exercises',
    component: () => import(/* webpackChunkName: "exercises" */ '../views/Exercises.vue'),
  },
  {
    path: '/logger',
    name: 'Logger',
    component: () => import(/* webpackChunkName: "meals" */ '../views/Logger.vue'),
  },
  {
    path: '*',
    name: '404',
    component: () => import(/* webpackChunkName: "404" */ '../views/404.vue'),
  },
];

const router = new VueRouter({
  mode: 'history',
  routes,
});

export default router;
