import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import VueApexCharts from 'vue3-apexcharts'
import router from './router'
import App from './App.vue'

// PrimeVue CSS - MUST be imported directly, not via @import
import 'primevue/resources/themes/lara-light-blue/theme.css'
import 'primeicons/primeicons.css'

// App styles (Tailwind)
import './style.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(PrimeVue)
app.use(router)

// Register ApexCharts component globally
// eslint-disable-next-line vue/component-definition-name-casing
app.component('apexchart', VueApexCharts)

app.mount('#app')
