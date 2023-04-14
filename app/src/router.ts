import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: () => import('@/views/Sheet.vue')
        },
        {
            path: '/magic',
            component: () => import('@/views/Magic.vue')
        },
        {
            path: '/notes',
            component: () => import('@/views/Notes.vue')
        },
        {
            path: '/parameters',
            component: () => import('@/views/Parameters.vue')
        }
    ]
})

export default router