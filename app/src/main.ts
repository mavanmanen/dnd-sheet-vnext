import { createApp } from 'vue'
import VueCookies from 'vue-cookies'
import App from './App.vue'
import router from './router'

const app = createApp(App)
app.use(VueCookies)
app.use(router)
// @ts-ignore
router.app = app
app.mount('#app')