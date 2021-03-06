module.exports = {
    'extends': [
        'eslint:recommended'
    ],
    'plugins': [],
    'parserOptions': {
        'parser': 'babel-eslint',
        //npm install babel-eslint --save-dev
        'ecmaVersion': 6,
        //设置为 3， 5 (默认)， 6、7 或 8 指定你想要使用的 ECMAScript 版本。你也可以指定为 2015（同 6），2016（同 7），或 2017（同 8）使用年份命名
        'sourceType': 'module',
        //设置为 "script" (默认) 或 "module"（如果你的代码是 ECMAScript 模块)。
        'ecmaFeatures': {
            //这是个对象，表示你想使用的额外的语言特性
            'globalReturn': true,
            //允许在全局作用域下使用 return 语句
            'impliedStrict': true,
            //启用全局 strict mode (如果 ecmaVersion 是 5 或更高)
            'jsx': false
            // 启用 JSX
        }
    },
    'env': {
        //指定环境,browser、node、commonjs、shared-node-browser……
        'es6': true,
        // 支持es6全局变量
        'browser': true,
        // browser 全局变量。
        'node': true
        //Node.js 全局变量和 Node.js 作用域。
    },
    //*** 开发人员根据项目自定义
    'globals': {
        //使用 globals 指出你要使用的全局变量
        'var1': true,
        //允许变量被重写
        'var2': false
        //不允许被重写
    },
    'rules': {
        'unicode-bom': 0,
        // 要求或禁止 Unicode BOM
        'indent': [
            1,
            4,
            {
                'SwitchCase': 1
            }
        ],
        //缩进风格，4个空格
        'linebreak-style': [
            0,
            'windows'
        ],
        //关闭换行风格
        'eol-last': [
            'error',
            'always'
        ],
        // 文件末尾强制换行
        'max-len': [
            1,
            500
        ],
        //长度1-500
        'semi': [
            2,
            'always'
        ],
        // 要求或禁止使用分号而不是 ASI（这个才是控制行尾部分号的，）
        'curly': [
            2,
            'all'
        ],
        // 强制所有控制语句使用一致的括号风格
        'no-use-before-define': [
            'error',
            {
                'functions': true,
                'classes': true
            }
        ],
        // 不允许在变量定义之前使用它们
        'no-loop-func': 'error',
        // 禁止在循环中出现 function 声明和表达式
        'radix': 'error',
        // 强制在parseInt()使用基数参数
        'quotes': [
            1,
            'single',
            'avoid-escape'
        ],
        // 强制使用一致的反勾号、双引号或单引号
        'no-multi-str': 'error',
        // 禁止使用多行字符串，在 JavaScript 中，可以在新行之前使用斜线创建多行字符串
        'no-new-wrappers': 2,
        // 禁止对 String，Number 和 Boolean 使用 new 操作符
        'no-new-object': 'error',
        // 禁止使用 Object 的构造函数
        'no-new-func': 1,
        // 禁止对 Function 对象使用 new 操作符
        'no-array-constructor': 2,
        // 禁止使用 Array 构造函数
        'guard-for-in': 1,
        // 要求 for-in 循环中有一个 if 语句
        'no-prototype-builtins': 2,
        // 禁止直接使用 Object.prototypes 的内置属性
        'no-extend-native': 2,
        // 禁止扩展原生类型
        'no-proto': 2,
        // 禁用 __proto__ 属性
        'no-eval': 2,
        // 禁用 eval()
        'no-with': 2,
        // 禁用 with 语句
        'no-useless-escape': 'off',
        //覆盖eslint:recommended中的规则，避免过多的不合理检查结果
        'comma-dangle': 'error',
        //要求对象或数组成员的最后不能添加逗号
        'space-infix-ops': [
            'error',
            {
                'int32Hint': true
            }
        ],
        //中间的运算符左右要添加空格
        'space-before-function-paren': [
            'error',
            'always'
        ],
        //方法括号前统一加空格，增加代码可读性
        'block-spacing': [
            'error',
            'always'
        ],
        //单行内间距一致，增加代码可读性
        'space-before-blocks': [
            'error',
            'always'
        ],
        //不是单独一行的{}前添加空格，增加代码可读性
        'keyword-spacing': [
            'error',
            {
                'before': true,
                'after': true
            }
        ],
        //关键字左右添加空格，增加代码可读性
        'spaced-comment': [
            'error',
            'always'
        ],
        //注释符号和注释内容直接添加一个空格
        'no-multiple-empty-lines': [
            'error',
            {
                'max': 2,
                'maxEOF': 1,
                'maxBOF': 0
            }
        ],
        //文档中连续空行不得超过2行，文件开头不能有空行，文件结尾最多一个空行
        'operator-linebreak': [
            'error',
            'before'
        ],
        //运算符在换行时放在下一行的开始
        'padded-blocks': [
            'error',
            'never'
        ],
        //在代码块内开始和结束无需添加空格，使代码更简洁
        'jsx-quotes': [
            'error',
            'prefer-single'
        ],
        //jsx属性推荐使用单引号，与全局规则统一
        'arrow-spacing': [
            'error',
            {
                'before': true,
                'after': true
            }
        ],
        //箭头符号前后要有空格，增加代码可读性
        'no-confusing-arrow': [
            'error',
            {
                'allowParens': true
            }
        ],
        //箭头函数不能与条件表达式混用，容易造成代码意图不明确，不便于维护
        'no-useless-constructor': 'error',
        //不需要编写无用的构造方法
        'generator-star-spacing': [
            'error',
            'both'
        ],
        //使用构造器函数时，* 号左右添加空格，增强代码可读性
        'no-duplicate-imports': [
            'error',
            {
                'includeExports': true
            }
        ],
        //避免模块重复引入和导出
        'no-useless-computed-key': 'error',
        //避免使用无必要的计算属性key
        'no-useless-rename': 'error',
        //避免无必要的重命名
        'no-var': 'warn',
        //建议逐渐使用let和const替代var声明变量和常量
        'object-shorthand': 'warn',
        //object属性声明尽量简洁明了，能简化的代码推荐使用简写
        'prefer-arrow-callback': 'warn',
        //建议回调函数尽量使用箭头函数声明
        'prefer-const': 'warn',
        //声明后不做改变的变量尽量使用const声明为常量
        'prefer-spread': 'warn',
        //建议使用Spread特性替换只为传递数组参数时调用apply
        'prefer-template': 'warn',
        //建议使用template替代字符串拼接
        'rest-spread-spacing': 'error',
        //rest和spread符号后不要添加空格
        'symbol-description': 'error',
        //方在创建Symbol类型时要添加描述
        'template-curly-spacing': [
            'error',
            'never'
        ],
        //template摸板中${符号后和}符号前不添加空格
        'yield-star-spacing': [
            'error',
            'both'
        ]
    }
};
