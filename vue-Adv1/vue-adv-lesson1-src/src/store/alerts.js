export default {
	namespaced: true,
	state: {
		messages: []
	},
	getters: {
		all: state => state.messages,
	},
	mutations: {
		add(state, { text }){
			state.messages.push({ text }); // hw: type, mb time
		}
	},
	actions: {
		add({ commit }, payload){
			commit('add', payload);
		}
	}
}