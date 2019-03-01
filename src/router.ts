import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import Work from './views/work/routes/index'

let routes: any[] = []
routes = routes.concat(Work)
routes.unshift({
  path: '/',
  name: 'home',
  component: Home,
})
Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});
