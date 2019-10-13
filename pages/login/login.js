var app = getApp();
Page({
  data: {
    url: app.globalData.url,
    num: '',
    value: '',
    password: ''
  },
  // 输入密码
  inputPass: function(e) {
    this.setData({
      password: e.detail.value
    })
  },
  // 忘记密码
  forget: function() {
    var that = this;
    wx.navigateTo({
      url: '/page/forget/forget',
    })
  },
  // 登录
  go: function() {
    var that = this;
    var value = that.data.value;
    var password = that.data.password;
    wx.request({
      url: that.data.url + '/api/auth/login',
      data: {
        mobile: value,
        password: password
      },
      method: 'POST',
      success: function(res) {
        if (res.data.status == 401) {
          wx.showToast({
            title: res.data.message,
            duration: 1500,
            icon: 'none',
            mask: true
          })
        } else if (res.data.status == 201) {
          wx.setStorage({
            key: 'token',
            data: res.data.data.token,
            success: function(res) {
              wx.showToast({
                title: '登录成功',
                duration: 1500,
                icon: 'none',
                mask: true
              })
            }
          })
        }
      },
      fail: function(e) {

      }
    })
  },
  onShow: function() {
    var phone = app.globalData.phone;
    var num = app.globalData.num;
    this.setData({
      num: num,
      value: phone
    })
  }
})