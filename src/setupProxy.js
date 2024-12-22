const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/Api',
    createProxyMiddleware({
      target: 'https://pruebareactjs.test-class.com',
      changeOrigin: true,
      secure: false,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    })
  );
}; 