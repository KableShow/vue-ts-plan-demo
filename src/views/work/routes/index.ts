const routes: any[] = [{
  path: '/work',
  name: 'work',
  component: () => import(/* webpackChunkName: "work" */ '@/views/work/index.vue'),
}, {
  path: '/work/edit',
  name: 'workEdit',
  component: () => import(/* webpackChunkName: "work" */ '@/views/work/Edit.vue'),
}]

export default routes
