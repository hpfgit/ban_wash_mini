// 配置
var envir = 'online',
    CONFIG = {},
    configMap = {
        test: {
            appkey: 'd988edda82c87e01723014b7df8b031b',
            url: 'https://stg.tosneaker.com'
        },
        pre: {
            appkey: 'd988edda82c87e01723014b7df8b031b',
            url: 'https://stg.tosneaker.com'
        },
        online: {
            appkey: 'd988edda82c87e01723014b7df8b031b',
            url: 'https://stg.tosneaker.com'
        }
    };
CONFIG = configMap[envir];
// 是否开启订阅服务
CONFIG.openSubscription = true

module.exports = CONFIG