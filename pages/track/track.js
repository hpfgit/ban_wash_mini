// page/logistics/logistics.js
var mta = require('../../utils/mta_analysis.js')
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    static: app.globalData.statics,
    log_id: '',
    data: [],
    extra: [],
    log_no: '',
    order_no: '',
    number: 283,
    danhao: '',
    type: ''
  },
  goto100(e) {
    console.log(e);
    const index = e.currentTarget.dataset.index.toString();
    console.log(index);
    if (index === '0' && this.data.data.length === 3) {
      wx.navigateTo({
        url: "/pages/webview/webview?danhao=" + this.data.danhao + '&type=' + this.data.type
      });
    }
  },
  // 获取数据
  getData: function() {
    var that = this;
    app.isToken(
      function goNext() {
        var token = wx.getStorageSync('token');
        wx.request({
          url: app.globalData.url + '/api/ext/care/order/' + that.data.log_id + '/flow',
          method: 'GET',
          data: {
            token: token
          },
          success: function(res) {
            console.log(res.data)
            that.setData({
              data: res.data.data,
              extra: res.data.extra_data
            })
          },
          fail: function(e) {
            console.log(e)
          }
        })
      }
    );

  },
  // 查看原因
  goReason: function(e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var data = that.data.data;
    for (var i in data) {
      if (i == index) {
        wx.navigateTo({
          url: '/pages/repairNo/repairNo?log_id=' + data[i].op_info.care_log_id,
        })
      }
    }
  },
  // 二次确认
  goSupplement: function(e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var data = that.data.data;
    for (var i in data) {
      if (i == index) {
        wx.navigateTo({
          url: '/pages/additional/additional?log_id=' + data[i].op_info.care_log_id + "&extra_costs_pay_status=" + that.data.extra.extra_costs_pay_status,
        })
      }
    }
  },
  // 已确认  查看详情
  goExamine(e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var data = that.data.data;
    for (var i in data) {
      if (i == index) {
        wx.navigateTo({
          url: '/pages/additional/additional?log_id=' + data[i].op_info.care_log_id + "&extra_costs_pay_status=" + that.data.extra.extra_costs_pay_status,
        })
      }
    }
  },
  // 查看方案
  goPlan: function(e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var data = that.data.data;
    for (var i in data) {
      if (i == index) {
        if (that.data.extra.order_type == 3) {
          wx.redirectTo({
            url: '/pages/repairCan/repairCan?log_no=' + that.data.log_no + '&order_type=' + that.data.extra.order_type.order_type,
          })
        }
        if (that.data.extra.order_type == 5) {
          wx.redirectTo({
            url: '/pages/repairCan/repairCan?log_no=' + that.data.log_no + '&order_type=' + that.data.extra.order_type.order_type,
          })
        }
      }
    }
  },

  // 查看物流
  goLogistics: function(e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var data = that.data.data;
    for (var i in data) {
      if (i == index) {
        wx.navigateTo({
          url: '/pages/logistics/logistics?express_no=' + data[i].op_info.express_no + '&log_id=' + that.data.log_id + '&express_code=' + data[i].op_info.express_code,
        })
      }
    }
  },
  // 填写邮寄信息
  goInfo: function(e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var data = that.data.data;
    for (var i in data) {
      if (i == index) {
        wx.redirectTo({
          url: '/pages/writeLogistics/writeLogistics?log_id=' + data[i].op_info.care_log_id,
        })
      }
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options);
    // mta
    mta.Page.init()
    var that = this;
    that.setData({
      log_id: options.log_id,
      log_no: options.log_no,
      order_no: options.order_no,
      danhao: options.danhao,
      type: options.type
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
    var that = this;
    that.getData();
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
    if (res[0].from === 'menu') {
      return {
        title: '极致工序，追求零损伤洗护！',
        path: '/pages/clean/clean',
        imageUrl: 'https://mini.tosneaker.com/assets/care/images_ma/change_share_default.png'
      }
    }
  }
})