import { createRouter, createWebHistory, createMemoryHistory } from 'vue-router'

import ProductsList from '@/views/ProductsList';
import Product from '@/views/Product';
import Cart from '@/views/Cart';
import Checkout from '@/views/Checkout';
import E404 from '@/views/E404';
import Login from '@/views/Login';
import OfficeBase from '@/views/office/Base';
import OfficeIndex from '@/views/office/Index';
import OfficeOrders from '@/views/office/Orders';

export default function initNewRouter(store) {
  let routes = [
    {
      name: 'products',
      path: '/',
      component: ProductsList
    },
    {
      name: 'products-item',
      path: '/products/:id',
      component: Product
    },
    {
      name: 'cart',
      path: '/cart',
      component: Cart,
      meta: { noSSR: true }
    },
    {
      name: 'checkout',
      path: '/order',
      component: Checkout,
      meta: { noSSR: true }
    },
    {
      name: 'login',
      path: '/login',
      component: Login,
      meta: { noSSR: true },
      async beforeEnter(from, to, next) {
        await store.getters['user/ready'];
        store.getters['user/isLogin'] ? next({ name: 'office' }) : next();
      }
    },
    {
      path: '/office',
      component: OfficeBase,
      meta: { auth: true },
      children: [
        {
          path: '',
          component: OfficeIndex,
          name: 'office'
        },
        {
          path: 'orders',
          component: OfficeOrders,
          name: 'office-orders'
        }
      ]
    },
    {
      path: '/:any(.*)',
      component: E404,
      meta: { is404: true }
    }
  ];

  const router = createRouter({
    history: process.isServer ? createMemoryHistory() : createWebHistory(process.env.BASE_URL),
    routes
  })

  router.beforeEach(async (to, from, next) => {
    if (process.isClient && to.meta.auth) {
      await store.getters['user/ready'];
      store.getters['user/isLogin'] ? next() : next({ name: 'login' });
    }
    else {
      next();
    }
  });

  return router;
}