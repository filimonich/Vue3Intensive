const path = require('path');
const fs = require('fs');
const express = require('express');
const server = express();
const template = fs.readFileSync('./dist/index.html', 'utf-8');
const { renderToString } = require('@vue/server-renderer');
const serverBundle = require('./dist/js/server-bundle.js');

server.use('/css', express.static(path.resolve(__dirname, './dist/css')));
server.use('/js', express.static(path.resolve(__dirname, './dist/js')));
server.use('/img', express.static(path.resolve(__dirname, './dist/img')));
server.use('/favicon.ico', express.static(path.resolve(__dirname, './dist/favicon.ico')));

server.get('*', function(request, response){
	let app = serverBundle();
	
	renderToString(app).then(
		html => {
			let page = template.replace('<!--ssr-here-->', html);
			response.end(page);
		},
		err => {
			console.log('err', err);
			response.end('error');
		}
	)
	// template.replace('<div id="app"></div>', hmtl)
	
});

server.listen(3000);
console.log('start...');