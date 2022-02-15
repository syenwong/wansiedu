
## src 业务结构说明
**2020-08 月划分**


about 和家亲软文相关

user  “我家” 及用户账户信息相关                -- 产品经理家燕

exhibition  "推荐"、第三方相关               --  王思达

networkHall  网关、连接、宽带、设备、互动          -- 费硕成 肖夏

discover "发现"、商城、短视频、直播              - 谭婷婷、胡承文

division 分省、渠道相关                        -- 肖夏 
 
 
 
## 文件结构说明

common 项目相关公共文件(全局)

config: webpack配置文件

dev：开发目录

--------common 项目相关公共文件

------- src  开发目录群

mock:接口调试

.projectrc 批量处理项目的汇总文件


## config.json 属性说明

* projectPath 文件第一路径，默认根目录
* version 版本号（实际为页面资源内容文件夹）。默认assets
* proxy 接口代理
* copyDirectories 需要直接拷贝的文件夹，注意，该文件夹与资源版本号文件夹并行
* propPublicPath  打包publicpath
* devPublicPath
* testPublicPath
* bundleAnalyzerReport   打包内容分析报告
* dev.devtool /build.devtool
* client  (string:pc/mobile)  该选项主要是决定是否使用postcss-px2rem插件机型px对rem的转换，默认mobile
* filesHost:{production，testing，development}  图片、影音媒体、字体文件打包路径，目前不推荐使用本地图片，请尽量上传到src服务端引用使用
* framework （string:vue/react） 脚手架类型：vue还是react
 
## npm 命令说明

1. 建立 dev/src/projectname 后，无需在config.json中填写projectname，脚手架会自动识别文件夹名称，打包后，也与开发文件夹对应，即  dev/src/projectname ==> unity/projectPath/projectname

2. 本地开发 直接运行 npm run dev projectname

3. 测试包  npm run test projectname

4. 上线包  npm run huild projectname

5.mock本地服务器 npm run mock


