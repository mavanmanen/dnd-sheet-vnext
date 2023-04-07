import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: () => import('@/views/Sheet.vue'),
            beforeEnter: (to, from, next) => {
                // @ts-ignore
                const cookies = router.app?.$cookies
                const authCookie = cookies.get('StaticWebAppsAuthCookie')
                if(!authCookie)
                {
                    return next('/.auth/login/github')
                }

                return next()
            }
        }
    ]
})

export default router