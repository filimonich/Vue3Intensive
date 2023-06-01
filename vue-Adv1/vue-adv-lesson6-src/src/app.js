import { createSSRApp, createApp } from 'vue'
import App from './App.vue'
import initNewHttp from './api/http'
import initNewApi from './api/index'
import initNewRouter from './router'
import initNewStore from './store'

async function getApp(){
	let app;
	let http = initNewHttp();
	let api = initNewApi(http);
	let store = initNewStore(api);
	let router = initNewRouter(store);

	connectLayers(http, store, router);
	
	store.dispatch('user/autoLogin');

	if(process.isClient){
		let hasInitialState = window.hasOwnProperty('INITIAL_STATE');
		store.dispatch('cart/load');

		if(hasInitialState){
			store.replaceState(window.INITIAL_STATE);
		}
		else{
			await store.dispatch('products/load');
		}

		app = simpleCreateApp(App, api, store, router, hasInitialState)
	}
	else{
		app = simpleCreateApp(App, api, store, router, true);
		await store.dispatch('products/load');
	}

	return { app, router, store };
}

function simpleCreateApp(App, api, store, router, isSsr){
	let createUniversalApp = isSsr ? createSSRApp : createApp;
	let app = createUniversalApp(App);
	app.config.globalProperties.$api = api;
	return app.use(store).use(router);
}

function connectLayers(http, store, router){
	http.interceptors.response.use(
		function(response){
		  if('errorAlert' in response.config){
			 response.data = { res: true, data: response.data };
		  }
	 
		  return response;
		},
		function(error){
		  let config = error.response.config;
	 
		  if(error.response.status == 401 && config.appSilence401 !== true){
			 // clean user data & tokens
			 store.dispatch('user/clean');
	 
			 router.push({name: 'login'}).then(() => { 
				location.reload(); // options vs 33 idea
			 });
			 return; // ?
		  }
	 
		  if('errorAlert' in config){
			 let { errorAlert } = config;
	 
			 if(typeof errorAlert === 'string'){
				errorAlert = { text: errorAlert };
			 }
	 
			 store.dispatch('alerts/add', { 
				text: 'Ошибка ответа от сервера ' + errorAlert.text,
				timeout: errorAlert.timeout ?? 5000,
				critical: errorAlert.critical ?? false
			 });
	 
			 return { data: { res: false, data: null }};
		  }
		  
		  return Promise.reject(error);
		}
	 );
}

export default getApp;