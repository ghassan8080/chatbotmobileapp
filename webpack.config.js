const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
    const config = await createExpoWebpackConfigAsync(env, argv);
    // Proxy webhook requests to the n8n server

    if (config.devServer) {
        config.devServer.proxy = {
            '/webhook': {
                target: 'https://n8n-n8n.17m6co.easypanel.host/webhook',
                changeOrigin: true,
                secure: false,
            },
        };
    }

    config.resolve.fallback = {
        ...config.resolve.fallback,
        crypto: false,
    };

    return config;
};
