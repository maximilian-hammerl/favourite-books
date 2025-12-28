import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: () => import('@/views/Login.vue'),
    },
    {
      path: '/books',
      children: [
        { path: '', name: 'books', component: () => import('@/views/Books.vue') },
        { path: ':bookId', name: 'book', component: () => import('@/views/Book.vue') },
      ],
    },
    {
      path: '/authors',
      children: [
        {path: '', name: 'authors', component: () => import('@/views/Authors.vue')},
      ]
    }
  ],
})

export default router
