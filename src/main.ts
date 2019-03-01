import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import moment from 'moment'
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'
import * as filters from '@/utils/filters'

Vue.config.productionTip = false
moment.locale('zh-cn')
Vue.use(MintUI)

// 注册全局过滤器
Object.keys(filters).forEach((key: string) => {
  Vue.filter(key, filters[key])
})

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
