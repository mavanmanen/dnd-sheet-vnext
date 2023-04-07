import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: () => import('@/views/Sheet.vue'),
            beforeEnter: (to, from) => {
                if(to.path == '/.auth/login/github')
                {
                    return true;
                }
                
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