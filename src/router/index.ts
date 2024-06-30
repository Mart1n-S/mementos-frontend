import { createRouter, createWebHistory } from 'vue-router'
import AccueilView from '../views/AccueilView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'accueil',
      component: AccueilView
    },
    {
      path: '/categories',
      name: 'categories',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('@/views/CategorieView.vue')
    },
    {
      path: '/themes/:category',
      name: 'themes',
      component: () => import('@/views/ThemeView.vue'),
      props: route => ({ category: route.params.category }),

    },
    {
      path: '/cgu',
      name: 'cgu',
      component: () => import('@/views/CguView.vue')
    },
    {
      path: '/politique-confidentialite',
      name: 'PolitiqueConfidentialite',
      component: () => import('@/views/PolitiqueConfidentialiteView.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue')
    }

  ],
  scrollBehavior() {
    //Permet de remonter en haut de la page à chaque changement de route
    return { top: 0 };
  },
})

export default router
