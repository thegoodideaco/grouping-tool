/* eslint-disable no-unused-vars */

import {
  createApp, ref, watch
} from '@vue/composition-api'

import './config'
import '@/assets/style/main.scss'
import App from './App.vue'
import Vue from 'vue'

Vue.config.productionTip = false

createApp(
  new Vue({
    render: (h) => h(App)
  }).$mount('#app')
)
