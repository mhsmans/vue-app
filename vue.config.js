module.exports = {
  css: {
    loaderOptions: {
      sass: {
        data: `@import "@/styles/_global.scss";`
      }
    }
  },
  configureWebpack: {
    devtool: 'source-map'
  }
};
