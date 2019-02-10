export default {
  path: '/errors',
  component: () => import('@/App'),
  children: [
    {
      path: '403',
      meta: {
        title: '403-Bạn không được phép'
      },
      name: 'forbidden',
      component: () => import('@/views/errors/403')
    },
    {
      path: '500',
      meta: {
        title: '500-Lỗi máy chủ'
      },
      name: 'opps',
      component: () => import('@/views/errors/500.vue')
    }
  ]
}
