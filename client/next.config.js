/* eslint-disable */
const withLess = require('@zeit/next-less')

module.exports = withLess({
    lessLoaderOptions: {
        javascriptEnabled: true,
    },
    webpack: (config, { isServer }) => {
        const origConfigs = {
            ...config
        }
        if (isServer) {
            const antStyles = /antd\/.*?\/style.*?/
            const origExternals = [...config.externals]
            origConfigs.externals = [
                (context, request, callback) => {
                    if (request.match(antStyles)) return callback()
                    if (typeof origExternals[0] === 'function') {
                        origExternals[0](context, request, callback)
                    } else {
                        callback()
                    }
                },
                ...(typeof origExternals[0] === 'function' ? [] : origExternals),
            ]

            origConfigs.module.rules.unshift({
                test: antStyles,
                use: 'null-loader',
            })
            // FROM - THERYCC config
            origConfigs.module.rules = config.module.rules.map(rule => {
                if (rule.loader === 'babel-loader') {
                    rule.options.cacheDirectory = false
                }
                return rule
            })
        }
        return origConfigs;
    },
})