// pages/setPayPas/setPayPas.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    static: app.globalData.statics,
    zfb: '',
    timeStr: '获取验证码',
    code: '',
    codeFlag: false,
    txpas: ''
  },

  code(e) {
    this.setData({
      code: e.detail.value
    });
  },
  txpas(e) {
    this.setData({
      txpas: e.detail.value
    });
  },
  getCode() {
    const that = this;
    wx.request({
      url: app.globalData.url + '/api/captcha/sms',
      data: {
        mobile: this.data.zfb,
        tpl: 'bind'
      },
      method: 'GET',
      success(res) {
        wx.showModal({
          title: '提示',
          content: res.data.message,
          showCancel: false
        });
        let time = 180;
        let timer = null;
        that.setData({
          codeFlag: true,
          timeStr: time + 's'
        });
        clearInterval(timer);
        timer = setInterval(() => {
          if (time <= 0) {
            clearInterval(timer);
            that.setData({
              codeFlag: false,
              timeStr: '获取验证码'
            });
            return;
          }
          time -= 1;
          that.setData({
            codeFlag: true,
            timeStr: time + 's'
          })
        }, 1000);
        console.log(res);
      },
      fail(err) {
        console.log(err);
      }
    })
  },
  singleSubmit() {
    const that = this;
    if (this.data.txpas === '') {
      wx.showToast({
        title: '请输入提现密码',
        icon: 'none'
      });
      return;
    }
    if (this.data.code === '') {
      wx.showToast({
        title: '请输入验证码',
        icon: 'none'
      });
      return;
    }
    app.isToken(function goNext(token) {
      wx.request({
        url: app.globalData.url + '/api/wallet/password',
        method: 'POST',
        data: {
          token,
          mobile: that.data.zfb,
          captcha: that.data.code,
          password: that.data.txpas
        },
        success(res) {
          if (res.data.status !== 200) {
            wx.showModal({
              title: '提示',
              content: res.data.message,
              showCancel: false
            })
            return;
          }
          wx.showToast({
            title: '修改成功',
            icon: 'none'
          });
          setTimeout(() => {
            wx.navigateTo({
              url: '/pages/withdrawal/withdrawal?zfb=' + that.data.zfb,
            });
          }, 1000);
        },
        fail(err) {
          console.log(err);
        }
      });
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      zfb: options.zfb
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  }
})