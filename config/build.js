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
'use strict';
// require('./check-versions')();
const ora = require('ora');
const rm = require('rimraf');
const path = require('path');
const chalk = require('chalk');
const webpack = require('webpack');
const configs = require('./config.index');
const webpackConfigFac = require('./config.webpack.build');
if (configs.length > 0) {
    rm(path.resolve(__dirname, '../unity/'), err => {
        if (err) {
            throw err;
        }
        const pw = function (config) {
            process.env.PROJECT_CLIENT = config.client;
            process.env.FRAMEWORK_TYPE = config.framework = config.framework || 'vue';
            return new Promise((resolve, reject) => {
                const webpackConfig = webpackConfigFac(config);
                webpack(webpackConfig, (err, stats) => {
                    if (err) {
                        reject('Build ' + config.projectName + 'failed with errors.\n');
                        throw err;
                    }
                    process.stdout.write(stats.toString({
                        colors: true,
                        modules: false,
                        children: false, // If you are using ts-loader, setting this to true will make TypeScript errors show up during build.
                        chunks: false,
                        chunkModules: false
                    }) + '\n\n');
                    if (stats.hasErrors()) {
                        reject('Build ' + config.projectName + 'failed with errors.\n');
                        process.exit(1);
                    }
                    resolve('Build ' + config.projectName + ' complete.\n');
                });
            });
        };
        (async (configs) => {
            const rs = [];
            for (const config of configs) {
                try {
                    const r = await pw(config);
                    console.log(chalk.cyan(r));
                    rs.push(config.projectName);
                } catch (e) {
                    console.log(chalk.cyan(e));
                }
            }
            return rs;
        })(configs).then(r => {
            console.log(chalk.green('Build [' + r.join() + '] completed'));
        });
    });
}

