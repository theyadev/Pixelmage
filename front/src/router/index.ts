import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Connexion from "@/views/Connexion.vue"

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Connexion',
    component: Connexion
  },
  {
    path: '/publics',
    name: 'Parties Publiques',
    component: () => import('../views/PartiesPubliques.vue')
  },
  {
    path: '/create',
    name: 'Creation Partie',
    component: () => import('../views/CreationPartie.vue')
  },
  {
    path: '/game',
    name: 'Jeu',
    component: () => import('../views/Jeu.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
