import { createRouter, createWebHistory } from "vue-router";

import store from "@/store"; // Импорт хранилища Vuex

import ProductsList from "@/views/ProductsList"; // Импорт компонента списка продуктов
import Product from "@/views/Product"; // Импорт компонента продукта
import Cart from "@/views/Cart"; // Импорт компонента корзины
import Checkout from "@/views/Checkout"; // Импорт компонента оформления заказа
import E404 from "@/views/E404"; // Импорт компонента ошибки 404
import Login from "@/views/Login"; // Импорт компонента авторизации
import OfficeBase from "@/views/office/Base"; // Импорт базового компонента для раздела "Офис"
import OfficeIndex from "@/views/office/Index"; // Импорт компонента главной страницы раздела "Офис"
import OfficeOrders from "@/views/office/Orders"; // Импорт компонента страницы заказов раздела "Офис"

// Определение массива маршрутов
let routes = [
  // Каждый маршрут представлен объектом с полями name, path и component

  {
    name: "products", // Имя маршрута
    path: "/", // Путь маршрута
    component: ProductsList, // Компонент для отображения на этом маршруте
  },
  {
    name: "products-item", // Имя маршрута
    path: "/products/:id", // Путь маршрута с динамическим сегментом
    component: Product, // Компонент для отображения на этом маршруте
  },
  {
    name: "cart", // Имя маршрута
    path: "/cart", // Путь маршрута
    component: Cart, // Компонент для отображения на этом маршруте
  },
  {
    name: "checkout", // Имя маршрута
    path: "/order", // Путь маршрута
    component: Checkout, // Компонент для отображения на этом маршруте
  },
  {
    name: "login", // Имя маршрута
    path: "/login", // Путь маршрута
    component: Login, // Компонент для отображения на этом маршруте
    async beforeEnter(from, to, next) {
      // Асинхронная функция, выполняемая перед переходом на маршрут "login"
      await store.getters["user/ready"]; // Ожидание готовности пользователя
      store.getters["user/isLogin"] ? next({ name: "office" }) : next(); // Перенаправление на маршрут "office", если пользователь авторизован, иначе продолжение перехода
    },
  },
  {
    path: "/office", // Путь маршрута
    component: OfficeBase, // Компонент для отображения на этом маршруте
    meta: { auth: true }, // Мета-свойство "auth" для проверки авторизации
    children: [
      // Дочерние маршруты
      {
        path: "", // Путь дочернего маршрута
        component: OfficeIndex, // Компонент для отображения на этом маршруте
        name: "office", // Имя маршрута
      },
      {
        path: "orders", // Путь дочернего маршрута
        component: OfficeOrders, // Компонент для отображения на этом маршруте
        name: "office-orders", // Имя маршрута
      },
    ],
  },
  {
    path: "/:any(.*)", // Универсальный маршрут для любых несовпадающих путей
    component: E404, // Компонент для отображения на этом маршруте (обычно страница "не найдено")
  },
];

const router = createRouter({
  history: createWebHistory(), // Создание истории маршрутов с использованием HTML5 History API
  routes,
});

router.beforeEach(async (to, from, next) => {
  // Глобальный перехватчик, вызываемый перед каждым переходом на новый маршрут
  if (to.meta.auth) {
    // Проверка наличия мета-свойства "auth" у целевого маршрута
    await store.getters["user/ready"]; // Ожидание готовности пользователя
    store.getters["user/isLogin"] ? next() : next({ name: "login" }); // Если пользователь не авторизован, перенаправление на маршрут "login", в противном случае продолжение перехода
  } else {
    next(); // Продолжение перехода
  }
});

export default router; // Экспорт экземпляра роутера
