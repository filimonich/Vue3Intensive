import getApp from './app.js';

(async function(){
	let { app, router } = await getApp();
	await router.isReady();
	app.mount('#app');
})();

import 'bootstrap/dist/css/bootstrap.css';