// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router/index.ts'
import store from './store/index.ts'
import moment from 'moment'
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'

Vue.config.productionTip = false
moment.locale('zh-cn')
Vue.use(MintUI)

/* eslint-disable no-new */
const app: Vue = new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
