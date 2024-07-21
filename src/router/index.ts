import { createRouter, createWebHistory } from 'vue-router'
import AccueilView from '../views/AccueilView.vue'
import { useAuthStore } from '@/stores/authStore';
import { useRevisionStore } from '@/stores/revisionStore';

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
      path: '/connexion',
      name: 'connexion',
      component: () => import('@/views/ConnexionView.vue'),
      meta: { requiresGuest: true }
    },
    {
      path: '/profil',
      name: 'profil',
      component: () => import('@/views/ProfilView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/mon-mementos',
      name: 'mon-mementos',
      component: () => import('@/views/RevisionsView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/mon-mementos/gestion/:themeId',
      name: 'RevisionsManagement',
      component: () => import('@/views/GestionRevisionsView.vue'),
      props: true,
      meta: { requiresAuth: true }
    },
    {
      path: '/mon-mementos/revision',
      name: 'revision',
      component: () => import('@/views/ShowRevision.vue'),
      meta: { requiresAuth: true },
      beforeEnter: async (to, from, next) => {
        const authStore = useAuthStore();
        const revisionStore = useRevisionStore();

        if (authStore.user !== null) {
          await revisionStore.fetchUserRevision(authStore.user.id);
        }

        if (revisionStore.themesRevision.length === 0) {
          next('/mon-mementos');
        } else {
          next();
        }
      }
    },
    {
      path: '/creer-themes',
      name: 'creer-themes',
      component: () => import('@/views/CreateThemeView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/mes-themes',
      name: 'mes-themes',
      component: () => import('@/views/UserThemeView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/mes-themes/gestion/:themeId',
      name: 'ThemeManagement',
      component: () => import('@/views/CrudCartesView.vue'),
      props: true,
      meta: { requiresAuth: true }
    },
    {
      path: '/mes-themes/gestion/update/:themeId',
      name: 'theme-update',
      component: () => import('@/views/UpdateThemeView.vue'),
      props: true,
      meta: { requiresAuth: true }
    },
    {
      path: '/profil/update',
      name: 'modifier-profil',
      component: () => import('@/views/UpdateUserView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/reset-password',
      name: 'reset-password',
      component: () => import('@/views/RequestResetPasswordView.vue'),
      meta: { requiresGuest: true }
    },
    {
      path: '/change-password',
      name: 'change-password',
      component: () => import('@/views/ResetPasswordView.vue')
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
      props: true,
    },
    {
      path: '/themes/:themeId/preview',
      name: 'preview',
      component: () => import('@/views/PreviewCardListView.vue'),
      props: route => ({ themeId: Number(route.params.themeId) })
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
  const authStore = useAuthStore();

  // Vérifie l'état d'authentification avant chaque navigation
  authStore.checkAuth();

  // Vérifie si la route nécessite un accès invité et si l'utilisateur est authentifié
  if (to.matched.some(record => record.meta.requiresGuest) && authStore.isAuthenticated) {
    // Redirige vers la page d'accueil si l'utilisateur est déjà authentifié
    next({ name: 'accueil' });
  } else if (to.matched.some(record => record.meta.requiresAuth) && !authStore.isAuthenticated) {
    // Redirige vers la page de connexion si l'utilisateur n'est pas authentifié
    next({ name: 'connexion' });
  } else {
    // Poursuivre la navigation
    next();
  }
});


export default router
