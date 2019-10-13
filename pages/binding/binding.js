// page/binding/binding.js
var app = getApp();
var interval = null;
var mta = require('../../utils/mta_analysis.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        static: app.globalData.statics,
        url: app.globalData.url,
        num: '',
        value: '',
        code: '',
        sort: app.globalData.sort,
        time: '获取验证码',
        currentTime: 61,
        disabled: false,
        password: '',
        uid: ''
    },
    code: function(options) {
        var that = this;
        var num = that.data.num;
        var value = that.data.value;
        var currentTime = that.data.currentTime;
        interval = setInterval(function() {
            currentTime--;
            that.setData({
                time: currentTime + '秒'
            })
            if (currentTime <= 0) {
                clearInterval(interval);
                that.setData({
                    time: '重新发送',
                    currentTime: 61,
                    disabled: false
                })
            }
        }, 1000)
    },
    // input输入框内容
    phone: function(e) {
        this.setData({
            value: e.detail.value
        })
    },
    //   输入验证码
    codeContent(e) {
        this.setData({
            code: e.detail.value
        })
    },
    // 输入密码
    passwordContent(e) {
        this.setData({
            password: e.detail.value
        })
    },
    //   获取验证码
    getData: function() {
        var that = this;
        if (that.data.disabled) {
            return
        } else {
            var value = that.data.value;
            var tpl = that.data.sort ? 'regist' : 'im_regist';
            wx.request({
                url: that.data.url + '/api/captcha/sms',
                data: {
                    mobile: value,
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
                            disabled: true
                        })
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
        }
    },
    // 开始鞋途
    go: function() {
        var that = this;
        wx.showToast({
            title: '绑定手机号中...',
            duration: 100000,
            icon: "none",
            mask: true
        })
        var phone = that.data.value; //手机号
        var code = that.data.code; //验证码
        var uid = that.data.uid; //uid
        var driver = 'wechat' //微信
        if (phone == '' || code == '') {
            wx.showToast({
                title: '请输入手机号和验证码',
                duration: 1500,
                icon: 'none',
                mask: true
            })
        } else {
            wx.getUserInfo({
                success: function(res) {
                    // console.log(res,111)
                    var openid = wx.getStorageSync('openId')
                    var nickname = res.userInfo.nickName; //姓名
                    var avatar = res.userInfo.avatarUrl; //头像
                    var sex = res.userInfo.gender; //性别
                    wx.request({
                        url: that.data.url + '/api/auth/bind-mobile',
                        method: 'POST',
                        data: {
                            mobile: phone,
                            captcha: code,
                            driver: driver,
                            uid: uid,
                            nickname: nickname,
                            avatar: avatar,
                            sex: sex,
                            openid: openid,
                            miniapp_name: "care",
                        },
                        success: function(res) {
                            if (res.data.status == 400) {
                                wx.showToast({
                                    title: res.data.message,
                                    duration: 1500,
                                    icon: 'none',
                                    mask: true
                                })
                            } else if (res.data.status == 403) {
                                wx.showToast({
                                    title: res.data.message,
                                    duration: 1500,
                                    icon: 'none',
                                    mask: true
                                })
                            } else if (res.data.status == 500) {
                                wx.showToast({
                                    title: res.data.message,
                                    duration: 1500,
                                    icon: 'none',
                                    mask: true
                                })
                            } else if (res.data.status == 201) {
                                wx.login({
                                    success: function(res) {
                                        if (res.code) {
                                            var loginData = res;
                                            wx.getUserInfo({
                                                success: function(res2) {
                                                    var userInfoData = res2
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
                                                            if (res.data.status == 403) {
                                                                wx.navigateTo({
                                                                    url: '/pages/binding/binding?unionid=' + res.data.unionid,
                                                                })
                                                                wx.hideToast();
                                                            } else if (res.data.status == 401) {
                                                                wx.navigateTo({
                                                                    url: '/pages/binding/binding?unionid=' + res.data.unionid,
                                                                })
                                                                wx.hideToast();
                                                            } else if (res.data.status == 201) {
                                                                var timestamp = Date.parse(new Date());
                                                                timestamp = timestamp / 1000;
                                                                wx.setStorageSync('time', timestamp)
                                                                wx.setStorageSync('token', res.data.data.token)
                                                                wx.setStorageSync('phone', res.data.data.user_info.profile.mobile)
                                                                wx.setStorageSync('openId', res.data.openid)
                                                                wx.setStorageSync('im_staff_tid', res.data.data.user_info.profile.im_staff_tid)
                                                                wx.setStorageSync('prompt', true);
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
                                                                    delta: 2
                                                                });
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
                        fail: function(e) {

                        }
                    })
                }
            })
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        // mta
        mta.Page.init()
        var that = this;
        that.setData({
            uid: options.unionid
        })
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
        var phone = app.globalData.phone;
        var num = app.globalData.num;
        this.setData({
            num: num,
            value: phone,
        });
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