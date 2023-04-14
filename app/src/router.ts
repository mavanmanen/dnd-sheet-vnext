import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            name: 'Sheet',
            path: '/',
            component: () => import('@/views/Sheet.vue')
        },
        {
            name: 'Magic',
            path: '/magic',
            component: () => import('@/views/Magic.vue')
        },
        {
            name: 'Notes',
            path: '/notes',
            component: () => import('@/views/Notes.vue')
        },
        {
            name: 'Parameters',
            path: '/parameters',
            component: () => import('@/views/Parameters.vue')
        },
        {
            name: 'JSON',
            path: '/json',
            component: () => import('@/views/JSON.vue')
        }
    ]
})

export default router