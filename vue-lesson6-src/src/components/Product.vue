<template>
  <div>
    <h2>Product title</h2>
    <div class="price">{{ price }}</div>
    <hr />
    <button class="btn btn-warning" @click="decrease">-1</button>
    <input type="text" :value="cnt" @change="setCnt" />
    <button class="btn btn-success" @click="increase">+1</button>
    <hr />
    <button class="btn btn-primary" @click="sendOrder">Send</button>
    <div class="alert alert-warning" v-if="orderIsPending">Pending...</div>
    <div class="alert alert-success" v-else-if="orderIsDone">Done!</div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  computed: mapGetters(["price", "cnt", "orderIsPending", "orderIsDone"]),
  methods: {
    increase() {
      this.$store.commit("increase");
    },
    decrease() {
      this.$store.commit("decrease");
    },
    setCnt(e) {
      this.$store.commit("setCnt", parseInt(e.target.value));
    },
    sendOrder() {
      this.$store.dispatch("send");
    },
  },
};
</script>
