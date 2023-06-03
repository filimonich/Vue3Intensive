import { createStore } from "vuex";

import initModuleProducts from "./products";
import initModuleCart from "./cart";
import initModuleAlerts from "./alerts";
import initModuleUser from "./user";

export default function initNewStore(api) {
  let products = initModuleProducts(api.products);
  let cart = initModuleCart(api.cart);
  let alerts = initModuleAlerts();
  let user = initModuleUser(api.auth);

  let store = createStore({
    modules: {
      cart,
      products,
      user,
      alerts,
    },
    strict: process.env.NODE_ENV !== "production",
  });

  return store;
}
