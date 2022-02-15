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
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
exports.assetsPath = function (_path, config) {
    return path.posix.join(config.version, _path);
};
exports.assetsPublicPath = function (config) {
    const customFilesPath = config.filesHost || {};
    const publicPath = {
        publish: 'https://rescdn.hjq.komect.com/' + config.projectPath + '/' + config.publicProjectName + '/',
        production: (customFilesPath.production || 'https://base.hjq.komect.com/') + config.projectPath + '/' + config.publicProjectName + '/',
        testing: (customFilesPath.testing || 'https://test.hsop.komect.com:10443/') + config.projectPath + '/' + config.publicProjectName + '/',
        development: customFilesPath.development || './'
    };
    return publicPath[config.env];
};
exports.cssLoaders = function (options, config) {
    options = options || {};
    const cssLoader = {
        loader: 'css-loader',
        options: {
            sourceMap: options.sourceMap,
            modules: false
        }
    };
    const postcssLoader = {
        loader: 'postcss-loader',
        options: {
            plugins: [
                require('postcss-import')(),
                require('postcss-url')(),
                require('autoprefixer')({
                    overrideBrowserslist: [
                        'iOS >=6',
                        'Android > 4',
                        'Safari >= 6',
                        'last 3 iOS versions',
                        'last 3 Safari versions',
                        'last 10 Chrome versions',
                        'last 5 Firefox versions',
                        'last 2 versions'
                        //'last 10 versions', // 所有主流浏览器最近10版本用
                    ],
                    grid: true,
                    remove: false
                })
            ]
        }
    };
    if (process.env.PROJECT_CLIENT === 'mobile') {
        postcssLoader.options.plugins.push(require('postcss-px2rem')({ 'remUnit': 37.5 }));
    }
    // generate loader string to be used with extract text plugin
    function generateLoaders (loader, loaderOptions) {
        let uses = [{
            loader: MiniCssExtractPlugin.loader,
            options: Object.assign({}, loaderOptions, {
                sourceMap: options.sourceMap,
                minimize: true
            })
        }, cssLoader, postcssLoader];
        if (loader) {
            uses.push({
                loader: loader + '-loader',
                options: Object.assign({}, loaderOptions, {
                    sourceMap: options.sourceMap
                })
            });
        }
        //  console.log(uses);
        return uses;
    }
    return {
        css: generateLoaders(),
        postcss: generateLoaders(),
        less: generateLoaders('less', { lessOptions: { javascriptEnabled: true } })
    };
};
// Generate loaders for standalone style files (outside of .vue)
exports.styleLoaders = function (options, config) {
    const rules = [];
    const loaders = exports.cssLoaders(options, config);
    for (const extension in loaders) {
        const loader = loaders[extension];
        rules.push({
            test: new RegExp('\\.' + extension + '$'),
            use: loader
        });
    }
    return rules;
};

