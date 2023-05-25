import { createStore } from "vuex";

import products from "./products";
import cart from "./cart";

const store = {
  modules: {
    products,
    cart,
  },
  strict: process.env.NODE_ENV !== "production",
};

export default createStore(store);

/* $store.state.products.all
$store.state.cart.all

$store.getters.all 

$store.getters['products/all']
$store.getters['cart/all']

*/
