module.exports = {
    public: [
        { libraryName: '@hjq/uts' },
        { libraryName: '@hjq/widget' }
    ],
    vue: [
        { libraryName: 'vant', libraryDirectory: 'es', style: true, 'camel2DashComponentName': true }
    ],
    react: [
        { libraryName: 'antd', libraryDirectory: 'lib', style: true, 'camel2DashComponentName': true },
        { libraryName: 'antd-mobile', libraryDirectory: 'lib', style: true, 'camel2DashComponentName': true },
        { libraryName: '@ant-design', libraryDirectory: 'lib', style: true, 'camel2DashComponentName': true }
    ]
};
