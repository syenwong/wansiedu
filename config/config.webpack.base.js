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
const fs = require('fs');
const path = require('path');
const utils = require('./utils');
const webpack = require('webpack');
const chalk = require('chalk');
const glob = require('glob');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const vueLoaderConfigFac = require('./vue-loader.conf');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
function resolve (dir) {
    return path.join(__dirname, '..', dir);
}
module.exports = function (config) {
    let alias = {};
    const aliasPath = resolve('src/' + config.projectName + '/common/alias.config.js');
    if (fs.existsSync(aliasPath)) {
        alias = require('../src/' + config.projectName + '/common/alias.config') || {};
    }
    const createLintingRule = () => {
        return {
            test: /\.(js|vue|jsx)$/,
            loader: 'eslint-loader',
            enforce: 'pre',
            include: [resolve('dev')], // 指定检查的目录
            options: {
                formatter: require('../.eslintrc.js'),// 指定错误报告的格式规范
                emitWarning: config.dev.showEslintErrorsInOverlay
            }
        };
    };
    const baseConfig = {
        mode: (config.env === 'production' || config.env === 'publish') ? 'production' : 'development',
        entry: {},
        devtool: !(config.env === 'production' || config.env === 'publish') && config.dev.devtool,
        resolve: {
            extensions: ['.js', 'jsx', '.vue', '.json', '.ts', '.tsx'],
            alias: Object.assign({
                'vue$': 'vue/dist/vue.esm.js',
                'ROOT': resolve('./'),
                'LOCAL': resolve('./src/' + config.projectName)
            }, alias)
        },
        module: {
            rules: [
                // ...(config.dev.useEslint ? [createLintingRule()] : []),
                ...(utils.styleLoaders({
                    sourceMap: config.env !== 'production' && config.env !== 'publish',
                    usePostCSS: true
                })),
                {
                    test: /\.txt|md$/,
                    use: 'raw-loader'
                },
                {
                    test: config.framework === 'vue' ? /\.js$/ : /\.js|jsx$/,
                    use: {
                        loader: 'babel-loader'
                    },
                    include: [resolve('common'), resolve('src'), resolve('test'), resolve('node_modules/webpack-dev-server/client')]
                },
                {
                    test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                    loader: 'url-loader',
                    options: {
                        esModule: false,
                        limit: 10000,
                        name: utils.assetsPath('imgs/[name].[ext]?[hash:7]', config),
                        publicPath: utils.assetsPublicPath(config)
                    }
                },
                {
                    test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                    loader: 'url-loader',
                    options: {
                        esModule: false,
                        limit: 10000,
                        name: utils.assetsPath('media/[name].[ext]?[hash:7]', config),
                        publicPath: utils.assetsPublicPath(config)
                    }
                },
                {
                    test: /\.(woff|woff2?|eot|ttf|otf)(\?.*)?$/,
                    loader: 'url-loader',
                    options: {
                        esModule: false,
                        limit: config.env === 'publish' ? 1 : 10000,
                        name: utils.assetsPath('fonts/[name].[ext]?[hash:7]', config),
                        publicPath: utils.assetsPublicPath(config)
                    }
                },
                {
                    test: /\.(htm|html)$/i,
                    loader: 'html-withimg-loader'
                }
            ]
        },
        plugins: [
            new webpack.IgnorePlugin(/\.\/locale/, /moment/),
            new webpack.DefinePlugin({
                'process.env': config.envObj
            }),
            new ProgressBarPlugin({
                format: '  building "' + config.projectName + '" [:bar] ' + chalk.green.bold(':percent') + ' (:elapsed seconds)',
                clear: true
            }),
            new MiniCssExtractPlugin({
                // Options similar to the same options in webpackOptions.output
                // both options are optional
                filename: `${config.version}/[name].css`,
                chunkFilename: `${config.version}/[name].css`,
                ignoreOrder: true
            })
        ],
        optimization: {
            minimizer: [
                new TerserPlugin({
                    cache: true,
                    parallel: true,
                    /**
                     *  sourceMap 和 devtool: 'inline-source-map', 冲突
                     */
                    sourceMap: false, // set to true if you want JS source maps,
                    /**
                     *  extractComments 导出备注
                     */
                    extractComments: false
                }),
                new OptimizeCSSAssetsPlugin({})
            ],
            splitChunks: {
                chunks: 'all',
                minSize: 30000,
                maxSize: 0,
                minChunks: 1,
                maxAsyncRequests: 5,
                maxInitialRequests: 3,
                automaticNameDelimiter: '~',
                name: false,
                cacheGroups: {
                    vendor: {
                        test: /[\\/]node_modules[\\/]/,
                        chunks: 'all',
                        name: 'vendor',
                        priority: 10, // 优先
                        enforce: true
                        // chunks: 'initial',
                        // minChunks: 2,
                        // maxInitialRequests: 5,
                        // minSize: 5000000
                    },
                    common: {
                        test: /[\\/]common[\\/]|[\\/]utils[\\/]/,
                        chunks: 'all',
                        name: 'common',
                        priority: 10, // 优先
                        enforce: true
                        // chunks: 'initial',
                        // minChunks: 2,
                        // maxInitialRequests: 5,
                        // minSize: 5000000
                    }
                }
            }
        },
        node: {
            // prevent webpack from injecting useless setImmediate polyfill because Vue
            // source contains it (although only uses it if it's native).
            setImmediate: false,
            // prevent webpack from injecting mocks to Node native modules
            // that does not make sense for the client
            dgram: 'empty',
            fs: 'empty',
            net: 'empty',
            tls: 'empty',
            child_process: 'empty'
        }
    };
    if (config.framework === 'vue') {
        baseConfig.module.rules.push({
            test: /\.vue$/,
            loader: 'vue-loader',
            options: vueLoaderConfigFac(config)
        });
        baseConfig.plugins.push(new VueLoaderPlugin());
    }
    // 遍历src文件，生成入口list;
    function getEntries () {
        const cwd = resolve('/src/' + config.projectName);
        const options = {
            cwd
        };
        let rootJs = 'index';
        let pages = 'pages';
        if (config.pages) {
            pages = config.pages.length > 1 ? `{${config.pages.join(',')}}` : config.pages[0];
        }
        if (config.rootHtml) {
            if (typeof config.rootHtml === 'string') {
                rootJs = config.rootHtml;
            } else if (Array.isArray(config.rootHtml)) {
                rootJs = `{${config.rootHtml.join(',')}}`;
            }
        }
        const files_pages = glob.sync(pages + '/**/index.js', options);
        const files_root = glob.sync(rootJs + '.js', options);
        const files = [...files_root, ...files_pages];
        const _entries = [];
        let entry;
        let dirname;
        let basename;
        for (let i = 0; i < files.length; i++) {
            entry = files[i];
            dirname = path.dirname(entry);
            basename = path.basename(entry, '.js');
            const entryContent = {
                content: [resolve('common/index.js')],
                pathname: (dirname === '.' ? '' : dirname + '/') + basename,
                ejs: (glob.sync(dirname + '/' + basename + '.{ejs,html}', options))[0]
            };
            if (config.client === 'mobile') {
                entryContent.content.unshift(resolve('common/clientMobile.js'));
            }
            if (fs.existsSync(`${cwd}/common/index.js`)) {
                entryContent.content.push(`${cwd}/common/index.js`);
            }
            entryContent.content.push(`${cwd}/${entry}`);
            _entries.push(entryContent);
        }
        return _entries;
    }
    // 获取入口
    const entry = getEntries();
    entry.forEach((e) => {
        if (e) {
            baseConfig.entry[e.pathname] = e.content;
        }
        baseConfig.plugins.push(new HtmlWebpackPlugin({
            title: config.title || '',
            publicPath: 'auto',
            /* config */
            filename: `${e.pathname}.html`,
            template: e.ejs ? resolve('src/' + config.projectName + '/' + e.ejs) : `${config.commonPath}/index.ejs`,
            inject: true,
            hash: true,//给生成的 js 文件一个独特的 hash 值 <script type=text/javascript src=bundle.js?22b9692e22e7be37b57e></script>
            showErrors: true,//webpack 编译出现错误
            minify: {//对 html 文件进行压缩，minify 的属性值是一个压缩选项或者 false 。默认值为false, 不对生成的 html 文件进行压缩
                removeComments: true, // 去除注释
                collapseWhitespace: true //是否去除空格
            },
            chunks: ['common', 'vendor', e.pathname], // 只注入当前页面的静态资源
            chunksSortMode: 'auto'
        }));
    });
    // copy custom static assets
    const copyDirectories = [];
    if (Array.isArray(config.copyDirectories) && config.copyDirectories.length > 0) {
        config.copyDirectories.forEach((p) => {
            copyDirectories.push({
                from: path.resolve(__dirname, '../src/' + config.projectName + '/' + p),
                to: p
            });
        });
    }
    if (copyDirectories.length > 0) {
        baseConfig.plugins.push(new CopyWebpackPlugin({ patterns: copyDirectories }));
    }
    return baseConfig;
};

