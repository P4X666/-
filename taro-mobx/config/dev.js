module.exports = {
  env: {
    NODE_ENV: '"development"'
  },
  defineConstants: {
  },
  mini: {},
  h5: {
    publicPath: '/',
    devServer: {
      host: 'localhost',
      port: 9001,
      proxy: {
        '/': {
          target: 'http://localhost:3000 ',
          changeOrigin: true,
        }
      }
    }
  }
};
