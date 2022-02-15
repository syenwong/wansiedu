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
const utils = require('./utils');
module.exports = function (config) {
    const isProduction = (config.env === 'production' || config.env === 'publish');
    return {
        loaders: utils.cssLoaders({
            sourceMap: !isProduction,
            usePostCSS: true
        }),
        cssSourceMap: !isProduction,
        cacheBusting: config.dev.cacheBusting,
        transformToRequire: {
            video: ['src', 'poster'],
            source: 'src',
            img: 'src',
            image: 'xlink:href'
        }
    };
};
