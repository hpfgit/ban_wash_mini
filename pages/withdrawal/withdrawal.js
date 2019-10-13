// pages/withdrawal/withdrawal.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user: {},
    pay: {}
  },

  setpay(e) {
    const {bindtype} = e.currentTarget.dataset;
    console.log(bindtype);
    if (bindtype === 0) {
      wx.navigateTo({
        url: '/pages/setPay/setPay',
      });
    }
  },

  editPas() {
    if (this.data.pay.bindtype !== 1) {
      wx.showToast({
        title: '请先绑定支付宝账号',
      });
      return;
    }
    wx.navigateTo({
      url: '/pages/setPayPas/setPayPas?zfb='+this.data.pay.alipay_account,
    });
  },

  draw() {
    if (this.data.pay.bindtype !== 1) {
      wx.showToast({
        title: '请先绑定支付宝账号',
        icon: 'none'
      });
      return;
    }
    wx.navigateTo({
      url: '/pages/drawal/drawal?zfb=' + this.data.pay.alipay_account,
    })
  },
  detail() {
    wx.navigateTo({
      url: '/pages/drawalDetail/drawalDetail',
    })
  },

  onReady: function(options) {
    wx.showLoading({
      title: '加载中...',
    });
    const that = this;
    app.isToken(function goNext(token) {
      var token = wx.getStorageSync('token');
      wx.request({
        url: app.globalData.url + '/api/wallet/cash',
        method: 'GET',
        data: {
          token
        },
        success(res) {
          that.setData({
            user: res.data.data.userCash
          });
          wx.hideLoading();
          console.log(res);
        },
        fail(err) {
          wx.hideLoading();
          console.log(err);
        }
      });
    });
    let timer = null;
    let flag = true;
    timer = setInterval(() => {
      if (flag) {
        flag = false;
        app.isToken(function goNext(token) {
          wx.showLoading({
            title: '加载中...',
          })
          wx.request({
            url: app.globalData.url + '/api/wallet/havealipay',
            method: 'GET',
            data: {
              token
            },
            success(res) {
              wx.hideLoading();
              that.setData({
                pay: res.data.data
              });
              flag = true;
              clearInterval(timer);
              console.log(res.data.data);
            },
            fail(err) {
              wx.hideLoading();
              console.log(err);
            }
          })
        })
      }
    });
  }
})