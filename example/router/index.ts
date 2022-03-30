import { createRouter, createWebHistory } from 'vue-router'

import { VueErdjsConnect } from '../../src'

import HomeView from '../views/Home.vue'
//import PingpongView from '../views/PingPong.vue'
import CustomQRCodeHandler from "./CustomQRCodeHandler";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/pingpong',
      name: 'PingPong',
      component: HomeView,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/authenticate',
      name: 'VueErdjsConnect',
      component: HomeView,
      props: { qrcodeHandler: new CustomQRCodeHandler(), token:"hello"}
    }
  ]
})
/*
router.beforeEach((to, from, next) => {
  if (!to.matched.some(record => record.meta.requiresAuth)) {
      next();
  } else if (!vueErdJsStore.logged) {
      next({
          path: '/authenticate',
          query: {fromUrl: to.fullPath}
      })
  } else {
      next();
  }
})*/

export default router
