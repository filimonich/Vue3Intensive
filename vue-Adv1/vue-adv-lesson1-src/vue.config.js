const proxy = {
  "/randomapi": {
    target: "http://faceprog.ru",
    secure: false,
    changeOrigin: true,
  },
};

module.exports = {
  filenameHashing: false,
  productionSourceMap: false,
  configureWebpack: (config) => {
    return {
      devServer: { proxy },
    };
  },
};
