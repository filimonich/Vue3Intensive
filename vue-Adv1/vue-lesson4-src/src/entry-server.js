import getApp from './app.js';

function getServerApp(){
	let { app } = getApp();
	return app;
}

export default getServerApp;