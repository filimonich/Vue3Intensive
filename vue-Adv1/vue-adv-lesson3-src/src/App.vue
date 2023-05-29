<template>
  <div id="app" class="grid-box">
    <!-- Компонент для вывода уведомлений -->
    <app-alerts></app-alerts>
    <header class="mt-3">
      <div class="container">
        <div class="row justify-content-between">
          <div class="col flex-norm">
            <!-- // Заголовок сайта -->
            <div class="h3">Sample site</div>
            <!-- // Описание сайта -->
            <div class="">About some and other products</div>
          </div>
          <div class="col flex-norm">
            <!-- // Количество товаров в корзине -->
            <div>In Cart: {{ cartCount }}</div>
            <!-- // Общая стоимость товаров в корзине -->
            <div>Total: {{ cartTotal }}</div>
          </div>
        </div>
        <hr />
        <nav class="navbar navbar-expand p-0">
          <ul class="navbar-nav">
            <li v-for="item in menuItems" :key="item.route" class="nav-item">
              <router-link
                :to="{ name: item.route }"
                class="nav-link"
                active-class="active"
                :exact="item.exact"
                >{{ item.title }}</router-link
              >
              <!-- // Ссылки на разделы сайта в навигационном меню -->
            </li>
          </ul>
        </nav>
        <hr />
      </div>
    </header>
    <section>
      <div class="container">
        <!-- // Роутер для отображения компонентов -->
        <router-view v-slot="{ Component }">
          <transition name="slide" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </section>
    <footer class="mb-3">
      <div class="container">
        <hr />
        <!-- // Копирайт -->
        <div>&copy; Rights not found</div>
      </div>
    </footer>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import AppAlerts from "@/components/Alerts"; // Импорт компонента для вывода уведомлений

export default {
  components: {
    AppAlerts,
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters("cart", { cartCount: "totalCnt", cartTotal: "totalSum" }), // Вычисляемые свойства для получения данных о корзине
    ...mapGetters("user", ["isLogin"]), // Вычисляемое свойство для проверки статуса авторизации пользователя
    menuItems() {
      let menu = [
        { route: "products", title: "Products", exact: true }, // Ссылка на раздел "Products"
        { route: "cart", title: "Cart", exact: true }, // Ссылка на раздел "Cart"
        { route: "checkout", title: "Checkout", exact: true }, // Ссылка на раздел "Checkout"
      ];

      menu.push(
        this.isLogin
          ? { route: "office", title: "Office", exact: false } // Ссылка на раздел "Office" для авторизованного пользователя
          : { route: "login", title: "Login", exact: false } // Ссылка на раздел "Login" для неавторизованного пользователя
      );

      return menu;
    },
  },
};
</script>

<style>
.grid-box {
  display: grid;
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;
}

.flex-norm {
  flex: 0 1 auto !important;
  width: auto !important;
}

a.active {
  color: red !important;
}

.slide-enter-active {
  animation: slideIn 0.3s;
}

.slide-leave-active {
  animation: slideOut 0.3s;
}

@keyframes slideIn {
  from {
    transform: rotateY(90deg);
  }
  to {
    transform: rotateY(0deg);
  }
}

@keyframes slideOut {
  from {
    transform: rotateY(0deg);
  }
  to {
    transform: rotateY(90deg);
  }
}
</style>
