export default (productsApi) => ({
  namespaced: true,
  state: {
    items: null,
  },
  getters: {
    all: (state) => state.items,
    one: (state) => (id) => state.items.find((pr) => pr.id == id),
  },
  mutations: {
    setItems(state, items) {
      state.items = items;
    },
  },
  actions: {
    async load({ commit }) {
      let products = await productsApi.all();
      commit("setItems", products);
      return products;
    },
  },
});
