import { createRouter, createWebHashHistory } from '@ionic/vue-router';
import type { RouteRecordRaw } from 'vue-router';

import HomePage from '../views/HomePage.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/home',
  },
  {
    path: '/home',
    name: 'Home',
    component: HomePage,
  },
];

// Hash history dipilih agar aplikasi tetap berfungsi ketika di-host pada
// sub-folder web server (http://localhost/tugas3_stsi4303/app/) tanpa perlu
// konfigurasi rewrite/alias tambahan pada Apache.
const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
