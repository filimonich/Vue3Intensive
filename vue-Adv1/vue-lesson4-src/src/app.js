import { createSSRApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

function getApp(){
	let app = createSSRApp(App).use(store).use(router);
	return { app, router, store };
}

export default getApp;