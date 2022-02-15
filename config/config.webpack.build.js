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
const merge = require('webpack-merge');
const webpack = require('webpack');
const configWebpackBase = require('./config.webpack.base');
module.exports = function (config) {
    const buildConfig = {
        output: {
            path: config.build.assetsRoot,
            filename: config.version + '/[name].js',
            chunkFilename: config.version + '/[name].js'
        },
        plugins: [
            new webpack.HashedModuleIdsPlugin(),
            // enable scope hoisting
            new webpack.optimize.ModuleConcatenationPlugin()
        ],
        performance: {
            // false | "error" | "warning" // 不显示性能提示 | 以错误形式提示 | 以警告...
            hints: 'warning',
            // 开发环境设置较大防止警告
            // 根据入口起点的最大体积，控制webpack何时生成性能提示,整数类型,以字节为单位
            maxEntrypointSize: (config.env === 'production' || config.env === 'publish') ? 3000000 : 50000000,
            // 最大单个资源体积，默认250000 (bytes)
            maxAssetSize: (config.env === 'production' || config.env === 'publish') ? 3000000 : 50000000
        }
    };
    if (config.build.assetsPublicPath) {
        buildConfig.output.publicPath = config.build.assetsPublicPath;
    }
    if (config.build.productionGzip) {
        const CompressionWebpackPlugin = require('compression-webpack-plugin');
        buildConfig.plugins.push(
            new CompressionWebpackPlugin({
                filename: '[path].gz[query]',
                algorithm: 'gzip',
                test: new RegExp(
                    '\\.(' +
                    config.build.productionGzipExtensions.join('|') +
                    ')'
                ),
                threshold: 10240,
                minRatio: 0.8
            })
        );
    }
    if (config.build.bundleAnalyzerReport) {
        const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
        buildConfig.plugins.push(new BundleAnalyzerPlugin());
    }
    return merge(configWebpackBase(config), buildConfig);
};
