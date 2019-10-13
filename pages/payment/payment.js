// pages/payment/payment.js
var mta = require('../../utils/mta_analysis.js')
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.globalData.imgUrl,
    static: app.globalData.statics,
    qiniuImgUrl: app.globalData.qiniuImgUrl,
    state: 1, //控制升级状态
    modal: false, //控制支付弹窗
    yue: false, //控制余额支付
    card: false, //控制洗护卡支付
    wx: true, //控制微信支付
    log_id: '',
    pay_no: '',
    shopArr: [], //服务数据
    left_image: '', //左侧图
    server_name: [], //服务名称数组
    data: [], //存放数据
    table: [], //会员等级表
    time: '',
    animationGrade: {},
  },
  // 获取服务信息
  getServer: function(id) {
    var that = this;
    app.isToken(
      function goNext() {
        var token = wx.getStorageSync('token');
        wx.request({
          url: app.globalData.url + '/api/ext/care/order/log/' + id + '/countinfo',
          method: 'GET',
          data: {
            token: token
          },
          success: function(res) {
            var data = res.data.data.goods;
            var name = [];
            for (var i in data) {
              if (i == 0) {
                for (var j in data[i].buy_item) {
                  name.push(data[i].buy_item[j].server_service_name)
                }
              }
            }
            var server_name = [...new Set(name)];
            that.setData({
              shopArr: res.data.data,
              left_image: res.data.data.goods[0].left_image,
              server_name: server_name
            })
          },
          fail: function(e) {
            console.log(e)
          }
        })
      }
    );
  },
  // 获取乱七八糟数据
  getData: function(id) {
    var that = this;
    app.isToken(
      function goNext() {
        var token = wx.getStorageSync('token');
        wx.request({
          url: app.globalData.url + '/api/ext/care/order/' + id + '/helporder',
          method: 'GET',
          data: {
            token: token
          },
          success: function(res) {
            var data = res.data.data;
            if (res.data.data.user_level == 0) {
              that.change(622 / 6 * 1);
            } else if (res.data.data.user_level == 1) {
              that.change(622 / 6 * 2);
            } else if (res.data.data.user_level == 2) {
              that.change(622 / 6 * 3);
            } else if (res.data.data.user_level == 3) {
              that.change(622 / 6 * 4);
            } else if (res.data.data.user_level == 4) {
              that.change(622 / 6 * 5);
            } else if (res.data.data.user_level == 5) {
              that.change(622 / 6 * 6);
            }
            data.order_price = Number(data.order_price)
            data.user_wallet_last_money = Number(data.user_wallet_last_money)
            data.user_carecard_last_money = Number(data.user_carecard_last_money)
            that.setData({
              data: data
            })
            that.setTime();
          },
          fail: function(e) {
            console.log(e)
          }
        })
      }
    );
  },
  // 刷新数据
  refreshData: function() {
    var that = this;
    app.isToken(
      function goNext() {
        var token = wx.getStorageSync('token');
        wx.request({
          url: app.globalData.url + '/api/ext/care/order/' + that.data.log_id + '/helporder',
          method: 'GET',
          data: {
            token: token
          },
          success: function(res) {
            var data = res.data.data;
            if (res.data.data.user_level == 0) {
              that.change(622 / 6 * 1);
            } else if (res.data.data.user_level == 1) {
              that.change(622 / 6 * 2);
            } else if (res.data.data.user_level == 2) {
              that.change(622 / 6 * 3);
            } else if (res.data.data.user_level == 3) {
              that.change(622 / 6 * 4);
            } else if (res.data.data.user_level == 4) {
              that.change(622 / 6 * 5);
            } else if (res.data.data.user_level == 5) {
              that.change(622 / 6 * 6);
            }
            data.order_price = Number(data.order_price)
            data.user_wallet_last_money = Number(data.user_wallet_last_money)
            data.user_carecard_last_money = Number(data.user_carecard_last_money)
            that.setData({
              data: data
            })
          },
          fail: function(e) {
            console.log(e)
          }
        })
      }
    );
  },
  // 获取会员等级信息
  getGrade: function() {
    var that = this;
    app.isToken(
      function goNext() {
        var token = wx.getStorageSync('token');
        wx.request({
          url: app.globalData.url + '/api/ext/care/wash/member/level',
          method: 'GET',
          data: {
            token: token
          },
          success: function(res) {
            that.setData({
              table: res.data.data
            })
          },
          fail: function(e) {
            console.log(e)
          }
        })
      }
    );
  },
  // 前往支付
  pay: function() {
    var that = this;
    that.setData({
      modal: true
    })
  },
  // 关闭支付弹窗
  close: function() {
    var that = this;
    that.setData({
      modal: false
    })
    wx.navigateTo({
      url: '/pages/orders/orders',
    })
  },
  // 选择支付方式
  select: function(e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var data = that.data.data;
    if (index == 1) {
      if (data.order_price > data.user_wallet_last_money) {

      } else {
        that.setData({
          yue: true,
          card: false,
          wx: false,
        })
      }
    } else if (index == 2) {
      if (data.order_price > data.user_carecard_last_money) {

      } else {
        that.setData({
          yue: false,
          card: true,
          wx: false,
        })
      }
    } else if (index == 3) {
      that.setData({
        yue: false,
        card: false,
        wx: true,
      })
    }
  },
  // 立即支付
  submit: function() {
    var that = this;
    app.isToken(
      function goNext() {
        var order_id = that.data.data.order_id;
        var pay_no = that.data.data.pay_no;
        var order_no = that.data.data.order_no;
        var token = wx.getStorageSync('token')
        if (that.data.yue) {
          wx.request({
            url: app.globalData.url + '/api/ext/care/blpay',
            method: 'POST',
            data: {
              token: token,
              pay_no: pay_no,
              order_no: order_no,
              driver: 'wallet',
              method: 'pos'
            },
            success: function(res) {
              if (res.data.status == 200) {
                wx.request({
                  url: app.globalData.url + '/api/ext/care/payment/care_order_record',
                  method: 'POST',
                  data: {
                    token: token,
                    order_id: order_id,
                    pay_type: 3,
                    order_platform: 2
                  },
                  success: function(res) {
                    wx.showToast({
                      title: '支付成功',
                      duration: 1500,
                      icon: 'none',
                      mask: true
                    })
                    setTimeout(function() {
                      wx.redirectTo({
                        url: '/pages/orders/orders'
                      })
                    }, 1500)
                  },
                  fail: function(e) {
                    console.log(e)
                  }
                })
              }
            },
            fail: function(e) {
              console.log(e)
            }
          })
        } else if (that.data.card) {
          wx.request({
            url: app.globalData.url + '/api/ext/care/blpay',
            method: 'POST',
            data: {
              token: token,
              pay_no: pay_no,
              order_no: order_no,
              driver: 'carecard',
              method: 'pos'
            },
            success: function(res) {
              if (res.data.status == 200) {
                wx.request({
                  url: app.globalData.url + '/api/ext/care/payment/care_order_record',
                  method: 'POST',
                  data: {
                    token: token,
                    order_id: order_id,
                    pay_type: 4,
                    order_platform: 2
                  },
                  success: function(res) {
                    wx.showToast({
                      title: '支付成功',
                      duration: 1500,
                      icon: 'none',
                      mask: true
                    })
                    setTimeout(function() {
                      wx.redirectTo({
                        url: '/pages/orders/orders'
                      })
                    }, 1500)
                  },
                  fail: function(e) {
                    console.log(e)
                  }
                })
              }
            },
            fail: function(e) {
              console.log(e)
            }
          })
        } else if (that.data.wx) {
          var token = wx.getStorageSync('token');
          var openId = wx.getStorageSync("openId");
          var param = {
            token: token,
            driver: 'wechat',
            method: 'miniapp',
            pay_no: that.data.pay_no,
            openid: openId,
            miniapp_name: 'care'
          }
          that.wxPay(param, order_id, token);
        }
      }
    );
  },
  // 微信支付
  wxPay: function(param, order_id, token) {
    var that = this;
    wx.request({
      url: app.globalData.url + '/api/payment/pay',
      method: 'POST',
      data: param,
      success: function(res) {
        wx.requestPayment({
          timeStamp: res.data.data.pay_info.timeStamp,
          nonceStr: res.data.data.pay_info.nonceStr,
          package: res.data.data.pay_info.package,
          signType: res.data.data.pay_info.signType,
          paySign: res.data.data.pay_info.paySign,
          success: function(res) {
            if (res.errMsg == 'requestPayment:ok') {
              wx.redirectTo({
                url: '/pages/orders/orders',
              })
              that.setData({
                modal: false
              })
              wx.request({
                url: app.globalData.url + '/api/ext/care/payment/care_order_record',
                method: 'POST',
                data: {
                  token: token,
                  order_id: order_id,
                  pay_type: 2,
                  order_platform: 2
                },
                success: function(res) {
                  wx.showToast({
                    title: '支付成功',
                    duration: 1500,
                    icon: 'non',
                    mask: true
                  })
                },
                fail: function(e) {
                  console.log(e)
                }
              })
            }
          },
          fail: function(e) {
            if (e.errMsg == 'requestPayment:fail cancel') {
              wx.redirectTo({
                url: '/pages/orders/orders',
              })
            }
          }
        })
      },
      fail: function(e) {
        console.log(e)
      }
    })
  },
  // 倒计时
  setTime: function() {
    var that = this;
    var time = that.data.data.level_up_end_time;

    function nowTime() {
      var intDiff = time - Date.parse(new Date()) / 1000;
      if (intDiff > 0) {
        var data = 0,
          hour = 0,
          minute = 0,
          second = 0;
        var second = intDiff;
        // 天
        var day = Math.floor(second / 3600 / 24);
        var dayStr = day.toString();
        if (dayStr.length == 1) dayStr = '0' + dayStr;
        // 时
        var hr = Math.floor((second - day * 3600 * 24) / 3600);
        var hrStr = hr.toString();
        if (hrStr.length == 1) hrStr = '0' + hrStr;
        // 分
        var min = Math.floor((second - day * 3600 * 24 - hr * 3600) / 60);
        var minStr = min.toString();
        if (minStr.length == 1) minStr = '0' + minStr;
        // 秒
        var sec = second - day * 3600 * 24 - hr * 3600 - min * 60;
        var secStr = sec.toString();
        if (secStr.length == 1) secStr = '0' + secStr;
        // 合并
        // var str = '剩余' + dayStr + '天' + hrStr + '小时' + minStr + '分' + secStr + '秒'
        var str = hrStr + ':' + minStr + ':' + secStr
        that.setData({
          time: str
        })
      } else {
        that.refreshData();
        that.setData({
          time: '已结束'
        })
        clearInterval(timer)
      }
    }
    // nowTime();//先执行一次，因为是一秒后执行
    var timer = setInterval(nowTime, 1000);
  },
  // 动画
  change: function(length) {
    var that = this;
    var animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease'
    });
    that.animation = animation;
    animation.width('0').step();
    that.setData({
      animationGrade: animation.export()
    })
    setTimeout(function() {
      animation.width(length + 'rpx').step();
      that.setData({
        animationGrade: animation.export()
      })
    }.bind(that), 200);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // mta
    mta.Page.init()
    var that = this;
    that.getServer(options.log_id);
    that.getData(options.log_id);
    that.getGrade();
    that.setData({
      log_id: options.log_id,
      pay_no: options.pay_no
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(res) {
    var that = this;
    if (Object.prototype.toString.call(res) == "[object Object]") {
      // 说明是对象
      if (res.from === 'button') {
        return {
          title: '助我升级！你也能6折享受最极致的洗护服务！',
          path: '/pages/payShare/payShare?log_id=' + that.data.log_id + '&order_id=' + that.data.data.order_id + '&pay_no=' + that.data.pay_no,
          imageUrl: 'https://mini.tosneaker.com/assets/care/images_ma/add_pay_share_invite.png',
          success: function(res) {
            // if (res.errMsg == 'shareAppMessage:ok') {
            //     console.log(111111)
            // }
            console.log(res)
          }
        }
      } else if (res.from === 'menu') {
        return {
          title: '极致工序，追求零损伤洗护！',
          path: '/pages/clean/clean',
          imageUrl: 'https://mini.tosneaker.com/assets/care/images_ma/change_share_default.png'
        }
      }
    } else {
      if (res[0].from === 'button') {
        return {
          title: '助我升级！你也能6折享受最极致的洗护服务！',
          path: '/pages/payShare/payShare?log_id=' + that.data.log_id + '&order_id=' + that.data.data.order_id + '&pay_no=' + that.data.pay_no,
          imageUrl: 'https://mini.tosneaker.com/assets/care/images_ma/add_pay_share_invite.png',
          success: function(res) {

            console.log(res)
          }
        }
      } else if (res[0].from === 'menu') {
        return {
          title: '极致工序，追求零损伤洗护！',
          path: '/pages/clean/clean',
          imageUrl: 'https://mini.tosneaker.com/assets/care/images_ma/change_share_default.png'
        }
      }
    }
  }
})