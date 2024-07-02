import { createRouter, createWebHistory } from 'vue-router'
import AccueilView from '../views/AccueilView.vue'
import { isAuthenticated } from '@/utils/auth';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'accueil',
      component: AccueilView
    },
    {
      path: '/inscription',
      name: 'inscription',
      component: () => import('@/views/InscriptionView.vue'),
      meta: { requiresGuest: true }
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

// Ajoute la garde de navigation
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresGuest) && isAuthenticated()) {
    // Si la route nécessite un invité et que l'utilisateur est authentifié, rediriger vers l'accueil
    next({ name: 'accueil' });
  } else {
    next(); // Sinon, continuer la navigation
  }
});


export default router
