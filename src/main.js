import { CSV_PATHS } from './config'
import Vue from 'vue'
import App from './App.vue'
import '@/assets/style/main.scss'
import { createApp } from '@vue/composition-api'

console.log(CSV_PATHS)

Vue.config.productionTip = false

createApp(new Vue({
  render: h => h(App)
}).$mount('#app'))
