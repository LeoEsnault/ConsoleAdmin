import { supabase } from 'src/supabase/supabase';
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [  
      { path: '', component: () => import('pages/UsersPage.vue') }, 
      { path: '/me', component: () => import('pages/ProfilePage.vue') },
      { path: '/update-password', component: () => import('pages/UpdatePasswordPage.vue') }
    ],
    meta: { requiresAuth: true }
  },
  {
    path: '/admin',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: 'establishments', component: () => import('pages/admin/EstablishmentsPage.vue') },
      { path: 'services', component: () => import('pages/admin/ServicesPage.vue') },
    ],
    meta: { requiresAuth: true }
  },

  {
    path: '/login',
    component: () => import('src/pages/LoginUserPage.vue'),
    children: []
  },
  {
    path: '/reset-password',
    name: 'reset',
    component: () => import('src/pages/ResetPasswordPage.vue'),
  },
  {
    path: '/forgot-password',
    name: 'forgot',
    component: () => import('src/pages/ForgotPasswordPage.vue'),

  },
  {
    path: '/page-not-found',
    component: () => import('src/pages/PageNoLongerExist.vue'),
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('src/pages/ErrorNotFoundPage.vue'),
  },
]

// Vérifie si l'utilisateur est connecté avec Supabase
const authGuard = async (to, from, next) => {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error || !session) {
    next({ path: '/login' });
  } else {
    next();
  }
};

// Ajouter le garde de navigation à toutes les routes nécessitant une authentification
routes.forEach(route => {
  if (route.meta && route.meta.requiresAuth) {
    route.beforeEnter = authGuard;
  }
});

export default routes
