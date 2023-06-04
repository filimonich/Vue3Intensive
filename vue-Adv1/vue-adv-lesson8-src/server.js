const path = require('path');
const fs = require('fs');
const express = require('express');
const server = express();
const template = fs.readFileSync('./dist/index.html', 'utf-8');
const { renderToString } = require('@vue/server-renderer');

const bundlePath = './dist/js/server-bundle.js';
let serverBundle = require(bundlePath);
let bundleLastMod = fs.statSync(bundlePath).mtime.toISOString();
let criticalCSS = fs.readFileSync('./dist/css/chunk-critical.css', 'utf-8');

const LRU = require("lru-cache");
const pagesCache = new LRU({ max: 100, maxAge: 30 * 1000 }); // 1 * 1000 * 30

function replaceCriticalCss(page){
	// lastTimeUp, reload criticalCSS -> 29
	return page.replace('<link href="/css/chunk-critical.css" rel="stylesheet">', `<style>${criticalCSS}</style>`)
}

server.use('/css', express.static(path.resolve(__dirname, './dist/css')));
server.use('/js', express.static(path.resolve(__dirname, './dist/js')));
server.use('/img', express.static(path.resolve(__dirname, './dist/img')));
server.use('/favicon.ico', express.static(path.resolve(__dirname, './dist/favicon.ico')));

server.get('*', async function(request, response){
	if(pagesCache.has(request.url)){
		console.log(request.url + ' - get from cache');
		response.end(pagesCache.get(request.url));
		return;
	}

	let nowLastMod = fs.statSync(bundlePath).mtime.toISOString();
	
	if(bundleLastMod !== nowLastMod){
		delete require.cache[path.resolve(bundlePath)];
		serverBundle = require(bundlePath);
		bundleLastMod = nowLastMod;
	}

	let context = { url: request.url, asyncData: null, head: {} };
	
	try{
		let { app, store, router } = await serverBundle(context);
		let noSsr = router.currentRoute.value.matched.some(r => r.meta.auth || r.meta.noSSR);
		let is404 = router.currentRoute.value.matched.some(r => r.meta.is404);

		if(noSsr || is404){
			response.status(is404 ? 404 : 200).end(replaceCriticalCss(template));
		}
		else{
			try{
				let html = await renderToString(app);
				
				let initialSSR = {
					initialState: store.state,
					asyncData: context.asyncData
				};

				let page = template
					.replace('<!--ssr-title-here-->', context.head.title)
					.replace('<!--ssr-app-here-->', html)
					.replace('<!--ssr-state-here-->', `
						<script>
							window.SSR = ${JSON.stringify(initialSSR)};
						</script>
					`);
				page = replaceCriticalCss(page);
				pagesCache.set(request.url, page);
				response.status(router.appIs404 ? 404 : 200).end(page);
			}
			catch(err){
				throw { code: 500, nativeError: e };
			}
		}
	}
	catch(e){
		response.status(500).end('server sleep'); // template
	}
	
});

server.listen(3000);
console.log('start...');