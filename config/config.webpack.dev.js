/**
 * File Created by wangshuyan at 2019/7/2.
 * Copyright 2018 CMCC Corporation Limited. * All rights reserved.
 *
 * This software is the confidential and proprietary information of
 * ZYHY Company. ("Confidential Information"). You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license. *
 *
 * @Desc
 * @author wangshuyan
 * @date 2019/7/2
 * @version */
const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const configWebpackBase = require('./config.webpack.base');
const config = require('./config.index')[0];
const devConfig = {
    output: {
        path: config.dev.assetsRoot,
        filename: config.version + '/[name].js'
        // publicPath: config.dev.assetsPublicPath || ''
    },
    plugins: [
        // new webpack.HotModuleReplacementPlugin(),
        // new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
        new webpack.NoEmitOnErrorsPlugin()
    ],
    performance: {
        // false | "error" | "warning" // 不显示性能提示 | 以错误形式提示 | 以警告...
        hints: 'warning',
        // 开发环境设置较大防止警告
        // 根据入口起点的最大体积，控制webpack何时生成性能提示,整数类型,以字节为单位
        maxEntrypointSize: 30000000,
        // 最大单个资源体积，默认250000 (bytes)
        maxAssetSize: 30000000
    }
};
if (config.dev.assetsPublicPath) {
    devConfig.output.publicPath = config.dev.assetsPublicPath;
}
module.exports = config ? merge(configWebpackBase(config), devConfig) : null;
