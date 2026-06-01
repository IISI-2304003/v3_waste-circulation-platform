import { createRouter, createWebHistory } from 'vue-router';

const routes = [
    {
        path: '/',
        name: 'Home',
        component: () => import('../views/HomePage.vue'),
    },
    {
        path: '/standard-input',
        name: 'StandardInput',
        component: () => import('../views/StandardInput.vue'),
    },
    {
        path: '/company-match',
        name: 'CompanyMatch',
        component: () => import('../views/CompanyMatch.vue'),
    },
    {
        path: '/waste',
        name: 'WasteSearch',
        component: () => import('../views/WasteSearchPage.vue'),
    },
    {
        path: '/waste/:code',
        name: 'WasteCodeDetail',
        component: () => import('../views/WasteCodeDetail.vue'),
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition;
        } else {
            return { top: 0 };
        }
    },
});

export default router;
