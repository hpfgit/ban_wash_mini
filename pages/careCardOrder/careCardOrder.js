// pages/careCardOrder/careCardOrder.js
var app = getApp();
var interval = null;
var mta = require('../../utils/mta_analysis.js')
Page({
    /**
     * 页面的初始数据
     */
    data: {
        static: app.globalData.statics,
        moudle: false,
        time: '60秒',
        currentTime: 61,
        isCode: true,
        orders: [],
        card_number: '', //卡号
        captcha: '' //验证码
    },
    // 获取数据
    getData() {
        var that = this;
        app.isToken(
            function goNext() {
                var token = wx.getStorageSync('token')
                wx.request({
                    url: app.globalData.url + '/api/ext/care/card/rechargelog',
                    method: 'GET',
                    data: {
                        token: token,
                        enabled: 1,
                        order_status: 1
                    },
                    success: function(res) {
                        var data = res.data.data;
                        for (var i in data) {
                            var nian = data[i].date.substring(5, 7);
                            var yue = data[i].date.substring(8, 10);
                            data[i].nian = nian;
                            data[i].yue = yue;
                        }
                        that.setData({
                            orders: data
                        })
                    },
                    fail: function(e) {
                        console.log(e)
                    }
                })
            }
        );
    },
    // 倒计时
    code: function(options) {
        var that = this;
        var currentTime = that.data.currentTime;
        interval = setInterval(function() {
            currentTime--;
            that.setData({
                time: currentTime + '秒'
            })
            if (currentTime <= 0) {
                clearInterval(interval);
                that.setData({
                    time: '60秒',
                    currentTime: 61,
                    isCode: false
                })
            }
        }, 1000)
    },
    // 查看券密
    see: function(e) {
        var that = this;
        var card_number = e.currentTarget.dataset.number;
        var phone = wx.getStorageSync('phone');
        var tpl = app.globalData.sort ? 'auth' : 'im_auth';
        wx.request({
            url: app.globalData.url + '/api/captcha/sms',
            data: {
                mobile: phone,
                tpl: tpl
            },
            method: 'GET',
            success: function(res) {
                if (res.data.status == 400) {
                    wx.showToast({
                        title: '手机号码不能为空！',
                        duration: 3000,
                        icon: 'none',
                        mask: true
                    })
                } else if (res.data.status == 200) {
                    that.code();
                    that.setData({
                        moudle: true,
                        isCode: true,
                        card_number: card_number
                    });
                    wx.showToast({
                        title: '验证码已发送，请注意查收（三分钟内有效）',
                        duration: 3000,
                        icon: 'none',
                        mask: true
                    })
                }
            },
            fail: function(e) {
                console.log(e)
            }
        })
    },
    // 重新获取验证码
    again: function() {
        var that = this;
        var card_number = that.data.card_number;
        var phone = wx.getStorageSync('phone');
        var tpl = app.globalData.sort ? 'auth' : 'im_auth';
        wx.request({
            url: app.globalData.url + '/api/captcha/sms',
            data: {
                mobile: phone,
                tpl: tpl
            },
            method: 'GET',
            success: function(res) {
                if (res.data.status == 400) {
                    wx.showToast({
                        title: '手机号码不能为空！',
                        duration: 3000,
                        icon: 'none',
                        mask: true
                    })
                } else if (res.data.status == 200) {
                    that.setData({
                        isCode: true
                    })
                    that.code();
                    wx.showToast({
                        title: '验证码已发送，请注意查收（三分钟内有效）',
                        duration: 3000,
                        icon: 'none',
                        mask: true
                    })
                }
            },
            fail: function(e) {
                console.log(e)
            }
        })
    },
    // 关闭模态框
    cancel: function() {
        var that = this;
        clearInterval(interval);
        that.setData({
            time: '60秒',
            currentTime: 61,
            isCode: false,
            moudle: false
        })
    },
    // 输入手机验证码
    captcha: function(e) {
        var that = this;
        that.setData({
            captcha: e.detail.value
        })
    },
    // 确定
    submit: function() {
        var that = this;
        app.isToken(
            function goNext() {
                var token = wx.getStorageSync('token')
                if (that.data.captcha != '') {
                    wx.request({
                        url: app.globalData.url + '/api/ext/care/card/' + that.data.card_number + '/detail',
                        method: 'POST',
                        data: {
                            token: token,
                            captcha: that.data.captcha
                        },
                        success: function(res) {
                            if (res.data.status == 200) {
                                wx.navigateTo({
                                    url: '/pages/voucher/voucher?card_number=' + res.data.data.card_number + '&card_password=' + res.data.data.card_password + '&money=' + res.data.data.last_money + '&enabled=' + res.data.data.enabled
                                })
                                clearInterval(interval);
                                that.setData({
                                    time: '60秒',
                                    currentTime: 61,
                                    isCode: false,
                                    moudle: false
                                })
                            } else if (res.data.status == 500) {
                                wx.showToast({
                                    title: '验证码已失效，请重新获取',
                                    duration: 1500,
                                    icon: 'none',
                                    mask: true
                                });
                                clearInterval(interval);
                                that.setData({
                                    time: '60秒',
                                    currentTime: 61,
                                    isCode: false,
                                })
                            }
                        },
                        fail: function(e) {
                            console.log(e)
                        }
                    })
                } else {
                    wx.showToast({
                        title: '请输入验证码',
                        duration: 1500,
                        icon: 'none',
                        mask: true
                    })
                }
            }
        );
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        // mta
        mta.Page.init()
        var that = this;
        that.getData();
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