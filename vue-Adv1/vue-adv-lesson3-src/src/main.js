import { createApp } from "vue";
import App from "./App.vue";

import store from "./store"; // Импорт хранилища Vuex
import router from "./router"; // Импорт роутера Vue Router

let app = createApp(App).use(store).use(router); // Создание экземпляра приложения Vue с использованием хранилища и роутера

store.dispatch("user/autoLogin"); // Вызов действия "autoLogin" для автоматической авторизации пользователя
store.dispatch("cart/load"); // Вызов действия "load" для загрузки данных корзины
store.dispatch("products/load").then(() => {
  // Вызов действия "load" для загрузки данных о продуктах с последующим монтированием приложения
  app.mount("#app");
});

import "bootstrap/dist/css/bootstrap.css"; // Импорт стилей Bootstrap
