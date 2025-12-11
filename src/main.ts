import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// Import global styles
import '@/assets/main.css'

const app = createApp(App)

// Register Pinia for state management
app.use(createPinia())

// Register Vue Router
app.use(router)

app.mount('#app')
