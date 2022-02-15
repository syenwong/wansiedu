/**
 * @Desc
 * @author hufangqin
 * @date 2021/11/10
 * @version */

const data1 = {
    monthSpeedAvg  : '345',
    monthTotal	     : '120',
    userCityRank  : '666',
    citySpeedTotal  : '1823444',
    nickname         :'hff',
    headImg          :'https://test.hsop.komect.com:10443/public/headImg/2021/01/13/224510013567291610530018808.JPEG',
    userSpeedList  :
         [
             {
                 nickname         :'hff',
                 headImg          :'https://test.hsop.komect.com:10443/public/headImg/2021/01/13/224510013567291610530018808.JPEG',
                 provName         :'浙江省',
                 cityName         :'杭州市',
                 citySpeedTotal   :'243',
                 lon	          :'120.21201',
                 lat              :'30.2084'
             },

             {
                 nickname         :'hff',
                 headImg          :'',
                 provName         :'北京',
                 cityName         :'北京',
                 citySpeedTotal   :'22',
                 lon	          :'116.397128',
                 lat              :'39.916527'
             },
             {
                 nickname         :'hff',
                 headImg          :'',
                 provName         :'上海',
                 cityName         :'上海',
                 citySpeedTotal   :'20',
                 lon	          :'121.48941',
                 lat              :'31.40527'
             },
             {
                 nickname         :'hff',
                 headImg          :'',
                 provName         :'四川',
                 cityName         :'成都',
                 citySpeedTotal   :'10',
                 lon	          :'104.10194',
                 lat              :'30.65984'
             }
         ],
    proSpeedCountRanks: [
        {
            "speedCount": 889,
            "provName": "北京",
            "provCode": "32"
        },
        {
            "speedCount": 753,
            "provName": "天津",
            "provCode": "33"
        },
        {
            "speedCount": 1666,
            "provName": "河北",
            "provCode": "34"
        },
        {
            "speedCount": 1725,
            "provName": "山西",
            "provCode": "35"
        },
        {
            "speedCount": 1232,
            "provName": "内蒙古",
            "provCode": "36"
        },
        {
            "speedCount": 1082,
            "provName": "辽宁",
            "provCode": "37"
        },
        {
            "speedCount": 52,
            "provName": "吉林",
            "provCode": "38"
        },
        {
            "speedCount": 1024,
            "provName": "黑龙江",
            "provCode": "39"
        },
        {
            "speedCount": 257,
            "provName": "上海",
            "provCode": "40"
        },
        {
            "speedCount": 1666,
            "provName": "江苏",
            "provCode": "41"
        },
        {
            "speedCount": 373,
            "provName": "浙江",
            "provCode": "42"
        },
        {
            "speedCount": 1900,
            "provName": "安徽",
            "provCode": "43"
        },
        {
            "speedCount": 628,
            "provName": "福建",
            "provCode": "44"
        },
        {
            "speedCount": 1281,
            "provName": "江西",
            "provCode": "45"
        },
        {
            "speedCount": 299,
            "provName": "山东",
            "provCode": "46"
        },
        {
            "speedCount": 1570,
            "provName": "河南",
            "provCode": "47"
        },
        {
            "speedCount": 1616,
            "provName": "湖北",
            "provCode": "48"
        },
        {
            "speedCount": 56,
            "provName": "湖南",
            "provCode": "49"
        },
        {
            "speedCount": 1214,
            "provName": "广东",
            "provCode": "50"
        },
        {
            "speedCount": 1891,
            "provName": "海南",
            "provCode": "51"
        },
        {
            "speedCount": 1571,
            "provName": "广西",
            "provCode": "52"
        },
        {
            "speedCount": 666,
            "provName": "重庆",
            "provCode": "53"
        },
        {
            "speedCount": 1493,
            "provName": "四川",
            "provCode": "54"
        },
        {
            "speedCount": 1225,
            "provName": "贵州",
            "provCode": "55"
        },
        {
            "speedCount": 996,
            "provName": "云南",
            "provCode": "56"
        },
        {
            "speedCount": 110,
            "provName": "陕西",
            "provCode": "57"
        },
        {
            "speedCount": 1347,
            "provName": "甘肃",
            "provCode": "58"
        },
        {
            "speedCount": 45,
            "provName": "青海",
            "provCode": "59"
        },
        {
            "speedCount": 555,
            "provName": "宁夏",
            "provCode": "60"
        },
        {
            "speedCount": 1492,
            "provName": "新疆",
            "provCode": "61"
        },
        {
            "speedCount": 456,
            "provName": "西藏",
            "provCode": "62"
        }
    ]

};

const cityRankInfo = {
    citySpeedAvg          : '256',
    localProvinceCityRank : '3',
    localProvinceCityNum : '12',
    citySpeedRank:[
        {
            cityName     : '杭州',
            ranking	  : '1',
            cityAvgSpeed : '555'
        },
        {
            cityName     : '宁波',
            ranking	  : '2',
            cityAvgSpeed : '552'
        },
        {
            cityName     : '绍兴',
            ranking	  : '3',
            cityAvgSpeed : '434'
        },
        {
            cityName     : '温州',
            ranking	  : '4',
            cityAvgSpeed : '232'
        }, {
            cityName     : '湖州',
            ranking	  : '5',
            cityAvgSpeed : '211'
        },
        {
            cityName     : '金华',
            ranking	  : '6',
            cityAvgSpeed : '122'
        },
        {
            cityName     : '衢州',
            ranking	  : '7',
            cityAvgSpeed : '111'
        }
    ]
};

export default {
    data1,cityRankInfo
}
