// page/memberCard/memberCard.js
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
var meiqiaPlugin = requirePlugin("meiqia");

var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        openType: "",
        static: app.globalData.statics,
        currentTab: 0,
        data: [{
                money: '300元',
                text: '赠送星会员'
            },
            {
                money: '500元',
                text: '赠送黄金会员'
            },
            {
                money: '1000元',
                text: '赠送铂金会员'
            },
            {
                money: '2000元',
                text: '赠送砖石会员'
            },
            {
                money: '自定义',
                text: '50-5000元'
            },
        ],
        winHeight: '',
        submitName: '充值',
        customRecharge: '', //充值自定义价钱
        customCard: '', //洗护卡自定义价钱
        user_info: [], //用户信息
        tixing: app.globalData.tixing, //监听消息
        interval: '', //定时器
        animationKefu: {},
        // 网易云信
        errorMessage: '', // 显示错误提示信息
        transports: ['websocket'], //传输方式
        isLogin: false, // 登录状态
        account: '', // 用户输入账号
        password: '', //用户输入密码
        kefuId: 'bu-0000000176',
    },
    // 客服
    kefu: function () {
        var that = this;
        app.isToken(
            function goNext(token) {
                if (token == "") {
                    wx.navigateTo({
                        url: '/pages/mine/mine',
                    })
                    return
                }
                // 设置美洽信息
                var params = {
                    // 成功回调
                    success: function () {
                        // wx.showToast({
                        //     title: '设置顾客信息成功',
                        // });
                    },
                    // 失败回调
                    fail: function (res) {
                        // wx.showToast({
                        //     title: '设置失败：' + res.toString(),
                        // });
                    }
                };
                // 用户信息：可以设置用户的一些基本信息
                var obj = JSON.parse(wx.getStorageSync("user_info"));
                // console.log(obj)
                var address = obj.province
                var gender = isgender(obj.gender)
                function isgender(val) {
                    if (val == 0) {
                        return "未知"
                    } else if (val == 1) {
                        return "男"
                    } else {
                        return "女"
                    }
                }
                var name = obj.nickName
                let user_info = {
                    address, // 地址
                    gender, // 性别
                    name,// 名字
                    avatar: obj.avatarUrl, // 头像
                    tel: wx.getStorageSync("phone"), // 电话
                    "用户ID": wx.getStorageSync("userid"),
                    "来源": "洗护小程序"

                };
                // 位置信息
                let location_info = {
                    country: obj.country,
                    province: obj.province
                };
                // 客服指定分配信息
                let agent_info = {
                    agent_token: '', // 指定分配客服的 token，可以在 工作台设置 - ID查询 中查看
                    group_token: '', // 指定分配分组的 token，可以在 工作台设置 - ID查询 中查看
                    fallback: 3 // 指定分配客服不在线时候的处理情况：1 指定分配客服不在线，则发送留言；2 指定分配客服不在线，分配给组内的人，分配失败，则发送留言；3 指定分配客服不在线，分配给企业随机一个人，分配失败，则发送留言；
                };
                params.user_info = user_info;
                params.agent_info = agent_info;
                params.location_info = location_info;
                // 美洽企业ID 
                params.ent_id = '134989';
                // 小程序 token
                params.token = 'KCKsXREmWnZoQMwr';
                // 小程序 AppID
                params.app_id = 'wx51cb4be4ce4967e6';
                // 用户 openId
                params.open_id = wx.getStorageSync("openId");
                // 调用接口
                meiqiaPlugin.setClientInfo(params);
            }
        )
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
    // tab切换
    bindChange: function(e) {
        var that = this;
        that.setData({
            currentTab: e.detail.current
        });
        if (that.data.currentTab == 0) {
            var data = that.data.data;
            var len = data.length;
            var num = Math.ceil(len / 3);
            var nums = num * 120 + num * 22 + 58;
            that.setData({
                winHeight: nums,
                submitName: '充值'
            })
        } else if (that.data.currentTab == 1) {
            var data = that.data.data;
            var len = data.length;
            var num = Math.ceil(len / 3);
            var nums = num * 120 + num * 22 + 58 + 58;
            that.setData({
                winHeight: nums,
                submitName: '购买'
            })
        }
    },
    swichNav: function(e) {
        var that = this;
        if (this.data.currentTab === e.target.dataset.current) {
            return false;
        } else {
            that.setData({
                currentTab: e.target.dataset.current
            })
        }
    },
    // 获取数据
    getData: function() {
        var that = this;
        app.isToken(
            function goNext() {
                var token = wx.getStorageSync('token');
                wx.request({
                    url: app.globalData.url + '/api/ext/care/cards',
                    method: "GET",
                    data: {
                        token: token
                    },
                    success: function(res) {
                        that.setData({
                            data: res.data.data
                        })
                    },
                    fail: function(e) {
                        console.log(e)
                    }
                })
            }
        );
    },
    // 点击选择价格
    choose: function(e) {
        var that = this;
        var index = e.currentTarget.dataset.index;
        var data = that.data.data;
        for (var i in data) {
            if (i == index) {
                if (that.data.currentTab == 0) {
                    data[i].recharge = true;
                } else if (that.data.currentTab == 1) {
                    data[i].card = true;
                }
            } else {
                if (that.data.currentTab == 0) {
                    data[i].recharge = false;
                } else if (that.data.currentTab == 1) {
                    data[i].card = false;
                }
            }
        };
        that.setData({
            data: data
        })
    },
    // 账户充值自定义价格
    customRecharge: function(e) {
        var that = this;
        var custom = e.detail.value - 0;
        that.setData({
            customRecharge: custom
        })
    },
    // 电子洗护卡自定义价格
    customCard: function(e) {
        var that = this;
        var custom = e.detail.value - 0;
        that.setData({
            customCard: custom
        })
    },
    // submit
    submit: function() {
        var that = this;
        var data = that.data.data;
        var customRecharge = that.data.customRecharge;
        var customCard = that.data.customCard;
        if (that.data.currentTab == 0) {
            for (var i in data) {
                if (data[i].recharge == true && data[i].id == 5) {
                    var money = parseInt(customRecharge);
                    if (5000 >= money && money >= 50) {
                        var card_id = data[i].id;
                        wx.navigateTo({
                            url: '/pages/memberOrder/memberOrder?currentTab=' + that.data.currentTab + '&card_id=' + card_id + '&money=' + money,
                        })
                    } else {
                        wx.showToast({
                            title: '只能自定义50-5000间金额',
                            duration: 1500,
                            icon: 'none',
                            mask: true
                        })
                    }
                } else if (data[i].recharge == true) {
                    var card_id = data[i].id;
                    var money = data[i].price
                    wx.navigateTo({
                        url: '/pages/memberOrder/memberOrder?currentTab=' + that.data.currentTab + '&card_id=' + card_id + '&money=' + money,
                    })
                } else if (data[0].recharge != true && data[1].recharge != true && data[2].recharge != true && data[3].recharge != true && data[4].recharge != true) {
                    wx.showToast({
                        title: '请选择存值金额',
                        duration: 1500,
                        icon: "none",
                        mask: true
                    })
                }
            }
        } else if (that.data.currentTab == 1) {
            for (var i in data) {
                if (data[i].card == true && data[i].id == 5) {
                    var money = parseInt(customCard);
                    if (5000 >= money && money >= 50) {
                        var card_id = data[i].id;
                        wx.navigateTo({
                            url: '/pages/memberOrder/memberOrder?currentTab=' + that.data.currentTab + '&card_id=' + card_id + '&money=' + money,
                        })
                    } else {
                        wx.showToast({
                            title: '只能自定义50-5000间金额',
                            duration: 1500,
                            icon: 'none',
                            mask: true
                        })
                    }
                } else if (data[i].card == true) {
                    var card_id = data[i].id;
                    var money = data[i].price
                    wx.navigateTo({
                        url: '/pages/memberOrder/memberOrder?currentTab=' + that.data.currentTab + '&card_id=' + card_id + '&money=' + money,
                    })
                } else if (data[0].card != true && data[1].card != true && data[2].card != true && data[3].card != true && data[4].card != true) {
                    wx.showToast({
                        title: '请选择洗护卡金额',
                        duration: 1500,
                        icon: "none",
                        mask: true
                    })
                }
            }
        }
        // wx.navigateTo({
        //     url: '/pages/memberOrder/memberOrder',
        // })
    },
    // 领用与赠送
    goCollar: function() {
        wx.navigateTo({
            url: '/pages/collarGive/collarGive',
        })
    },
    // 洗护卡订单
    goCareCardOrder: function() {
        wx.navigateTo({
            url: '/pages/careCardOrder/careCardOrder',
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        // mta
        mta.Page.init()
        var that = this;
        var data = that.data.data;
        var len = data.length;
        var num = Math.ceil(len / 3);
        var nums = num * 120 + num * 22 + 58;
        that.setData({
            winHeight: nums
        });
        that.getData();
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
        var that = this;
        that.setData({
            openType: app.globalData.openType
        })
        that.getData();
        that.getUser();
        // 客服消息监控
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