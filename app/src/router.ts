import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: () => import('@/views/Sheet.vue'),
            beforeEnter: (to, from) => {
                console.log(to, from)
                // @ts-ignore
                const cookies = router.app?.$cookies
                const authCookie = cookies.get('StaticWebAppsAuthCookie')
                if(!authCookie)
                {
                    return '/.auth/login/github'
                }

                return true
            }
        }
    ]
})

export default router