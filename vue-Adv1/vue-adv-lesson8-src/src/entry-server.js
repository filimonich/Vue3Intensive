import getApp from './app.js';

async function getServerApp(context){
	let { app, router, store } = await getApp(context);
	await router.push(context.url);
	await router.isReady();
	return { app, router, store };
}

export default getServerApp;