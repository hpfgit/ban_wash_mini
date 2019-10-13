// page/memberOrder/memberOrder.js
var mta = require('../../utils/mta_analysis.js')
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        static: app.globalData.statics,
        checked: true, //是否同意洗护卡章程
        click: false, //支付按钮是否可以点击
        modal: false, //提醒模态框
        user_info: [], //用户信息
        type: 0, //充值类型名字
        typeMoney: '', // 充值类型金额
        typeId: '', //充值类型ID
        trueName: '', //用户真实姓名
        id_card: '', //身份证号
    },
    // 获取会员详情
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
                            user_info: res.data.data.user_info,
                            trueName: res.data.data.user_info.truename,
                            id_card: res.data.data.user_info.id_card
                        });
                    },
                    fail: function(e) {
                        console.log(e)
                    }
                })
            }
        );
    },
    // 模态框
    modal: function() {
        var that = this;
        if (that.data.modal == true) {
            that.setData({
                modal: false
            })
        } else {
            that.setData({
                modal: true
            })
        }
    },
    // 隐藏模态框
    hide: function() {
        var that = this;
        that.setData({
            modal: false
        })
    },
    // 同意洗护章程
    radioChange: function() {
        var that = this;
        var checked = that.data.checked;
        if (checked == false) {
            that.setData({
                checked: true,
                click: false
            })
        } else {
            that.setData({
                checked: false,
                click: true
            })
        }
    },
    // 用户真实姓名
    trueName: function(e) {
        var that = this;
        that.setData({
            trueName: e.detail.value
        })
    },
    // 身份证号
    idcard: function(e) {
        var that = this;
        that.setData({
            id_card: e.detail.value
        })
    },
    // 支付
    submit: function() {
        var that = this;
        app.isToken(
            function goNext() {
                var token = wx.getStorageSync('token');
                var openId = wx.getStorageSync('openId')
                var card_id = that.data.typeId;
                var money = that.data.typeMoney;
                if (that.data.type == 0) {
                    if (that.data.trueName == '') {
                        wx.showToast({
                            title: '请输入真实姓名',
                            duration: 1500,
                            icon: 'none',
                            mask: true
                        })
                    } else {
                        var trueName = that.data.trueName;
                        if (that.data.id_card == '') {
                            wx.showToast({
                                title: '请输入正确的身份证号',
                                duration: 1500,
                                icon: 'none',
                                mask: true
                            })
                        } else {
                            var id_card = that.data.id_card
                            var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
                            if (reg.test(id_card) === false) {
                                wx.showToast({
                                    title: '身份证验证未通过',
                                    duration: 1500,
                                    icon: 'none',
                                    mask: true
                                })
                            } else {
                                var param = {
                                    token: token,
                                    card_id: card_id,
                                    money: money,
                                    truename: trueName,
                                    id_card: id_card
                                }
                                wx.request({
                                    url: app.globalData.url + '/api/ext/care/card/user/recharge',
                                    method: 'POST',
                                    data: param,
                                    success: function(res) {
                                        if (res.data.status == 201) {
                                            var recharge_id = res.data.data.id;
                                            var param = {
                                                token: token,
                                                driver: 'wechat',
                                                method: 'miniapp',
                                                pay_no: res.data.data.pay_no,
                                                openid: openId,
                                                miniapp_name: 'care'
                                            }
                                            wx.request({
                                                url: app.globalData.url + '/api/payment/pay',
                                                method: 'POST',
                                                data: param,
                                                success: function(res) {
                                                    wx.requestPayment({
                                                        timeStamp: res.data.data.pay_info.timeStamp,
                                                        nonceStr: res.data.data.pay_info.nonceStr,
                                                        package: res.data.data.pay_info.package,
                                                        signType: res.data.data.pay_info.signType,
                                                        paySign: res.data.data.pay_info.paySign,
                                                        success: function(res) {
                                                            if (res.errMsg == 'requestPayment:ok') {
                                                                wx.request({
                                                                    url: app.globalData.url + '/api/ext/care/card/user/order_status',
                                                                    method: 'PUT',
                                                                    data: {
                                                                        token: token,
                                                                        recharge_id: recharge_id,
                                                                        pay_type: 2
                                                                    },
                                                                    success: function(res) {
                                                                        if (res.data.status == 201) {
                                                                            setTimeout(function() {
                                                                                wx.redirectTo({
                                                                                    url: '/pages/careCardOrder/careCardOrder'
                                                                                })
                                                                            }, 1500)
                                                                        }
                                                                    },
                                                                    fail: function(e) {
                                                                        console.log(e)
                                                                    }
                                                                })
                                                            }
                                                        },
                                                        fail: function(e) {
                                                            if (e.errMsg == 'requestPayment:fail cancel') {
                                                                wx.navigateBack({
                                                                    delta: 1
                                                                })
                                                            }
                                                        }
                                                    })
                                                },
                                                fail: function(e) {
                                                    console.log(e)
                                                }
                                            })
                                        }
                                    },
                                    fail: function(e) {
                                        console.log(e)
                                    }
                                })
                            }
                        }
                    }
                } else if (that.data.type == 1) {
                    if (that.data.trueName == '') {
                        wx.showToast({
                            title: '请输入真实姓名',
                            duration: 1500,
                            icon: 'none',
                            mask: true
                        })
                    } else {
                        var trueName = that.data.trueName;

                        if (that.data.id_card == '') {
                            wx.showToast({
                                title: '请输入正确的身份证号',
                                duration: 1500,
                                icon: 'none',
                                mask: true
                            })
                        } else {
                            var id_card = that.data.id_card
                            var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
                            if (reg.test(id_card) === false) {
                                wx.showToast({
                                    title: '身份证验证未通过',
                                    duration: 1500,
                                    icon: 'none',
                                    mask: true
                                })
                            } else {
                                var param = {
                                    token: token,
                                    card_id: card_id,
                                    money: money,
                                    truename: trueName,
                                    id_card: id_card
                                }
                                wx.request({
                                    url: app.globalData.url + '/api/ext/care/card/user/buy_card',
                                    method: 'POST',
                                    data: param,
                                    success: function(res) {
                                        if (res.data.status == 201) {
                                            var recharge_id = res.data.data.id;
                                            var param = {
                                                token: token,
                                                driver: 'wechat',
                                                method: 'miniapp',
                                                pay_no: res.data.data.pay_no,
                                                openid: openId,
                                                miniapp_name: 'care'
                                            }
                                            wx.request({
                                                url: app.globalData.url + '/api/payment/pay',
                                                method: 'POST',
                                                data: param,
                                                success: function(res) {
                                                    wx.requestPayment({
                                                        timeStamp: res.data.data.pay_info.timeStamp,
                                                        nonceStr: res.data.data.pay_info.nonceStr,
                                                        package: res.data.data.pay_info.package,
                                                        signType: res.data.data.pay_info.signType,
                                                        paySign: res.data.data.pay_info.paySign,
                                                        success: function(res) {
                                                            if (res.errMsg == 'requestPayment:ok') {
                                                                wx.request({
                                                                    url: app.globalData.url + '/api/ext/care/card/user/order_status',
                                                                    method: 'PUT',
                                                                    data: {
                                                                        token: token,
                                                                        recharge_id: recharge_id,
                                                                        pay_type: 2
                                                                    },
                                                                    success: function(res) {
                                                                        if (res.data.status == 201) {
                                                                            setTimeout(function() {
                                                                                wx.redirectTo({
                                                                                    url: '/pages/careCardOrder/careCardOrder'
                                                                                })
                                                                            }, 1500)
                                                                        }
                                                                    },
                                                                    fail: function(e) {
                                                                        console.log(e)
                                                                    }
                                                                })
                                                            }
                                                        },
                                                        fail: function(e) {
                                                            if (e.errMsg == 'requestPayment:fail cancel') {
                                                                wx.navigateBack({
                                                                    delta: 1
                                                                })
                                                            }
                                                        }
                                                    })
                                                },
                                                fail: function(e) {
                                                    console.log(e)
                                                }
                                            })
                                        }
                                    },
                                    fail: function(e) {
                                        console.log(e)
                                    }
                                })
                            }
                        }
                    }
                }
            }
        );
    },
    // 洗护卡章程
    goZhangcheng: function() {
        wx.navigateTo({
            url: '/pages/constitution/constitution',
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        // mta
        mta.Page.init()
        var that = this;
        // 设置充值类型名字、金额、ID
        if (options.currentTab == 0) {
            that.setData({
                type: 0,
                typeMoney: options.money,
                typeId: options.card_id
            })
        } else if (options.currentTab == 1) {
            that.setData({
                type: 1,
                typeMoney: options.money,
                typeId: options.card_id
            })
        }
        // 获取用户信息
        that.getUser();
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