export default cartApi => ({
	async load({ commit }){
		let savedToken = localStorage.getItem('cartToken');
		let { res, data } = await cartApi.load(savedToken);
		
		if(res){
			let { token, needUpdate, cart } = data;
		
			if(needUpdate){
				localStorage.setItem('cartToken', token);
			}
				
			commit('set', { cart, token });
		}
	},
	async add({ state, getters, commit }, { id }){
		if(getters.canAdd(id)){
			commit('startProccess', id);
			let { res, data } = await cartApi.add(state.token, id)
			
			if(res && data){
				commit('add', { id });		
			}	

			commit('endProccess', id);
		}
	},
	async remove({ state, getters, commit }, { id }){
		if(getters.canUpdate(id)){
			commit('startProccess', id);
			let { res, data } = await cartApi.remove(state.token, id)

			if(res && data){
				commit('remove', { ind: getters.index(id) });
			}

			commit('endProccess', id);
		}
	},
	async setCnt({ state, getters, commit, dispatch }, { id, cnt }){
		if(getters.canUpdate(id)){
			commit('startProccess', id);
			let validCnt = Math.max(1, cnt);
			let { res, data } = await cartApi.change(state.token, id, validCnt)
			
			if(res && data){
				commit('setCnt', { ind: getters.index(id), cnt: validCnt });
			}
			
			commit('endProccess', id);
		}
	}
});