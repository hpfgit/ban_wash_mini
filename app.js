// var util = require('./utils/util.js')
// var config = require('./utils/config.js')
// var subscriber = require('./utils/event.js')
var mta = require('./utils/mta_analysis.js')
App({
  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch: function(options) {
    // console.log("[onLaunch]场景值",options)
    return
    // 进入小程序的时间
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    this.globalData.timestamp = timestamp;
    // mta
    mta.App.init({
      "appID": "500633660",
      "eventID": "500633661",
      "lauchOpts": options,
      // "statPullDownFresh": true,
      "statShareApp": true,
      "statReachBottom": true
    });
  },
  // 重新请求token
  isToken2: function() {
    return new Promise((resolve, reject) => {
      var that = this;
      var token = wx.getStorageSync('token');
      if (token != '') {
        var timestamp = Date.parse(new Date());
        timestamp = timestamp / 1000;
        var oldTimeStamp = wx.getStorageSync('time');
        if (timestamp - oldTimeStamp >= 3600) {
          wx.request({
            url: that.globalData.url + '/api/auth/refresh-token',
            method: 'POST',
            data: {
              token: token
            },
            success: function(res) {
              console.log('重新请求', res)
              if (res.data.status == 200) {
                wx.setStorageSync('time', timestamp)
                wx.setStorageSync('token', res.data.data.token);
                resolve(res.data.data.token);
              } else {
                reject('/pages/mine/mine');
                // wx.navigateTo({
                //   url: '/pages/mine/mine',
                // })
              }
            },
            fail: function(e) {
              console.log(e)
            }
          })
        } else {
          resolve(token);
        }
      } else {
        reject('/pages/mine/mine');
        // wx.navigateTo({
        //   url: '/pages/mine/mine',
        // })
      }
    })
  },
  // 重新请求token
  isToken: function(goNext) {
    var that = this;
    var token = wx.getStorageSync('token');
    if (token != '') {
      var timestamp = Date.parse(new Date());
      timestamp = timestamp / 1000;
      var oldTimeStamp = wx.getStorageSync('time');
      if (timestamp - oldTimeStamp >= 3600) {
        wx.request({
          url: that.globalData.url + '/api/auth/refresh-token',
          method: 'POST',
          data: {
            token: token
          },
          success: function(res) {
            console.log('重新请求', res)
            if (res.data.status == 200) {
              wx.setStorageSync('time', timestamp)
              wx.setStorageSync('token', res.data.data.token);
              goNext(token);
            } else {
              wx.navigateTo({
                url: '/pages/mine/mine',
              })
            }
          },
          fail: function(e) {
            console.log(e)
          }
        })
      } else {
        goNext(token);
      }
    } else {
      wx.navigateTo({
        url: '/pages/mine/mine',
      })
    }
  },
    // 数组去重
  Arrquchong: function (array) {
      var temp = []; //一个新的临时数组
      for (var i = 0; i < array.length; i++) {
          if (temp.indexOf(array[i]) == -1) {
              temp.push(array[i]);
          }
      }
      return temp;
  },
  /**
   * 当小程序启动，或从后台进入前台显示，会触发 onShow
   */
  onShow: function(options) {
    var that = this;
    var token = wx.getStorageSync('token');
    if (token != '') {
    that.globalData.openType = "contact"
      var timestamp = Date.parse(new Date());
      timestamp = timestamp / 1000;
      var oldTimeStamp = wx.getStorageSync('time');
      if (timestamp - oldTimeStamp >= 3500) {
        wx.request({
          url: that.globalData.url + '/api/auth/refresh-token',
          method: 'POST',
          data: {
            token: token
          },
          success: function(res) {
            // console.log(res,222)
            if (res.data.status == 200) {
              wx.setStorageSync('time', timestamp)
              wx.setStorageSync('token', res.data.data.token);
            } else {
              wx.navigateTo({
                url: '/pages/mine/mine',
              })
            }
          },
          fail: function(e) {
            console.log(e)
          }
        })
      }
    }
  },



  /**
   * 当小程序从前台进入后台，会触发 onHide
   */
  onHide: function() {

  },

  /**
   * 当小程序发生脚本错误，或者 api 调用失败时，会触发 onError 并带上错误信息
   */
  onError: function(msg) {

  },
  // 发送后台
  sendId: function() {
    var that = this;
    // console.log(this,444)
    // 逻辑
    // 当first为true的时候发送第一次formid，然后清空newFormId
    var openId = wx.getStorageSync('openId')
    this.globalData.newFormId.openid = openId;
    var token = wx.getStorageSync("token")
    this.globalData.newFormId.token = token
    if (this.globalData.first == true) {
      wx.request({
        url: this.globalData.url + '/api/wechat/ma/formid/collect',
        method: 'POST',
        data: that.globalData.newFormId,
        success: function(res) {
          if (res.data.status == 201) {
            // console.log(that.globalData.newFormId, '第一次发')
            that.globalData.newFormId.formid = [];
          }
        },
        fail: function(e) {
          // console.log(e, 33333)
        }
      })
    } else {
      // 超过一分钟发送formid
      wx.request({
        url: this.globalData.url + '/api/wechat/ma/formid/collect',
        method: 'POST',
        data: that.globalData.newFormId,
        success: function(res) {
          if (res.data.status == 201) {
            // console.log(that.globalData.newFormId, '不是第一次发')
            that.globalData.newFormId.formid = [];
          }
        },
        fail: function(e) {
          console.log(e)
        }
      })
    }
  },
  // 清空全局的优惠券id数组
  cleanCouponArr: function() {
    var that = this;
    that.globalData.couponArr = [];
  },
  globalData: {
    openType: "",
    isToken: 0,
    time: '',
    // 正式环境
    // url: 'https://www.tosneaker.com',
    // imgUrl: 'https://static.tosneaker.com', // 页面静态展示图片
    // qiniuImgUrl: 'https://static.tosneaker.com', // 上传到七牛云
    // stg 环境 wxm
    url: 'https://stg.tosneaker.com',
    imgUrl: 'http://static-stg.tosneaker.com',
    qiniuImgUrl: 'http://static-stg.tosneaker.com',
    // stg环境
    // url: 'https://dev.tosneaker.com',
    // // url: 'https://stg.tosneaker.com',
    // imgUrl: 'https://static.tosneaker.com',// 页面静态展示图片
    // // imgUrl: 'http://static-stg.tosneaker.com',// 页面静态展示图片
    // qiniuImgUrl: 'http://static-stg.tosneaker.com',// 上传到七牛云
    num: '86',
    sort: '0',
    phone: '',
    // statics: 'https://mini.tosneaker.com/assets/care/images_ma',
    statics: 'https://static.tosneaker.com/assets/care/images_ma',
    token: "",
    waitToken: '',
    openId: '',
    // 网易云信部分
    // isLogin: false, // 当前是否是登录状态
    // currentChatTo: '', // 记录当前聊天对象account，用于标记聊天时禁止更新最近会话unread
    // loginUser: {}, //当前登录用户信息
    // friends: [], //好友列表，
    // config, //存储appkey信息
    // nim: {}, //nim连接实例
    // subscriber, //消息订阅器
    // notificationList: [], // 通知列表
    // recentChatList: {}, //最近会话列表
    // rawMessageList: {}, //原生的所有消息列表(包含的字段特别多)
    // messageList: {}, //处理过的所有的消息列表
    // account: '', //账号
    // password: '', //密码
    // tixing: 0, //新消息提醒
    // success: false, //登录成功
    // formid
    newFormId: {
      token: '',
      miniapp_name: 'care',
      openid: '',
      formid: []
    }, //小程序模板推送用的formid
    timestamp: '', //第一次穿formid用的时间戳
    first: true, //是不是第一次传formid
    couponArr: [], //优惠券id数组
    express_check: 0 //物流选择  默认选中第一项
  }
})