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
        url: app.globalData.url,
        num: app.globalData.num,
        value: app.globalData.phone,
        checked: true,
        disabled: false,
        modal: false,
        loginData: [],
        userInfoData: [],
        unionid: ''
        // 网易云信
        // errorMessage: '', // 显示错误提示信息
        // transports: ['websocket'], //传输方式
        // isLogin: false, // 登录状态
        // account: '', // 用户输入账号
        // password: '' //用户输入密码
    },
    // 获取手机号
    getPhoneNumber: function(e) {
        var that = this;
        if (e.detail.errMsg == 'getPhoneNumber:ok') {
            wx.showToast({
                title: '',
                duration: 100000,
                icon: 'loading',
                mask: true
            })
            var detail = e.detail;
            wx.login({
                success: function(res) {
                    if (res.code) {
                        var loginDataAgain = res;
                        wx.request({
                            url: app.globalData.url + '/api/wechat/ma/auth/bind-mobile',
                            method: 'POST',
                            data: {
                                miniapp_name: "care",
                                js_code: loginDataAgain.code,
                                user_info: that.data.userInfoData,
                                mobile_info: detail
                            },
                            success: function(res) {
                                if (res.data.data.token != '') {
                                    wx.hideToast();
                                    var timestamp = Date.parse(new Date());
                                    timestamp = timestamp / 1000;
                                    wx.setStorageSync('time', timestamp)
                                    wx.setStorageSync('token', res.data.data.token)
                                    wx.setStorageSync('phone', res.data.data.user_info.profile.mobile)
                                    // wx.setStorageSync('openId', res.data.data.openid)
                                    wx.setStorageSync('im_staff_tid', res.data.data.user_info.profile.im_staff_tid)
                                    wx.setStorageSync('prompt', true)
                                    // 美洽登陸數據
                                    wx.setStorageSync('avatar', res.data.data.user_info.profile.avatar);
                                    wx.setStorageSync('age', res.data.data.user_info.profile.age);
                                    wx.setStorageSync('name', res.data.data.user_info.name);
                                    wx.setStorageSync('userid', res.data.data.user_info.id);
                                    wx.setStorageSync('address', res.data.data.user_info.profile.location_name);
                                    wx.setStorageSync('gender', res.data.data.user_info.profile.sex);

                                    // 网易云信
                                    // wx.setStorageSync('account', res.data.data.user_info.profile.im_user)
                                    // wx.setStorageSync('password', res.data.data.user_info.profile.im_token)
                                    wx.navigateBack({
                                        delta: 1
                                    });
                                    app.globalData.isToken = 1;
                                    wx.showToast({
                                        title: '绑定成功',
                                        duration: 1500,
                                        icon: 'none',
                                        mask: true
                                    })
                                    setTimeout(function() {
                                        wx.navigateBack({
                                            delta: 1
                                        });
                                    }, 1500);
                                    // 发送pid
                                    var pid = wx.getStorageSync('pid');
                                    if (pid) {
                                        wx.request({
                                            url: that.data.url + '/api/wechat/ma/parent/bind',
                                            method: 'POST',
                                            data: {
                                                token: res.data.data.token,
                                                miniapp_name: 'care',
                                                pid: pid
                                            },
                                            success: function(res) {
                                                if (res.data.status == 201) {
                                                    wx.removeStorageSync('pid');
                                                }
                                            },
                                            fail: function(error) {
                                                console.log(error)
                                            }
                                        })
                                    }
                                    wx.hideToast();
                                }
                            },
                            fail: function(e) {
                                console.log(e)
                            }
                        })
                    }
                }
            })

        }
    },
    // 其他手机号登录
    other: function() {
        var that = this;
        wx.navigateTo({
            url: '/pages/binding/binding?unionid=' + that.data.unionid
        })
    },
    weChat: function(e) {
        var that = this;
        wx.showToast({
            title: '登录中...',
            duration: 10000,
            icon: 'loading',
            mask: true
        })
        wx.login({
            success: function(res) {
                app.globalData.openType = "contact"
                if (res.code) {
                    var loginData = res;
                    that.setData({
                        loginData: loginData
                    })
                    wx.getUserInfo({
                        success: function(res2) {
                            var userInfoData = res2
                            that.setData({
                                userInfoData: userInfoData
                            });
                            console.log(userInfoData);
                            wx.request({
                                url: that.data.url + '/api/wechat/ma/auth/login',
                                method: "POST",
                                header: {},
                                data: {
                                    miniapp_name: "care",
                                    js_code: loginData.code,
                                    user_info: userInfoData
                                },
                                success: function(res) {
                                    that.setData({
                                        unionid: res.data.unionid,
                                    });
                                    wx.setStorageSync('openId', res.data.openid)
                                    if (res.data.status == 403) {
                                        that.setData({
                                            modal: true
                                        })
                                        wx.hideToast();
                                    } else if (res.data.status == 401) {
                                        that.setData({
                                            modal: true
                                        })
                                        wx.hideToast();
                                    } else if (res.data.status == 201) {
                                      console.log(res)
                                        var timestamp = Date.parse(new Date());
                                        timestamp = timestamp / 1000;
                                        wx.setStorageSync('time', timestamp)
                                        wx.setStorageSync('token', res.data.data.token)
                                        wx.setStorageSync('phone', res.data.data.user_info.profile.mobile)
                                        wx.setStorageSync('openId', res.data.openid)
                                        wx.setStorageSync('im_staff_tid', res.data.data.user_info.profile.im_staff_tid)
                                        wx.setStorageSync('prompt', true)
                                        // 美洽登陸數據
                                        wx.setStorageSync('avatar', res.data.data.user_info.profile.avatar);
                                        wx.setStorageSync('age', res.data.data.user_info.profile.age);
                                        wx.setStorageSync('name', res.data.data.user_info.name);
                                        wx.setStorageSync('userid', res.data.data.user_info.id);
                                        wx.setStorageSync('address', res.data.data.user_info.profile.location_name);
                                        wx.setStorageSync('gender', res.data.data.user_info.profile.sex);
                                        wx.setStorageSync("user_info", that.data.userInfoData.rawData)
                                        // 网易云信
                                        // wx.setStorageSync('account', res.data.data.user_info.profile.im_user)
                                        // wx.setStorageSync('password', res.data.data.user_info.profile.im_token)
                                        wx.navigateBack({
                                            delta: 1
                                        });
                                        app.globalData.isToken = 1;
                                        // 发送pid
                                        var pid = wx.getStorageSync('pid');
                                        if (pid) {
                                            wx.request({
                                                url: that.data.url + '/api/wechat/ma/parent/bind',
                                                // url: 'https://dev.tosneaker.com/api/wechat/ma/parent/bind',
                                                method: 'POST',
                                                data: {
                                                    token: res.data.data.token,
                                                    miniapp_name: 'care',
                                                    pid: pid
                                                },
                                                success: function(res) {
                                                    console.log(res)
                                                    if (res.data.status == 201) {
                                                        wx.removeStorageSync('pid');
                                                    }
                                                },
                                                fail: function(error) {
                                                    console.log(error)
                                                }
                                            })
                                        }
                                        wx.hideToast();
                                    }
                                },
                                fail: function(e) {
                                    console.log(e)
                                }
                            })
                        },
                        fail: function(e) {
                            console.log(e)
                        }
                    })
                }
            }
        })
    },
    /**
     * 网易云信登录逻辑
     */
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
        var num = app.globalData.num
        this.setData({
            num: num
        })
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