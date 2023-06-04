const isServer = process.argv.includes('--server');
const webpackNodeExternals = require('webpack-node-externals');

let platformChainWebpack = isServer ? 
	config => {
		config.plugins.delete('html');
		config.plugins.delete('preload');
		config.plugins.delete('prefetch');
	} 
	:
	config => {
		config.plugins.delete('preload');

		config.plugin('html').tap(args => {
			args[0].minify = false;
			let nativeTP = args[0].templateParameters;

			args[0].templateParameters = function(compilation, assets, pluginOptions){
				let res = nativeTP(compilation, assets, pluginOptions);
				
				compilation.hooks.htmlWebpackPluginAlterAssetTags.tap('inject-styles-in-body', function(pluginArgs) {
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