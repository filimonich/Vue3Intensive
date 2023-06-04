// Определение переменной isServer как true, если аргумент командной строки содержит '--server'
const isServer = process.argv.includes('--server');
// Импорт модуля webpack-node-externals
const webpackNodeExternals = require('webpack-node-externals');

// Определение функции platformChainWebpack в зависимости от значения переменной isServer
// Если isServer равно true, то platformChainWebpack будет функцией, 
// которая удаляет плагины 'html', 'preload' и 'prefetch' из конфигурации webpack
let platformChainWebpack = isServer ? 
	config => {
		config.plugins.delete('html');
		config.plugins.delete('preload');
		config.plugins.delete('prefetch');
	} 
	:
	// Если isServer равно false, то platformChainWebpack будет функцией, 
	// которая удаляет плагин 'preload' и изменяет плагин 'html'
	config => {
		config.plugins.delete('preload');

		config.plugin('html').tap(args => {
			// Отключение минификации HTML
			args[0].minify = false;
			// Определение переменной nativeTP как свойства templateParameters плагина 'html'
			let nativeTP = args[0].templateParameters;

			// Проверка, определено ли свойство templateParameters
			if (typeof nativeTP === 'undefined') {
				// Если свойство templateParameters не определено, то присваиваем nativeTP пустую функцию, которая возвращает пустой объект
				nativeTP = () => ({});
				// Определение новой функции templateParameters для плагина 'html'
				args[0].templateParameters = function(compilation, assets, pluginOptions){
					// Вызов функции nativeTP с передачей аргументов compilation, assets и pluginOptions
					let res = nativeTP(compilation, assets, pluginOptions);

					// Добавление обработчика события htmlWebpackPluginAlterAssetTags к хукам компиляции
					compilation.hooks.htmlWebpackPluginAlterAssetTags.tap('inject-styles-in-body', function(pluginArgs) {
						// Определение переменных head и body из аргументов плагина
						let { head, body } = pluginArgs;
						
						head.filter(
							asset => asset.tagName === 'link' && 
							asset.attributes && 
							asset.attributes.rel === 'stylesheet' &&
							asset.attributes.href.indexOf('chunk-critical') === -1
							).forEach(asset => {
								head.splice(head.indexOf(asset), 1);
								body.push(asset);
							});
							
							body.sort((a, b) => {
								if(a.tagName === 'link' && b.tagName === 'script'){
									return -1;
								}
								else if(a.tagName === 'script' && b.tagName === 'link'){
									return 1;
								}
								
								return 0;
							});
						});
						
						return res;
					}
				}

			return args;
		});
	}

function chainWebpack(config){
	config.plugin('define').tap(options => {
		options[0]['process.isClient'] = !isServer;
		options[0]['process.isServer'] = isServer;
		return options;
	});

	platformChainWebpack(config);
}

let configureWebpack = isServer ? 
	{
		target: 'node',
		entry: { app: './src/entry-server.js' },
		output: {
			libraryTarget: 'commonjs2',
			libraryExport: 'default',
			filename: 'js/server-bundle.js'
		},
		optimization: {
			splitChunks: false
		},
		externals: [webpackNodeExternals()]
	}
	:
	{
		entry: { app: './src/entry-client.js' },
		optimization: {
			splitChunks: {
				cacheGroups: {
					critical: {
						name: 'chunk-critical',
						test: /critical.css$/,
						priority: 0,
						chunks: 'all',
						enforce: true
					}
				}
			}
		}
	}

module.exports = {
	filenameHashing: false,
	productionSourceMap: false,
	chainWebpack,
	configureWebpack
}