/* eslint-disable */
const withLess = require('@zeit/next-less')
const lessToJS = require('less-vars-to-js')
const fs = require('fs')
const path = require('path')

// // Where your antd-custom.less file lives
// const themeVariables = lessToJS(
//     fs.readFileSync(path.resolve(__dirname, './public/assets/antd-custom.less'), 'utf8')
// )

module.exports = withLess({
    lessLoaderOptions: {
        javascriptEnabled: true,
        // modifyVars: themeVariables, // make your antd custom effective
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

            // For module resolution
            // origConfigs.resolve.alias['~'] = path.join(path.resolve(__dirname), 'src');
        }
        return origConfigs;
    },
})