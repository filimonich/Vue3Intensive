import { createStore } from "vuex";

/*
	const ORDER_STATUSES = {
		new: 0,
		pending: 1,
		done: 2
	}
*/

const store = {
  state: {
    price: 1000,
    cnt: 1,
    orderStatus: 0,
  },
  getters: {
    price: (state) => state.price,
    cnt: (state) => state.cnt,
    total: (state) => state.price * state.cnt,
    orderIsNothing: (state) => state.orderStatus == 0, // wtf my english
    orderIsPending: (state) => state.orderStatus == 1,
    orderIsDone: (state) => state.orderStatus == 2,
  },
  mutations: {
    decrease(state) {
      if (state.cnt > 1) {
        state.cnt--;
      }
    },
    increase(state) {
      state.cnt++;
    },
    setCnt(state, val) {
      state.cnt = Math.max(1, val);
    },
    setOrderStatus(state, status) {
      state.orderStatus = status;
    },
  },
  actions: {
    send(store) {
      store.commit("setOrderStatus", 1);

      // request to server
      setTimeout(() => {
        store.commit("setOrderStatus", 2);
      }, 500);
    },
  },
  strict: process.env.NODE_ENV !== "production",
};

export default createStore(store);

/*
	class VuexParody{
		state = {}
		mutations = {}

		commit(name){
			let fn = this.mutations[name]
			fn(this.state);
		}
	}

*/
