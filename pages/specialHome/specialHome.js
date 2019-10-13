// page/specialHome/specialHome.js
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
        data: [{
                text: '去油处理'
            },
            {
                text: '串色处理'
            },
            {
                text: '发黄去氧化'
            },
            {
                text: '破洞织补'
            },
            {
                text: '内衬更换'
            },
            {
                text: '防水处理'
            },
            {
                text: '球鞋贴底'
            },
            {
                text: '上油护理'
            },
            {
                text: '鞋面破损修复'
            },
            {
                text: '中底爆漆修复'
            },
            {
                text: '粘胶修复0溢胶'
            },
            {
                text: '翻皮毛/绒皮补色'
            },
        ],
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
    // 自助下单
    xiadan: function() {
        var that = this;
        app.isToken(
            function goNext() {
                wx.navigateTo({
                    url: '/pages/specialOrder/specialOrder',
                })
            }
        );
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
      app.cleanCouponArr();
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