// pages/drawal/drawal.js
// 获取应用实例
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    static: app.globalData.statics,
    number: '',
    payNumber: '',
    txpas: '',
    txNum: ''
  },

  number(e) {
    const number = e.detail.value;
    this.setData({
      number
    });
  },

  txpas(e) {
    const txpas = e.detail.value;
    this.setData({
      txpas
    });
  },

  singleSubmit() {
    const that = this;
    app.isToken(function goNext(token) {
      wx.request({
        url: app.globalData.url + '/api/user/cash',
        method: 'POST',
        data: {
          token,
          cash_amount: that.data.number,
          password: that.data.txpas
        },
        success(res) {
          wx.showToast({
            title: res.data.message,
            icon: 'none'
          });
          setTimeout(() => {
            wx.navigateTo({
              url: '/pages/withdrawal/withdrawal',
            });
          }, 1000);
          console.log(res);
        },
        fail(err) {
          console.log(err);
        }
      })
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中...',
    });
    const that = this;
    this.setData({
      payNumber: options.zfb
    });
    app.isToken(function goNext(token) {
      var token = wx.getStorageSync('token');
      wx.request({
        url: app.globalData.url + '/api/wallet/cash',
        method: 'GET',
        data: {
          token
        },
        success(res) {
          wx.hideLoading();
          that.setData({
            number: res.data.data.userCash.money,
            txNum: res.data.data.userCash.money
          });
          console.log(res);
        },
        fail(err) {
          wx.hideLoading();
          console.log(err);
        }
      })
    })
  }
})