<template>
  <div>
    <h1>Cart</h1>
    <hr />
    <table class="table table-bordered table-hover">
      <thead>
        <tr>
          <th>Title</th>
          <th>Price</th>
          <th>Cnt</th>
          <th>Total</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="pr in products" :key="pr.id">
          <td>{{ pr.title.trim() }}</td>
          <td>{{ pr.price }}</td>
          <td>{{ pr.cnt }}</td>
          <td>{{ pr.price * pr.cnt }}</td>
          <td>
            <button
              class="btn btn-warning me-1"
              @click="setCnt({ id: pr.id, cnt: pr.cnt - 1 })"
            >
              -1
            </button>
            <button
              class="btn btn-success"
              @click="setCnt({ id: pr.id, cnt: pr.cnt + 1 })"
            >
              +1
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <hr />
    <router-link :to="{ name: 'checkout' }" class="btn btn-success"
      >Checkout</router-link
    >
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  computed: {
    // Импортируем функцию mapGetters из vuex и применяем ее к модулю "cart".
    // Мы создаем вычисляемое свойство "products",
    // которое будет содержать результат геттера "itemsDetailed" из модуля "cart".
    ...mapGetters("cart", { products: "itemsDetailed" }),
  },
  methods: {
    // Импортируем функцию mapActions из vuex и применяем ее к модулю "cart".
    // Мы создаем метод "setCnt", который будет вызывать действие "setCnt" из модуля "cart".
    ...mapActions("cart", ["setCnt"]),
  },
};
</script>
