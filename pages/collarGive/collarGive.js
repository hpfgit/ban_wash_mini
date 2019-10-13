// pages/collarGive/collarGive.js
var app = getApp();
var mta = require('../../utils/mta_analysis.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        static: app.globalData.statics,
        state: 0,
        submit: false,
        inputBg: 0,
        numbers: '', //券号
        password: '', //券密
    },
    // 输入券号
    numbers: function(e) {
        var that = this;
        var number = e.detail.value;
        var numbers = number.replace(/\s/g, '').replace(/(\w{4})(?=\w)/g, "$1 ");
        that.setData({
            numbers: numbers
        });
        if (that.data.numbers != '') {
            that.setData({
                state: 1
            })
        } else {
            that.setData({
                state: 0
            })
        };
        if (that.data.numbers != '' && that.data.password != '') {
            that.setData({
                submit: true
            })
        } else {
            that.setData({
                submit: false
            })
        }
    },
    // 输入卡券焦点事件
    numberFocus: function() {
        var that = this;
        that.setData({
            inputBg: 1
        })
    },
    numberBlur: function() {
        var that = this;
        that.setData({
            inputBg: 0
        })
    },
    // 输入券密
    password: function(e) {
        var that = this;
        that.setData({
            password: e.detail.value
        });
        if (that.data.password != '') {
            that.setData({
                state: 2
            })
        } else {
            that.setData({
                state: 0
            })
        };
        if (that.data.numbers != '' && that.data.password != '') {
            that.setData({
                submit: true
            })
        } else {
            that.setData({
                submit: false
            })
        }
    },
    // 输入券密焦点事件
    passFocus: function() {
        var that = this;
        that.setData({
            inputBg: 2
        })
    },
    passBlur: function() {
        var that = this;
        that.setData({
            inputBg: 0
        })
    },
    // 立即领用
    submit: function() {
        var that = this;
        app.isToken(
            function goNext() {
                var token = wx.getStorageSync('token');
                var numbers = that.data.numbers;
                var items = numbers.split(' ')
                var newNumbers = items.join('');
                var password = that.data.password;
                wx.request({
                    url: app.globalData.url + '/api/ext/care/card/user/rechargging',
                    method: 'POST',
                    data: {
                        token: token,
                        card_number: newNumbers,
                        card_password: password
                    },
                    success: function(res) {
                        if (res.data.status == 201) {
                            wx.showToast({
                                title: '洗护卡余额已添加到您的账户',
                                duration: 1500,
                                icon: 'none',
                                mask: true
                            })
                            setTimeout(function() {
                                wx.navigateBack({
                                    delta: 1
                                })
                            }, 1500)
                        } else if (res.data.status == 400) {
                            wx.showToast({
                                title: res.data.message,
                                duration: 1500,
                                icon: "none",
                                mask: true
                            })
                        }
                    },
                    fail: function(e) {
                        console.log(e)
                    }
                })
            }
        );
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        // mta
        mta.Page.init()
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