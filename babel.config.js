const babelPluginsImportConfig = require('./config/babelLibraryConfig.js');
const env = process.env.FRAMEWORK_TYPE;
const loose = false;//是否开启宽松模式。(不严格遵循ES6的语义，而采取更符合我们平常编写代码时的习惯去编译代码)。
const babelConfig = {
    vue: {
        'plugins': [
            '@babel/plugin-transform-modules-umd',
            [
                '@babel/plugin-proposal-decorators',
                {
                    'legacy': true
                }
            ],
            [
                '@babel/plugin-proposal-class-properties',
                {
                    'loose': loose
                }
            ],
            [
                '@babel/plugin-transform-runtime',
                {
                    'corejs': 2
                }
            ],
            '@babel/plugin-transform-async-to-generator',
            'transform-vue-jsx'
        ],
        'presets': [
            '@babel/preset-react',
            [
                '@babel/preset-env',
                {
                    'useBuiltIns': 'usage',
                    'corejs': 2
                }
            ]
        ]
    },
    react: {
        'plugins': [
            '@babel/plugin-transform-modules-umd',
            [
                '@babel/plugin-proposal-decorators',
                {
                    'legacy': true
                }
            ],
            [
                '@babel/plugin-proposal-class-properties',
                {
                    'loose': loose
                }
            ],
            [
                '@babel/plugin-transform-runtime',
                {
                    'corejs': 2
                }
            ],
            '@babel/plugin-transform-async-to-generator',
            '@babel/plugin-transform-modules-commonjs'
        ],
        'presets': [
            '@babel/preset-react',
            [
                '@babel/preset-env',
                {
                    'useBuiltIns': 'usage',
                    'corejs': 2
                }
            ]
        ]
    }
};
const defaultImportConfig = {
    'libraryDirectory': 'lib',
    'style': false,
    'camel2DashComponentName': false
};
const coustomConfigs = [...babelPluginsImportConfig.public, ...babelPluginsImportConfig[env]];
coustomConfigs.forEach(c => {
    const importConfig = ['import'];
    importConfig.push(Object.assign({}, defaultImportConfig, c), c.libraryName);
    babelConfig[env].plugins.unshift(importConfig);
});
module.exports = (API) => {
    API.cache(true);
    return babelConfig[env];
};
