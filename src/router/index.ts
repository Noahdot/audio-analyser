import { createWebHistory, createRouter, type RouteRecordRaw, type Router } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/playground'
  },
  { 
    path: '/playground',
    component: () => import('../views/playground/index.vue')
  }
];

const router: Router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

export default router;