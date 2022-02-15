/**
 * File Created by wangshuyan at 2019/7/1.
 * Copyright 2018 CMCC Corporation Limited. * All rights reserved.
 *
 * This software is the confidential and proprietary information of
 * ZYHY Company. ("Confidential Information"). You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license. *
 *
 * @Desc
 * @author wangshuyan
 * @date 2019/7/1
 * @version */
const chalk = require('chalk');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const portfinder = require('portfinder');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const config = require('./config.index')[0];
const webpackConfig = require('./config.webpack.dev.js');
const preCongfig = new Promise((resolve, reject) => {
    if (config && webpackConfig) {
        process.env.PROJECT_CLIENT = config.client;
        process.env.FRAMEWORK_TYPE = config.framework = config.framework || 'vue';
        const devOptions = {
            clientLogLevel: 'error',
            contentBase: false,
            open: config.dev.autoOpenBrowser,
            hot: true,
            inline: true,
            quiet: true,//当启用该配置，除了初始化信息会被写到console中，其他任何信息都不会被写进去。errors和warnings也不会被写到console中。
            noInfo: true, // 启用noInfo，类似webpack bundle启动或保存的信息将会被隐藏，Errors和warnings仍会被显示。
            compress: true,//是否启用gzip压缩
            proxy: config.dev.proxyTable,
            // 在浏览器上全屏显示编译的errors或warnings。
            overlay: config.dev.errorOverlay
                ? { warnings: false, errors: true }
                : false,
            headers: config.dev.headers,
            // historyApiFallback: {
            //     rewrites: [
            //         { from: /.*/, to: path.posix.join(config.dev.assetsPublicPath, 'index.html') }
            //     ]
            // },
            stats: 'errors-only',//stats提供了很多细力度的对日志信息的控制。可以详细指定希望打印的信息。
            watchOptions: {
                aggregateTimeout: 600,
                ignored: ['node_modules'],
                poll: 2000
            }
        };
        portfinder.basePort = process.env.PORT || config.dev.port;
        portfinder.getPort((err, port) => {
            if (err) {
                reject(err);
            } else {
                process.env.PORT = port;// publish the new Port, necessary for e2e tests
                devOptions.port = port; // add port to server config
                webpackConfig.plugins.push(new FriendlyErrorsPlugin({// Add FriendlyErrorsPlugin
                    compilationSuccessInfo: {
                        messages: [`Your application is running here: ${config.dev.host}:${port}`]
                    },
                    onErrors: (severity, errors) => {
                    },
                    clearConsole: true
                }));
                resolve({ webpackConfig, devOptions });
            }
        });
    } else {
        reject(chalk.red('config error:配置信息错误'));
    }
});
preCongfig.then((res) => {
    const server = new WebpackDevServer(webpack(res.webpackConfig), res.devOptions);
    server.listen(res.devOptions.port, config.dev.host);
}).catch((e) => {
    console.log(e);
});
