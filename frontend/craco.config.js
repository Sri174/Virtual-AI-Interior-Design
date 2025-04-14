module.exports = {
    webpack: {
      configure: (webpackConfig) => {
        webpackConfig.devtool = false; // Disable source maps
        return webpackConfig;
      },
    },
  };
  