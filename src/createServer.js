const config = require('config');
const Koa = require('koa');

const { initializeLogger, getLogger } = require('./core/logging');
const installRest = require('./rest');
const installMiddleware = require('./core/installMiddleware');

const NODE_ENV = config.get('env');
const LOG_LEVEL = config.get('log.level');
const LOG_DISABLED = config.get('log.disabled');

module.exports = async function createServer() {
    initializeLogger({
        level: LOG_LEVEL,
        disabled: LOG_DISABLED,
        defaultMeta: {
            NODE_ENV,
        },
    });

    const app = new Koa();

    installMiddleware(app);

    installRest(app);

    return {
        getApp() {
            return app;
        },

        start() {
            return new Promise((resolve) => {
                app.listen(9000, () => {
                    getLogger().info('🚀 Server listening on http://localhost:9000');
                    resolve();
                });
            });
        },

        async stop() {
            app.removeAllListeners();
            getLogger().info('Goodbye! 👋');
        },
    };
};