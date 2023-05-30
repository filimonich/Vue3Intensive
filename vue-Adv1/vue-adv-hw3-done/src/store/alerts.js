export default {
	namespaced: true,
	state: {
		messages: [],
		lastAI: 0
	},
	getters: {
		all: state => state.messages,
	},
	mutations: {
		add(state, { text, critical }){
			state.messages.push({ id: ++state.lastAI, text, critical });
		},
		remove(state, { id }){
			state.messages = state.messages.filter(msg => msg.id !== id);
		}
	},
	actions: {
		add({ commit, state }, { text, timeout, critical }){
			commit('add', { text, critical });
			let { lastAI } = state;
			
			if(!critical){
				setTimeout(() => {
					commit('remove', { id: lastAI });
				}, timeout);
			}
		}
	}
}