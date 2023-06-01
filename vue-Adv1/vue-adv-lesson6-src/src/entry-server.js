import getApp from './app.js';

async function getServerApp({ url }){
	let { app, router, store } = await getApp();
	await router.push(url);
	// await router.isReady
	return { app, router, store };
}

export default getServerApp;