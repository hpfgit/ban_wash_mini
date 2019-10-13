// pages/orders/orders.js
var mta = require('../../utils/mta_analysis.js')
var meiqiaPlugin = requirePlugin("meiqia");

var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openType: "",
    static: app.globalData.statics,
    imgUrl: app.globalData.imgUrl,
    qiniuImgUrl: app.globalData.qiniuImgUrl,
    scrollTop: 0,
    scrollHeight: 0,
    page: 1, //第几页，默认1
    limit_per_page: 10, //每一页显示数目，默认10,
    datas: [],
    moreCan: true,
    delay: true,
    kefuId: 'bu-0000000176',
    hidden: true,
    order_id: '',
    goodsArr: [],
    globalApp: app
  },
  // 联系客服
    kefu: function () {
        var that = this;
        app.isToken(
            function goNext(token) {
                if (token == "") {
                    wx.navigateTo({
                        url: '/pages/mine/mine',
                    })
                    return
                }
                // 设置美洽信息
                var params = {
                    // 成功回调
                    success: function () {
                        // wx.showToast({
                        //     title: '设置顾客信息成功',
                        // });
                    },
                    // 失败回调
                    fail: function (res) {
                        // wx.showToast({
                        //     title: '设置失败：' + res.toString(),
                        // });
                    }
                };
                // 用户信息：可以设置用户的一些基本信息
                var obj = JSON.parse(wx.getStorageSync("user_info"));
                var address = obj.province
                var gender = isgender(obj.gender)
                function isgender(val) {
                    if (val == 0) {
                        return "未知"
                    } else if (val == 1) {
                        return "男"
                    } else {
                        return "女"
                    }
                }
                var name = obj.nickName
                let user_info = {
                    address, // 地址
                    gender, // 性别
                    name,// 名字
                    avatar: obj.avatarUrl, // 头像
                    tel: wx.getStorageSync("phone"), // 电话
                    "用户ID": wx.getStorageSync("userid"),
                    "来源": "洗护小程序"

                };
                // 位置信息
                let location_info = {
                    country: obj.country,
                    province: obj.province
                };
                // 客服指定分配信息
                let agent_info = {
                    agent_token: '', // 指定分配客服的 token，可以在 工作台设置 - ID查询 中查看
                    group_token: '', // 指定分配分组的 token，可以在 工作台设置 - ID查询 中查看
                    fallback: 3 // 指定分配客服不在线时候的处理情况：1 指定分配客服不在线，则发送留言；2 指定分配客服不在线，分配给组内的人，分配失败，则发送留言；3 指定分配客服不在线，分配给企业随机一个人，分配失败，则发送留言；
                };
                params.user_info = user_info;
                params.agent_info = agent_info;
                params.location_info = location_info;
                // 美洽企业ID 
                params.ent_id = '134989';
                // 小程序 token
                params.token = 'KCKsXREmWnZoQMwr';
                // 小程序 AppID
                params.app_id = 'wx51cb4be4ce4967e6';
                // 用户 openId
                params.open_id = wx.getStorageSync("openId");
                // 调用接口
                meiqiaPlugin.setClientInfo(params);
            }
        )
    },
  // 发送formid
  find: function(e) {
    var formid = e.detail.formId;
    var newFormId = app.globalData.newFormId;
    if (formid != 'the formId is a mock one') {
      var timestamp = Date.parse(new Date());
      timestamp = timestamp / 1000;
      var formid = e.detail.formId;
      var setFormid = {
        formid: formid,
        ts: timestamp
      }
      newFormId.formid.push(setFormid);
      var openId = wx.getStorageSync('openId')
      if (openId != '') {
        // 第一次发送formid
        if (app.globalData.first == true) {
          app.sendId();
          app.globalData.first = false;
        }
        // 一分钟之后
        var timestamp = Date.parse(new Date());
        timestamp = timestamp / 1000;
        if (timestamp - app.globalData.timestamp > 60) {
          app.sendId();
        }
      }
    }
  },
  // 获取订单列表
  getOrderList: function() {
    var that = this;
    app.isToken(
      function goNext() {
        var token = wx.getStorageSync('token');
        wx.request({
          url: app.globalData.url + '/api/ext/care/user/order_list',
          method: 'GET',
          data: {
            token: token,
            page: that.data.page,
            limit_per_page: that.data.limit_per_page
          },
          success: function(res) {
                console.log(res.data.data)
                // var goodsList = res.data.data;



              var goodsList = res.data.data;
              var goodsArr = [];
              for (let i = 0; i < goodsList.length; i++) {
                  var goodsItemArr = [];
                  var goodsItemArr1 = [];
                  goodsItemArr[0] = goodsList[i].goods
                  for (let j = 0; j < goodsItemArr[0].length; j++) {
                      var arr = [];
                      var arr1 = [];
                      if (goodsItemArr[0][j].buy_item == null) {
                          goodsItemArr[0][j].buy_item = [{}]
                      }
                      arr[0] = goodsItemArr[0][j].buy_item;

                      for (let k = 0; k < arr[0].length; k++) {
                          arr1.push(arr[0][k].server_service_name)
                      }
                      goodsItemArr1.push(app.Arrquchong(arr1))
                  }
                  goodsArr.push(goodsItemArr1)
              }
            //   goodsArr = goodsArr1
            //   console.log(goodsArr)





            //     var goodsArr = [];
            //     for (let i = 0; i < goodsList.length; i++) {
            //         var goodsItemArr = [];
            //         var goodsItemArr1 = [];
            //         goodsItemArr[0] = goodsList[i].goods
            //         for (let j = 0; j < goodsItemArr[0].length; j ++) {
            //             var arr = [];
            //             var arr1 = [];
            //             arr[0] = goodsItemArr[0][j].buy_item;
            //             for (let k = 0; k < arr[0].length; k ++) {
            //                 arr1.push(arr[0][k].server_service_name)
            //             }
            //             // app.Arrquchong(arr1)
            //             goodsItemArr1.push(app.Arrquchong(arr1))
            //             goodsItemArr1.push(arr1)
                        
            //         }
            //         goodsArr.push(goodsItemArr1)
            //     }
            //   console.log(goodsArr)
            that.setData({
                datas: res.data.data,
                goodsArr
            })
            wx.hideToast();
          },
          fail: function(e) {
            console.log(e)
          }
        })
      }
    );
  },
  // 查看详情
  goDetails: function(e) {
    var that = this;
    var data = that.data.datas;
    var index = e.currentTarget.dataset.index;
    for (var i in data) {
      if (i == index) {
        // wx.navigateTo({
        //     url: '/pages/cleanCollageDetails/cleanCollageDetails?log_id=' + data[i].id,
        // })
        wx.redirectTo({
          url: '/pages/cleanCollageDetails/cleanCollageDetails?log_id=' + data[i].id,
        })
      }
    }
  },
  // 二次确认
  goSupplement: function(e) {
    var that = this;
    var data = that.data.datas;
    var index = e.currentTarget.dataset.index;
    var extra_costs_pay_status = e.currentTarget.dataset.status;
    console.log(extra_costs_pay_status)
    for (var i in data) {
      if (i == index) {
        wx.redirectTo({
            url: '/pages/additional/additional?log_id=' + data[i].id + "&extra_costs_pay_status=" + extra_costs_pay_status,
        })
      }
    }
  },
  // 去支付
  goPay: function(e) {
    var that = this;
    app.isToken(
      function goNext() {
        var token = wx.getStorageSync('token');
        var openId = wx.getStorageSync("openId")
        var index = e.currentTarget.dataset.index;
        var data = that.data.datas;
        for (var i in data) {
          if (i == index) {
            wx.redirectTo({
              url: '/pages/payment/payment?pay_no=' + data[i].order_info.pay_no.pay_no + '&log_id=' + data[i].id,
            })
          }
        }
      }
    );
  },
  // 确认订单
  goOrder: function(e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var tag = e.currentTarget.dataset.tag;
    var data = that.data.datas;
    for (var i in data) {
      if (i == index) {
        if (data[i].order_type == 1 || data[i].order_type == 2) {
          console.log(1);
          wx.redirectTo({
            url: '/pages/publicOrder/publicOrder?log_id=' + data[i].id + '&module=0' + '&tag=' + tag + '&type=mend',
          })
        } else {
          console.log(2);
          wx.redirectTo({
            url: '/pages/publicOrder/publicOrder?log_id=' + data[i].id + '&module=1' + '&tag=' + tag + '&type=mend',
          })
        }
      }
    }
  },
  // 点击邮寄
  goMail: function(e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var data = that.data.datas;
    for (var i in data) {
      if (i == index) {
        wx.redirectTo({
          url: '/pages/writeLogistics/writeLogistics?log_id=' + data[i].id,
        })
      }
    }
  },
  // 查看物流
  goLogistics: function(e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var data = that.data.datas;
    for (var i in data) {
      if (i == index) {
        wx.navigateTo({
          url: '/pages/logistics/logistics?express_no=' + data[i].order_info.waybill_no + '&log_id=' + data[i].id + '&express_code=' + data[i].user_to_platform_express.express_code,
        })
      }
    }
  },

  // 自助查看物流
  goLogisticsSelf: function(e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var data = that.data.datas;
    for (var i in data) {
      if (i == index) {
        wx.navigateTo({
          url: '/pages/logistics/logistics?express_no=' + data[i].user_to_platform_express.express_no + '&log_id=' + data[i].id + '&express_code=' + data[i].user_to_platform_express.express_code,
        })
      }
    }
  },
  // 确认收货
  receipt: function(e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var data = that.data.datas;
    for (var i in data) {
      if (i == index) {
        that.setData({
          order_id: data[i].order_id,
          hidden: false
        })
      }
    }
  },
  // 取消确认收货
  cancel: function() {
    var that = this;
    that.setData({
      hidden: true
    })
  },
  // 确认确认收货
  confirm: function() {
    var that = this;
    app.isToken(
      function goNext() {
        var token = wx.getStorageSync('token');
        var order_id = that.data.order_id;
        wx.request({
          url: app.globalData.url + '/api/ext/care/order/' + order_id + '/finish',
          method: 'GET',
          data: {
            token: token
          },
          success: function(res) {
            that.setData({
              hidden: true,
              page: 1
            })
            that.getOrderList();
          },
          fail: function(e) {
            console.log(fail)
          }
        })
      }
    );
  },
  // 查看方案
  goPlan: function(e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var data = that.data.datas;
    for (var i in data) {
      if (i == index) {
        wx.redirectTo({
          url: '/pages/repairCan/repairCan?log_no=' + data[i].log_no + '&order_type=' + data[i].order_type,
        })
      }
    }
  },
  // 产看原因
  goReason: function(e) {
    var that = this;
    var data = that.data.datas;
    var index = e.currentTarget.dataset.index;
    for (var i in data) {
      if (i == index) {
        wx.navigateTo({
          url: '/pages/repairNo/repairNo?log_id=' + data[i].id,
        })
      }
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // mta
    mta.Page.init()
    var that = this;
    wx.showToast({
      title: '获取订单中...',
      duration: 1500,
      icon: 'loading',
      mask: true
    })
    setTimeout(function() {
      if (that.data.datas == '') {
        that.setData({
          delay: false
        })
        wx.hideToast()
      }
    }, 1500)
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
    var that = this;
    that.setData({
        openType: app.globalData.openType
    })
    that.getOrderList();
    // var len = that.data.data.length;

    // function nowTime() {
    //     for (var i = 0; i < len; i++) {
    //         if (that.data.data[i].shijian != '') {
    //             var moreTime = that.data.data[i].shijian;
    //             var intDiff = moreTime - Date.parse(new Date()) / 1000;
    //             var day = 0,
    //                 hour = 0,
    //                 minute = 0,
    //                 second = 0;
    //             var second = intDiff;
    //             // 天数位  
    //             var day = Math.floor(second / 3600 / 24);
    //             var dayStr = day.toString();
    //             if (dayStr.length == 1) dayStr = '0' + dayStr;

    //             // 小时位  
    //             var hr = Math.floor((second - day * 3600 * 24) / 3600);
    //             var hrStr = hr.toString();
    //             if (hrStr.length == 1) hrStr = '0' + hrStr;

    //             // 分钟位  
    //             var min = Math.floor((second - day * 3600 * 24 - hr * 3600) / 60);
    //             var minStr = min.toString();
    //             if (minStr.length == 1) minStr = '0' + minStr;

    //             // 秒位  
    //             var sec = second - day * 3600 * 24 - hr * 3600 - min * 60;
    //             var secStr = sec.toString();
    //             if (secStr.length == 1) secStr = '0' + secStr;

    //             var str = '剩余' + dayStr + '天' + hrStr + '小时' + minStr + '分' + secStr + '秒'
    //             that.data.data[i].defftime = str;
    //         }
    //     }
    //     that.setData({
    //         data: that.data.data
    //     })
    // }
    // nowTime();
    // var timer = setInterval(nowTime, 1000);
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    var that = this;
    that.setData({
      page: 1
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    var that = this;
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
    var that = this;
    if (that.data.moreCan == true) {
      var token = wx.getStorageSync('token');
      wx.request({
        url: app.globalData.url + '/api/ext/care/user/order_list',
        method: 'GET',
        data: {
          token: token,
          page: ++that.data.page,
          limit_per_page: that.data.limit_per_page
        },
        success: function(res) {
            var goodsArr = that.data.goodsArr;
          if (res.data.data.length != 0) {
            var data = res.data.data; //页数增加后的新内容
            console.log("新内容",data)
            var datas = that.data.datas; //上一页的内容
            console.log("老内容",datas)
            for (var i in data) {
              datas.push(data[i]);
            }
              var goodsList = datas;
              var goodsArr1 = [];
              for (let i = 0; i < goodsList.length; i++) {
                  var goodsItemArr = [];
                  var goodsItemArr1 = [];
                  goodsItemArr[0] = goodsList[i].goods
                  for (let j = 0; j < goodsItemArr[0].length; j++) {
                      var arr = [];
                      var arr1 = [];
                      if (goodsItemArr[0][j].buy_item == null) {
                          goodsItemArr[0][j].buy_item = [{}]
                      }
                      arr[0] = goodsItemArr[0][j].buy_item;
                      
                      for (let k = 0; k < arr[0].length; k++) {
                          arr1.push(arr[0][k].server_service_name)
                      }
                      goodsItemArr1.push(app.Arrquchong(arr1))
                  }
                  goodsArr1.push(goodsItemArr1)
              }
              goodsArr = goodsArr1
            //   console.log(goodsArr)

            that.setData({
                datas: datas,
                goodsArr
            })
          } else {
            that.setData({
              moreCan: false
            });
            wx.showToast({
              title: '已经到底了',
              duration: 1500,
              icon: 'none',
              mask: true
            })
          }
        },
        fail: function(e) {
          console.log(e)
        }
      })
    } else {
      wx.showToast({
        title: '已经到底了',
        duration: 1500,
        icon: 'none',
        mask: true
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(res) {
    if (res[0].from === 'menu') {
      return {
        title: '极致工序，追求零损伤洗护！',
        path: '/pages/clean/clean',
        imageUrl: 'https://mini.tosneaker.com/assets/care/images_ma/change_share_default.png'
      }
    }
  }
})