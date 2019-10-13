var app = getApp();
var interval = null;
Page({
    data: {
        url: app.globalData.url,
        num: app.globalData.num,
        value: app.globalData.phone,
        sort: '',
        time: '',
        currentTime: 61,
        show: true,
        code: '',
        password: ''
    },
    code: function (options) {
        var that = this;
        var num = that.data.num;
        var value = that.data.value;
        var currentTime = that.data.currentTime;
        interval = setInterval(function () {
            currentTime--;
            that.setData({
                time: currentTime
            })
            if (currentTime <= 0) {
                clearInterval(interval);
                that.setData({
                    time: '',
                    currentTime: 61,
                    show: false
                })
            }
        }, 1000)
    },
    getCode: function () {
        this.setData({
            show: true
        });
        this.getData();
    },
    codeContent(e) {
        this.setData({
            code: e.detail.value
        })
    },
    passwordContent(e) {
        this.setData({
            password: e.detail.value
        })
    },
    go: function () {
        var that = this;
        var value = that.data.value;
        var code = that.data.code;
        var password = that.data.password;
        wx.request({
            url: that.data.url + '/api/auth/reset-password',
            data: { mobile: value, password: password, captcha: code },
            method: 'POST',
            success: function (res) {
                if (res.data.status == 201) {
                    wx.showToast({
                        title: '密码重置成功',
                        duration: 1500,
                        icon: 'none',
                        mask: true
                    })
                    setTimeout(function(){
                        wx.navigateTo({
                            url: '/pages/mine/mine',
                        })
                    },1500)
                }
            },
            fail: function (e) {

            }
        })
    },
    getData: function () {
        var that = this;
        var value = that.data.value;
        var tpl = that.data.sort ? 'reset' : 'im_reset';
        wx.request({
            url: that.data.url + '/api/captcha/sms',
            data: { mobile: value, tpl: tpl },
            method: 'GET',
            success: function (res) {
                if (res.data.status == 200) {
                    that.code();
                    wx.showToast({
                        title: '验证码已发送，请注意查收（三分钟内有效）',
                        duration: 3000,
                        icon: 'none',
                        mask: true
                    })
                }
            },
            fail: function (e) {
                console.log(e)
            }
        })
    },
    onShow: function () {
        var phone = app.globalData.phone;
        var num = app.globalData.num;
        var sort = app.globalData.sort;
        this.setData({
            num: num,
            value: phone,
            sort: sort
        });
        this.getData();
    }
})