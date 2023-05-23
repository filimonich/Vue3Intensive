export default {
  namespaced: true,
  state: {
    items: [],
  },
  getters: {
    inCart: (state) => (id) => state.items.some((item) => item.id == id),
    length: (state) => state.items.length,
    // total: (state, getter, rootState, rootGetters) rootGetters
  },
  mutations: {
    add(state, id) {
      state.items.push({ id, cnt: 1 });
    },
    remove(state, id) {
      state.items = state.items.filter((item) => item.id != id);
    },
  },
  actions: {
    add({ commit, getters }, id) {
      if (!getters.inCart(id)) {
        commit("add", id);
      }
    },
    remove({ commit, getters }, id) {
      if (getters.inCart(id)) {
        commit("remove", id);
      }
    },
  },
};

/*
	inCart(state){
		return function(id){
			return state.items.some(item => item.id == id);
		}
	}

	inCart: state => id => state.items.some(item => item.id == id)
*/
