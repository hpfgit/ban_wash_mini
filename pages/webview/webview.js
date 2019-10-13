// page/logistics/logistics.js
var mta = require('../../utils/mta_analysis.js')
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    static: app.globalData.statics,
    danhao: '',
    type: '',
    data: [],
    no_text: ''
  },
  // 获取数据
  getData: function() {
    wx.showLoading({
      title: '加载中...',
    });
    var that = this;
    app.isToken2().then(token => {
      wx.request({
        url: app.globalData.url + '/api/oms/order/wuliu',
        method: 'POST',
        data: {
          token,
          danhao: that.data.danhao,
          type: that.data.type
        },
        success: (res) => {
          console.log(res);
          wx.hideLoading();
          this.setData({
            data: res.data.result.list
          });
          if (!res.data.result.list.length) {
            that.setData({no_text: '暂无物流信息'});
          }
        },
        fail: (err) => {
          wx.hideLoading();
          console.log(err);
        }
      })
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onLoad: function(options) {
    let type = '';
    if (options.type === '韵达') {
      type = 'YUNDA';
    } else if (options.type === '京东') {
      type = 'JD';
    } else if (options.type === '顺丰') {
      type = 'SDEX';
    } else if (options.type === '门店寄回') {
      type = 'YUNDA';
    }
    this.setData({
      danhao: options.danhao,
      type
    });
    this.getData();
  }
})