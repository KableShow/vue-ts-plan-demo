import Vue, { AsyncComponent } from 'vue'
import Router, { RouteConfig, Route, NavigationGuard } from 'vue-router'
const List: AsyncComponent = (): any => import('@/components/List.vue')
const Edit: AsyncComponent = (): any => import('@/components/Edit.vue')

Vue.use(Router)

const routes: RouteConfig[] = [
  {
    path: '/',
    name: 'List',
    component: List
  },
  {
    path: '/edit',
    name: 'Edit',
    component: Edit
  }
]

const router: Router = new Router({
  mode: 'history',
  base: '/',
  routes
})

export default router
