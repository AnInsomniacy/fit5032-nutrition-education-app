import {createApp} from 'vue'
import {createPinia} from 'pinia'
import router from './router'
import {useAuthStore} from './stores/auth'
import 'bootstrap/dist/css/bootstrap.min.css'
import App from './App.vue'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

const authStore = useAuthStore()
authStore.initializeAuth()

app.mount('#app')
