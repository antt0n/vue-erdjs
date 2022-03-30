import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import VueErdJsPlugin from '../src/VueErdJsPlugin'

const app = createApp(App)

app.use(router)
app.use(VueErdJsPlugin)

app.mount('#app')
