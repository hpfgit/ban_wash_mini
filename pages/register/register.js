var app = getApp();
var interval = null;
var mta = require('../../utils/mta_analysis.js')
Page({
    data: {
        url: app.globalData.url,
        num: '',
        value: '',
        sort:'',
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
            url: that.data.url +'/api/auth/register',
            data: { mobile: value, password: password,captcha:code},
            method:'POST',
            success:function(res){
                if(res.data.status == 400){
                    wx.showToast({
                        title: '密码至少为6个字符',
                        duration: 1500,
                        icon: 'none',
                        mask: true
                    })
                }else if(res.data.status == 201){
                    wx.setStorage({
                        key: 'token',
                        data: res.data.data.token,
                        success: function (res) {
                            wx.showToast({
                                title: '注册成功',
                                duration: 1500,
                                icon: 'none',
                                mask: true
                            })
                        }
                    })
                    setTimeout(function(){
                        wx.navigateTo({
                            url: '/pages/mine/mine',
                        })
                    },1500)
                }
            },
            fail:function(e){

            }
        })
    },
    getData: function () {
        var that = this;
        var value = that.data.value;
        var tpl = that.data.sort ? 'regist' : 'im_regist';
        wx.request({
            url: that.data.url + '/api/captcha/sms',
            data: { mobile: value, tpl: tpl },
            method: 'GET',
            success: function (res) {
                if(res.data.status == 200){
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
    onLoad: function () {
        // mta
        mta.Page.init()
    },
    onShow: function () {
        var phone = app.globalData.phone;
        var num = app.globalData.num;
        var sort = app.globalData.sort;
        this.setData({
            num: num,
            value: phone,
            sort:sort
        });
        this.getData();
    }
})