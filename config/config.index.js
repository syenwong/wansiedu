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
'use strict';
const path = require('path');
const fs = require('fs');
const merge = require('webpack-merge');
const chalk = require('chalk');
const argvs = process.argv.slice(2);
const srcPath = './src/';
const commonPath = './common/';
let projectConfigOrigin = [];
try {
    const data = fs.readFileSync(path.resolve(__dirname, '../.projectrc'), 'utf-8');
    const __projectConfigOrigin = (data.split(/[\s,\.]/ig));
    projectConfigOrigin = __projectConfigOrigin.filter((p) => {
        return p.trim().length > 0;
    });
} catch (e) {
    projectConfigOrigin = [];
}
/*
 * get env
 */
const env = argvs[0];
const envObj = (() => {
    const envs = {
        development: { NODE_ENV: '"development"' },
        testing: { NODE_ENV: '"testing"' },
        production: { NODE_ENV: '"production"' },
        publish: { NODE_ENV: '"production"' }
    };
    return envs[env];
})();
/*
 * get projectNames
 */
const projectNames = (() => {
    const argPrjectName = argvs[1] || false;
    const _projectConfigs = projectConfigOrigin;
    const projectNames = [];
    if (argPrjectName && (/^[0-9a-zA-Z\/\\]*$/g).test(argPrjectName)) {
        projectNames.push(argPrjectName);
    } else {
        if (typeof _projectConfigs === 'string') {
            projectNames.push(_projectConfigs);
        } else if (Array.isArray(_projectConfigs)) {
            projectNames.push(..._projectConfigs);
        }
    }
    return projectNames;
})();
/*
 * get projectConfigs
 */
const projectConfigs = (() => {
    let projectConfigs = [];
    const projectPath = function (propath) {
        return path.resolve(__dirname, '../src/' + propath);
    };
    if (projectNames.length > 0) {
        for (const prjectName of projectNames) {
            if (fs.existsSync(projectPath(prjectName))) {
                let project = {};
                const jsonPath = projectPath(prjectName + '/' + 'config.json');
                const jsPath = projectPath(prjectName + '/' + 'config.js');
                project = fs.existsSync(jsonPath) ? require(jsonPath) : (fs.existsSync(jsPath) ? require(jsPath) : {});
                project.projectName = project.projectName || prjectName;
                project.publicProjectName = (function () {
                    const prnamesStr = project.projectName.replace(/[\/\\]/ig, '||');
                    const prnames = prnamesStr.split('||');
                    return prnames[prnames.length - 1];
                })();
                projectConfigs.push(project);
            } else {
                console.log(chalk.red(prjectName + ':不存在该项目目录'));
            }
        }
    } else {
        projectConfigs = null;
    }
    return projectConfigs;
})();
/*
 *
 * */
module.exports = projectConfigs.map((projectConfig) => {
    const version = projectConfig.version || 'assets';
    projectConfig.projectPath = projectConfig.projectPath || '';
    const projectPath = (projectConfig.projectPath && projectConfig.projectPath !== '/' && (projectConfig.projectPath + '/')) || '';
    const assetsPublicPath = (function (env) {
        let result = false;
        switch (env) {
            case 'development':
                result = projectConfig.devPublicPath ? (projectConfig.devPublicPath
                    + (projectConfig.devPublicPath.substr(-1, 1) === '/' ? '' : '/') // 给 devPublicPath末尾补充 /，如果末尾存在/ 则不做处理
                    + projectPath + projectConfig.publicProjectName + '/')
                    : false;
                break;
            case 'testing':
                result = projectConfig.testPublicPath ? (projectConfig.testPublicPath
                    + (projectConfig.testPublicPath.substr(-1, 1) === '/' ? '' : '/') // 给 devPublicPath末尾补充 /，如果末尾存在/ 则不做处理
                    + projectPath + projectConfig.publicProjectName + '/')
                    : false;
                break;
            case 'publish':
                result = 'https://rescdn.hjq.komect.com/' + projectPath + projectConfig.publicProjectName + '/';
                break;
            default:
                result = projectConfig.propPublicPath ?
                    (projectConfig.propPublicPath + (projectConfig.propPublicPath.substr(-1, 1) === '/' ? '' : '/') + projectPath + projectConfig.publicProjectName + '/')
                    : false;
        }
        return result;
    })(env);
    const defaultConfig = {
        dev: {
            assetsPublicPath,
            host: 'localhost', // can be overwritten by process.env.HOST
            port: 8080, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
            autoOpenBrowser: true,
            errorOverlay: true,
            poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-
            // Use Eslint Loader?
            // If true, your code will be linted during bundling and
            // linting errors and warnings will be shown in the console.
            useEslint: false,
            // If true, eslint errors and warnings will also be shown in the error overlay
            // in the browser.
            showEslintErrorsInOverlay: true,
            /**
             * Source Maps
             */
            // https://webpack.js.org/configuration/devtool/#development
            devtool: 'cheap-module-eval-source-map',
            // If you have problems debugging vue-files in devtools,
            // set this to false - it *may* help
            // https://vue-loader.vuejs.org/en/options.html#cachebusting
            cacheBusting: true
        },
        build: {
            // Template for index.html
            index: path.resolve(__dirname, '../unity/' + projectConfig.publicProjectName + 'index.html'),
            // Paths
            assetsRoot: path.resolve(__dirname, '../unity/'
                + projectPath
                + projectConfig.publicProjectName + '/'),
            assetsPublicPath,
            // https://webpack.js.org/configuration/devtool/#production
            devtool: '#source-map',
            // Gzip off by default as many popular static hosts such as
            // Surge or Netlify already gzip all static assets for you.
            // Before setting to `true`, make sure to:
            // npm install --save-dev compression-webpack-plugin
            productionGzip: true,
            productionGzipExtensions: ['js', 'css'],
            // Run the build command with an extra argument to
            // View the bundle analyzer report after build finishes:
            // `npm run build --report`
            // Set to `true` or `false` to always turn it on or off
            bundleAnalyzerReport: projectConfig.bundleAnalyzerReport || process.env.npm_config_report
        },
        client: 'mobile'
    };
    const config = merge(defaultConfig, projectConfig);
    config.srcPath = srcPath;
    config.commonPath = commonPath;
    /*
     代理配置
     */
    const proxyTable = {};
    const proxyConfig = projectConfig.proxy || {};
    for (const p in proxyConfig) {
        if (!Object.hasOwnProperty.call(proxyConfig, p)) {
            continue;
        }
        proxyTable[p] = {
            target: proxyConfig[p],
            host: proxyConfig[p],
            changeOrigin: true,
            secure: false
            //   pathRewrite: {}
        };
    }
    config.dev.proxyTable = proxyTable;
    config.env = env;
    config.envObj = envObj;
    config.version = version;
    return config;
});

