// pages/setPay/setPay.js
const app = getApp();
Page({
  data: {
    static: app.globalData.statics,
    AccountNumber: '',
    AccountNumberYes: '',
    name: '',
    code: '',
    codeFlag: false,
    timeStr: '获取验证码',
    txpas: ''
  },
  AccountNumber(e) {
    this.setData({
      AccountNumber: e.detail.value
    });
  },
  AccountNumberYes(e) {
    this.setData({
      AccountNumberYes: e.detail.value
    });
  },
  name(e) {
    this.setData({
      name: e.detail.value
    });
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
    if (this.data.AccountNumber === '') {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none'
      });
      return;
    }
    wx.request({
      url: app.globalData.url + '/api/captcha/sms',
      data: {
        mobile: this.data.AccountNumber,
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
    if (this.data.AccountNumber === '' || this.data.AccountNumberYes === '') {
      wx.showToast({
        title: '请输入支付宝账号',
        icon: 'none'
      });
      return;
    }
    if (this.data.name === '') {
      wx.showToast({
        title: '请输入支付宝账号姓名',
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
    if (this.data.txpas === '') {
      wx.showToast({
        title: '请输入提现密码',
        icon: 'none'
      });
      return;
    }
    app.isToken(function goNext(token) {
      wx.request({
        url: app.globalData.url + '/api/wallet/newalipay',
        method: 'POST',
        data: {
          token,
          alipay_account: that.data.AccountNumber,
          alipay_account_confirmation: that.data.AccountNumberYes,
          alipay_realname: that.data.name,
          captcha: that.data.code
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
          wx.request({
            url: app.globalData.url + '/api/wallet/password',
            method: 'POST',
            data: {
              token,
              password: that.data.txpas,
              mobile: that.data.AccountNumber,
              captcha: that.data.code
            },
            success(res) {
              wx.showToast({
                title: '绑定成功',
                icon: 'none'
              });
              setTimeout(() => {
                wx.navigateTo({
                  url: '/pages/drawal/drawal?zfb='+that.data.AccountNumber,
                });
              }, 1000);
            },
            fail(err) {
              console.log(err);
            }
          })
        },
        fail(err) {
          console.log(err);
        }
      });
    });
  }
})