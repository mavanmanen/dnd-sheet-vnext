import { createApp } from 'vue'
import App from '@/App.vue'
import router from '@/router'
import Layout from './Layout.vue'

import '@/style/main.scss'

const app = createApp(App)
app.component('layout', Layout)
app.use(router)
app.mount('#app')