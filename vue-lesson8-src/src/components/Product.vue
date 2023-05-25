<template>
  <div v-if="hasProduct">
    <h1>{{ product.title }}</h1>
    Back to products
    <hr />
    <div class="alert alert-success">
      {{ product.price }}
    </div>
  </div>
  <app-e-404 v-else />
</template>

<script>
import { mapGetters } from "vuex";
import AppE404 from "./E404.vue";

export default {
  components: {
    AppE404,
  },
  computed: {
    ...mapGetters("products", { productById: "one" }),
    id() {
      return parseInt(this.$route.params.id);
    },
    validId() {
      return /^[1-9]+\d*$/.test(this.id);
    },
    product() {
      return this.productById(this.id);
    },
    hasProduct() {
      return this.validId && this.product !== undefined;
    },
  },
};
</script>
