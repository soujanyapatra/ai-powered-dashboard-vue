import { createApp } from 'vue'
import { createPinia } from 'pinia'
import VueApexCharts from 'vue3-apexcharts'
import App from './App.vue'
import './style.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
// eslint-disable-next-line vue/component-definition-name-casing
app.component('apexchart', VueApexCharts)
app.mount('#app')

