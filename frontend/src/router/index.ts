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
        { path: '', name: 'allBooks', component: () => import('@/views/AllBooks.vue') },
        { path: ':bookId', name: 'singleBook', component: () => import('@/views/SingleBook.vue') },
      ],
    },
    {
      path: '/book-series',
      children: [
        { path: '', name: 'allBookSeries', component: () => import('@/views/AllBookSeries.vue') },
        {
          path: ':bookSeriesId',
          name: 'singleBookSeries',
          component: () => import('@/views/SingleBookSeries.vue'),
        },
      ],
    },
    {
      path: '/authors',
      children: [
        { path: '', name: 'allAuthors', component: () => import('@/views/AllAuthors.vue') },
        {
          path: ':authorId',
          name: 'singleAuthor',
          component: () => import('@/views/SingleAuthor.vue'),
        },
      ],
    },
    {
      path: '/categories',
      name: 'allCategories',
      component: () => import('@/views/AllCategories.vue'),
    },
  ],
})

export default router
