const isServer = process.argv.includes("--server");
const webpackNodeExternals = require("webpack-node-externals");

let platformChainWebpack = isServer
  ? (config) => {
      config.plugins.delete("html");
      config.plugins.delete("preload");
      config.plugins.delete("prefetch");
    }
  : (config) => {
      config.plugin("html").tap((args) => {
        args[0].minify = false;
        return args;
      });
    };

function chainWebpack(config) {
  config.plugin("define").tap((options) => {
    options[0]["process.isClient"] = !isServer;
    options[0]["process.isServer"] = isServer;
    return options;
  });

  platformChainWebpack(config);
}

let configureWebpack = isServer
  ? {
      target: "node",
      entry: { app: "./src/entry-server.js" },
      output: {
        libraryTarget: "commonjs2",
        libraryExport: "default",
        filename: "js/server-bundle.js",
      },
      optimization: {
        splitChunks: false,
      },
      externals: [webpackNodeExternals()],
    }
  : {
      entry: { app: "./src/entry-client.js" },
    };

module.exports = {
  filenameHashing: false,
  productionSourceMap: false,
  chainWebpack,
  configureWebpack,
};
