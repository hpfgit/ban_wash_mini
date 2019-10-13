// page/memberHome/memberHome.js
var mta = require('../../utils/mta_analysis.js')
var app = getApp();
Page({
    /**
     * 页面的初始数据
     */
    data: {
        static: app.globalData.statics,
        imgUrl: app.globalData.imgUrl,
        qiniuImgUrl: app.globalData.qiniuImgUrl,
        mini: app.globalData.url,
        table: [],
        user_info: [],
        yongpin: false
    },
    // 发送formid
    find: function(e) {
        var formid = e.detail.formId;
        var newFormId = app.globalData.newFormId;
        if (formid != 'the formId is a mock one') {
            var timestamp = Date.parse(new Date());
            timestamp = timestamp / 1000;
            var formid = e.detail.formId;
            var setFormid = {
                formid: formid,
                ts: timestamp
            }
            newFormId.formid.push(setFormid);
            var openId = wx.getStorageSync('openId')
            if (openId != '') {
                // 第一次发送formid
                if (app.globalData.first == true) {
                    app.sendId();
                    app.globalData.first = false;
                }
                // 一分钟之后
                var timestamp = Date.parse(new Date());
                timestamp = timestamp / 1000;
                if (timestamp - app.globalData.timestamp > 60) {
                    app.sendId();
                }
            }
        }
    },
    // 充值
    goCard: function() {
        wx.navigateTo({
            url: '/pages/memberCard/memberCard',
        })
    },
    // 提现
    goWithdrawal() {
      wx.navigateTo({
        url: '/pages/withdrawal/withdrawal',
      })
    },
    // 升等级
    goGrade: function() {
        wx.navigateTo({
            url: '/pages/memberGrade/memberGrade',
        })
    },
    // 获取用户信息
    getUser: function() {
        var that = this;
        app.isToken(
            function goNext() {
                var token = wx.getStorageSync('token');
                wx.request({
                    url: app.globalData.url + '/api/ext/care/member',
                    method: 'GET',
                    data: {
                        token: token
                    },
                    success: function(res) {
                        that.setData({
                            user_info: res.data.data.user_info
                        });
                    },
                    fail: function(e) {
                        console.log(e)
                    }
                })
            }
        );
    },
    // 获取会员等级信息
    getGrade: function() {
        var that = this;
        app.isToken(
            function goNext() {
                var token = wx.getStorageSync('token');
                wx.request({
                    url: app.globalData.url + '/api/ext/care/wash/member/level',
                    method: 'GET',
                    data: {
                        token: token
                    },
                    success: function(res) {
                      console.log(res)
                        that.setData({
                            table: res.data.data
                        })
                    },
                    fail: function(e) {
                        console.log(e)
                    }
                })
            }
        );
    },
    // 修复服务
    goXiuFu: function() {
        wx.reLaunch({
            url: '/pages/repairHome/repairHome',
        })
    },
    // 改色补色
    colorChange: function() {
        wx.reLaunch({
            url: '/pages/colorHome/colorHome',
        })
    },
    // 自助服务
    featureService: function() {
        wx.reLaunch({
            url: '/pages/specialHome/specialHome',
        })
    },
    // 洗护用品
    goYongpin: function() {
        var that = this;
        if (that.data.yongpin == false) {
            that.setData({
                yongpin: true
            })
        }
    },
    yongpin: function() {
        var that = this;
        that.setData({
            yongpin: false
        })
    },
    // 标洗/精洗
    goClean: function() {
        wx.reLaunch({
            url: '/pages/clean/clean',
        })
    },
    // 洗护订单
    cleanOrder: function() {
        app.isToken(
            function goNext() {
                wx.navigateTo({
                    url: '/pages/orders/orders',
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
        var that = this;
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
        var that = this;
        that.getUser();
        that.getGrade();
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