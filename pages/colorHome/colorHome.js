// page/colorHome/colorHome.js
// import {
//     pushLog,
//     checkStringLength
// } from '../../utils/util.js'
// import {
//     iconLogo
// } from '../../utils/imageBase64.js'
// import IMEventHandler from '../../utils/imeventhandler.js'
// import MD5 from '../../vendors/md5.js'
var mta = require('../../utils/mta_analysis.js')
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        static: app.globalData.statics,
        imgUrl: app.globalData.imgUrl,
        image: [], //轮播图
        tixing: app.globalData.tixing, //监听消息
        interval: '', //定时器
        animationKefu: {},
        yongpin: false,
        // 网易云信
        errorMessage: '', // 显示错误提示信息
        transports: ['websocket'], //传输方式
        isLogin: false, // 登录状态
        account: '', // 用户输入账号
        password: '', //用户输入密码
        kefuId: 'bu-0000000176',
    },
    // 客服
    kefu: function() {
        var that = this;
        app.isToken(
            function goNext() {
                wx.navigateTo({
                    url: '/pages/chatPage/chatPage'
                })
            }
        )
        // wx.showToast({
        //     title: '',
        //     duration: 100000,
        //     icon: "loading",
        //     mask: true
        // })
        // app.isToken(
        //     function goNext() {
        //         if (app.globalData.success == true) {
        //             wx.navigateTo({
        //                 url: '/partials/chating/chating?chatTo=' + that.data.kefuId,
        //             })
        //             that.setData({
        //                 tixing: 0
        //             })
        //             wx.hideToast();
        //         } else {
        //             wx.hideToast();
        //             wx.showToast({
        //                 title: '无法获取客服信息，请稍后再次点击',
        //                 duration: 1500,
        //                 icon: "none",
        //                 mask: true
        //             })
        //         }
        //     }
        // );
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
    // 获取静态资源
    getState: function() {
        var that = this;
        wx.request({
            url: app.globalData.url + '/api/ext/care/static/image',
            method: 'GET',
            data: {
                care_service_id: 3,
                attribute: 1,
            },
            success: function(res) {
                var data = res.data.data;
                that.setData({
                    image: data
                })
            },
            fail: function(e) {
                console.log(e)
            }
        })
    },
    // 标洗/精洗
    goClean: function() {
        wx.reLaunch({
            url: '/pages/clean/clean',
        })
    },
    // 修复
    goXiuFu: function() {
        wx.reLaunch({
            url: '/pages/repairHome/repairHome',
        })
    },
    // 自助服务
    goService: function() {
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
    // 开始改色
    begin: function() {
        var that = this;
        app.isToken(
            function goNext() {
                wx.navigateTo({
                    url: '/pages/colorOrder/colorOrder',
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
        that.getState();
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
        // // 客服消息监控
        // that.data.interval = setInterval(function() {
        //     if (app.globalData.tixing == 0) {
        //         that.setData({
        //             tixing: app.globalData.tixing
        //         })
        //     } else if (app.globalData.tixing == 1) {
        //         that.setData({
        //             tixing: app.globalData.tixing
        //         })
        //         clearInterval(that.data.interval)

        //         // 动画
        //         var animation = wx.createAnimation({
        //             duration: 400,
        //             timingFunction: 'linear',
        //         });
        //         that.animation = animation;
        //         that.setData({
        //             animationKefu: animation.export()
        //         });
        //         setInterval(function() {
        //             animation.translateY(5).step();
        //             animation.translateY(-5).step();
        //             that.setData({
        //                 animationKefu: that.animation.export()
        //             })
        //         }.bind(that), 1000);
        //     }
        // }, 1000);
        // // 客服登录
        // this.setData({
        //     iconLogo
        // })
        // app.globalData.subscriber.on('STOP_IS_LOGIN', function() {
        //     that.setData({
        //         isLogin: false
        //     })
        // })
        // var account = wx.getStorageSync('account');
        // var password = wx.getStorageSync('password');
        // if (account != '' && password != '') {
        //     that.login({
        //         account,
        //         password
        //     })
        // }
    },
    /**
     * 网易云信登录逻辑
     */
    login: function(user) {
        let self = this
        this.setData({
            isLogin: true
        })
        app.globalData.isLogin = true
        setTimeout(() => {
            if (app.globalData.isLogin === true) {
                self.setData({
                    isLogin: false
                })
                // wx.showToast({
                //     title: '请检查网络',
                //     icon: 'none',
                //     duration: 1500
                // })
            }
        }, 15 * 1000)
        new IMEventHandler({
            token: user.password,
            account: user.account
        })
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {
        var that = this;
        clearInterval(that.data.interval)
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {
        var that = this;
        clearInterval(that.data.interval)
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