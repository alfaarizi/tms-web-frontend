const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(
        process.env.REACT_APP_API_BASEURL,
        createProxyMiddleware({
            target: process.env.REACT_DEV_PROXY,
            changeOrigin: true,
        })
    );
};
