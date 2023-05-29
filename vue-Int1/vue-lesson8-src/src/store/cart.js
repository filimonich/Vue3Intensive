const BASEURL = "http://faceprog.ru/reactcourseapi/cart/";

export default {
  namespaced: true,
  state: {
    items: [],
    token: null,
  },
  getters: {
    // Геттер "inCart" принимает "state" и возвращает функцию, которая принимает "id".
    // Он проверяет, есть ли товар с заданным "id" в корзине.
    inCart: (state) => (id) => state.items.some((item) => item.id == id),

    // Геттер "itemsDetailed" принимает "state", "getters", "rootState" и "rootGetters".
    // Он возвращает новый массив элементов корзины с дополнительными деталями.
    // Каждый элемент возвращаемого массива содержит свойства товара, полученные через геттер "products/one",
    // а также свойство "cnt" (количество), взятое из состояния "state.items".
    itemsDetailed: (state, getters, rootState, rootGetters) => {
      return state.items.map((item) => {
        let product = rootGetters["products/one"](item.id);
        return { ...product, cnt: item.cnt };
      });
    },

    // Геттер "length" возвращает длину массива "state.items".
    length: (state) => state.items.length,

    // Геттер "total" принимает "state" и "getters".
    // Он использует геттер "itemsDetailed" для получения детальной информации о товарах в корзине.
    // Затем, с помощью метода "reduce", вычисляет общую стоимость товаров в корзине,
    // умножая цену каждого товара на его количество.
    // Начальное значение аккумулятора равно 0.
    total: (state, getters) =>
      getters.itemsDetailed.reduce((t, i) => t + i.price * i.cnt, 0),
  },
  mutations: {
    load(state, { cart, token }) {
      state.items = cart;
      state.token = token;
    },
    add(state, id) {
      state.items.push({ id, cnt: 1 });
    },
    remove(state, id) {
      state.items = state.items.filter((item) => item.id != id);
    },
    setCnt(state, { id, cnt }) {
      let item = state.items.find((item) => item.id == id);
      item.cnt = cnt;
    },
  },
  actions: {
    async load({ commit }) {
      let oldToken = localStorage.getItem("CART__TOKEN");
      let response = await fetch(`${BASEURL}load.php?token=${oldToken}`);
      let { cart, token, needUpdate } = await response.json();

      if (needUpdate) {
        localStorage.setItem("CART__TOKEN", token);
      }

      commit("load", { cart, token });
    },
    async add({ commit, getters, state }, id) {
      if (!getters.inCart(id)) {
        let response = await fetch(
          `${BASEURL}add.php?token=${state.token}&id=${id}`
        );
        let res = await response.json();

        if (res) {
          commit("add", id);
        }
      }
    },
    async remove({ commit, getters, state }, id) {
      if (getters.inCart(id)) {
        let response = await fetch(
          `${BASEURL}remove.php?token=${state.token}&id=${id}`
        );
        let res = await response.json();

        if (res) {
          commit("remove", id);
        }
      }
    },
    setCnt({ commit, getters }, { id, cnt }) {
      if (getters.inCart(id)) {
        let item = getters.itemsDetailed.find((item) => item.id == id);
        let validCnt = Math.min(Math.max(cnt, 1), item.rest);
        commit("setCnt", { id, cnt: validCnt });
      }
    },
  },
};
