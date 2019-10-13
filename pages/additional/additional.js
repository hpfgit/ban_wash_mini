// pages/twoConfirm/twoConfirm.js
var app = getApp();
var mta = require('../../utils/mta_analysis.js')
var meiqiaPlugin = requirePlugin("meiqia");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        openType: "",
        static: app.globalData.statics,
        imgUrl: app.globalData.imgUrl,
        qiniuImgUrl: app.globalData.qiniuImgUrl,
        isVideo: false,
        video: '',
        isAudio: true,
        modal: false,
        log_id: '',
        pay: false,
        yue: false, //控制余额支付
        card: false, //控制洗护卡支付
        wx: true, //控制微信支付



        data: null, //数据
        careLog_goods: null, //洗护的鞋子【商品】信息
        datas: [],
        sendArr: [],
        paymentNum: 0,// 付款项数量
        continueNum: 0,// 拒付项数量
        cancelNum: 0, //取消项数量
        needF: 0, //需付
        actualF: 0, // 实付
        resultF: 0,
        goods: null,
        imgArr: [],
        changeStatus: null,
        modelId: 0,
        modelIndex: 0,
        modelchoose: 0,
        op_info_type: null, //订单状态
        xtra_costs_pay_status: 0 //订单是否支付 
    },
    // 计算付款项数量
    calculationNumber: function (arr) {
        var paymentNum = 0;
        var continueNum = 0;
        var cancelNum = 0;
        arr.forEach(function (item, index) {
            if (item.choose == 1) {
                paymentNum += 1
            }
        });
        arr.forEach(function (item, index) {
            if (item.choose == 2) {
                continueNum += 1
            }
        });
        arr.forEach(function (item, index) {
            if (item.choose == 3) {
                cancelNum += 1
            }
        });
        this.setData({
            paymentNum,
            continueNum,
            cancelNum
        })
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
    // 播放视频
    bofang: function (e) {
        var that = this;
        var videos = that.data.data.careLog_extra_costs;
        var index = e.currentTarget.dataset.index;
        for (var i in videos) {
            if (index == i) {
                that.setData({
                    isVideo: true,
                    video: that.data.imgUrl + videos[i].videos[0]
                })
                this.videoContext1.requestFullScreen({})
            }
        }
    },
    // 退出和进入全屏
    startScreenChange: function (e) {
        var that = this;
        if (e.detail.fullScreen == false) {
            that.setData({
                isVideo: false,
                video: ''
            })
        }
    },
    // 播放语音
    audio: function (e) {
        var that = this;
        var index = e.currentTarget.dataset.index;
        var data = that.data.data;
        var audios = data.careLog_extra_costs;
        if (this.innerAudioContent) {
            this.innerAudioContent.destroy()
        }
        for (var i in data.careLog_extra_costs) {
            data.careLog_extra_costs[i].isAudio = true;
        }
        that.setData({
            data: data,
        })
        for (var i in audios) {
            if (index == i) {
                this.innerAudioContent = wx.createInnerAudioContext();
                var src = that.data.imgUrl + audios[i].audios[0];
                this.innerAudioContent.autoplay = true;
                this.innerAudioContent.src = src;
                this.innerAudioContent.onPlay(() => {
                    audios[index].isAudio = false
                    that.setData({
                        data: data
                    })
                });
                this.innerAudioContent.onEnded(() => {
                    audios[index].isAudio = true
                    that.setData({
                        data: data
                    })
                })
            }
        }
    },
    // 拒绝支付
    falsePay: function () {
        var that = this;
        that.setData({
            modal: true
        })
    },

    // 关闭支付
    closePay: function () {
        var that = this;
        that.setData({
            pay: false
        })
    },
    // 选择支付方式
    select: function (e) {
        var that = this;
        var index = e.currentTarget.dataset.index;
        var data = that.data.data;
        if (index == 1) {
            if (data.order_price > data.user_wallet_last_money) {

            } else {
                that.setData({
                    yue: true,
                    card: false,
                    wx: false,
                })
            }
        } else if (index == 2) {
            if (data.order_price > data.user_carecard_last_money) {

            } else {
                that.setData({
                    yue: false,
                    card: true,
                    wx: false,
                })
            }
        } else if (index == 3) {
            that.setData({
                yue: false,
                card: false,
                wx: true,
            })
        }
    },
    // 确认提交
    truePay: function () {
      console.log(111)
        var goods = this.data.sendArr;
        var is = goods.some(function (item, index) {
            return item.choose == ""
        })
        if (is) {
            // --------------------------------------这里还有待优化----------------------------------------
            console.log("请完成全部确认后再点击提交")
            return
        }


        var that = this;
        app.isToken(
            function goNext() {
                var token = wx.getStorageSync('token');
                // console.log(goods)
                // return
                wx.request({
                    url: app.globalData.url + '/api/care/order/' + that.data.log_id + '/extra_cost/confirm_price',
                    method: 'POST',
                    data: {
                        token: token,
                        goods: goods
                    },
                    success: function (res) {
                        var goods = that.data.sendArr;
                        if (res.data.status == 201) {
                            if (res.data.data.vip_price == 0) {
                                that.setData({
                                    pay: false,
                                })
                                wx.redirectTo({
                                    url: '/pages/track/track?log_id=' + that.data.log_id + '&log_no=' + that.data.data.care_log.log_no + '&order_no=' + that.data.data.order_no,
                                })
                            } else {
                                that.setData({
                                    resultF: res.data.data.vip_price,
                                    // 弹出支付方式
                                    pay: true
                                })
                            }
                        }
                    },
                    fail: function (e) {
                        console.log(e)
                    }
                })
            }
        );
    },
    // 立即支付
    submit: function () {
        var that = this;
        app.isToken(
            function goNext(token) {
                var pay_no = that.data.data.order_patch_pay_no;
                console.log(pay_no)
                if (that.data.yue) {
                    wx.request({
                        url: app.globalData.url + '/api/ext/care/blpay',
                        method: 'POST',
                        data: {
                            token: token,
                            pay_no: pay_no,
                            driver: 'wallet',
                            method: 'pos'
                        },
                        success: function (res) {
                            if (res.data.status == 200) {
                                wx.request({
                                    url: app.globalData.url + '/api/ext/care/order/' + that.data.log_id + '/extra_costs/pay_type',
                                    method: 'PUT',
                                    data: {
                                        token: token,
                                        pay_type: 1
                                    },
                                    success: function (res) {
                                        if (res.data.status == 201) {
                                            wx.showToast({
                                                title: '支付成功',
                                                duration: 1500,
                                                icon: 'none',
                                                mask: true
                                            })
                                            setTimeout(function () {
                                                wx.redirectTo({
                                                    url: '/pages/track/track?log_id=' + that.data.log_id + '&log_no=' + that.data.data.care_log.log_no + '&order_no=' + that.data.data.order_no,
                                                })
                                            }, 1500)
                                        }
                                    },
                                    fail: function (e) {
                                        console.log(e)
                                    }
                                })
                            }
                        },
                        fail: function (e) {
                            console.log(e)
                        }
                    })
                } else if (that.data.card) {
                    wx.request({
                        url: app.globalData.url + '/api/ext/care/blpay',
                        method: 'POST',
                        data: {
                            token: token,
                            pay_no: pay_no,
                            driver: 'carecard',
                            method: 'pos'
                        },
                        success: function (res) {
                            if (res.data.status == 200) {
                                wx.request({
                                    url: app.globalData.url + '/api/ext/care/order/' + that.data.log_id + '/extra_costs/pay_type',
                                    method: 'PUT',
                                    data: {
                                        token: token,
                                        pay_type: 1
                                    },
                                    success: function (res) {
                                        if (res.data.status == 201) {
                                            wx.showToast({
                                                title: '支付成功',
                                                duration: 1500,
                                                icon: 'none',
                                                mask: true
                                            })
                                            setTimeout(function () {
                                                wx.redirectTo({
                                                    url: '/pages/track/track?log_id=' + that.data.log_id + '&log_no=' + that.data.data.care_log.log_no + '&order_no=' + that.data.data.order_no,
                                                })
                                            }, 1500)
                                        }
                                    },
                                    fail: function (e) {
                                        console.log(e)
                                    }
                                })
                            }
                        },
                        fail: function (e) {
                            console.log(e)
                        }
                    })
                } else if (that.data.wx) {
                    that.wxPay();
                }
            }
        );
    },
    // 微信支付
    wxPay: function () {
        var that = this;
        app.isToken(
            function goNext(token) {
                var openId = wx.getStorageSync("openId");
                var param = {
                    token: token,
                    driver: 'wechat',
                    method: 'miniapp',
                    openid: openId,
                    miniapp_name: 'care',
                    pay_no: that.data.data.order_patch_pay_no
                }
                wx.request({
                    url: app.globalData.url + '/api/payment/pay',
                    method: 'POST',
                    data: param,
                    success: function (res) {
                        wx.requestPayment({
                            timeStamp: res.data.data.pay_info.timeStamp,
                            nonceStr: res.data.data.pay_info.nonceStr,
                            package: res.data.data.pay_info.package,
                            signType: res.data.data.pay_info.signType,
                            paySign: res.data.data.pay_info.paySign,
                            success: function (res) {
                                if (res.errMsg == 'requestPayment:ok') {
                                    wx.request({
                                        url: app.globalData.url + '/api/ext/care/order/' + that.data.log_id + '/extra_costs/pay_type',
                                        method: 'PUT',
                                        data: {
                                            token: token,
                                            pay_type: 1
                                        },
                                        success: function (res) {
                                            if (res.data.status == 201) {
                                                wx.redirectTo({
                                                    url: '/pages/track/track?log_id=' + that.data.log_id + '&log_no=' + that.data.data.care_log.log_no + '&order_no=' + that.data.data.order_no,
                                                })
                                            }
                                        },
                                        fail: function (e) {
                                            console.log(e)
                                        }
                                    })
                                }
                            },
                            fail: function (e) {
                                if (e.errMsg == 'requestPayment:fail cancel') {
                                    wx.showToast({
                                        title: '取消支付',
                                        duration: 1500,
                                        icon: 'none',
                                        mask: true
                                    })
                                }
                            }
                        })
                    },
                    fail: function (e) {
                        console.log(e)
                    }
                })
            }
        )
    },
    // 关闭模态窗
    close: function () {
        var that = this;
        that.setData({
            modal: false,
            changeStatus: false
        })
    },
    // 弹出框确认按钮
    changeStatus() {
        // 商品列表
        var { sendArr, careLog_goods, changeStatus, modelId, modelIndex, modelchoose } = this.data;
        changeStatus = true;
        var obj = {};
        obj.choose = modelchoose;
        obj.id = modelId;
        sendArr[modelIndex] = obj;
        this.calculationNumber(sendArr)
        var goods = [];
        for (let i = 0; i < sendArr.length; i++) {
            if (sendArr[i].choose == 1) {
                var obj = {};
                obj.id = sendArr[i].id;
                goods.push(obj)
            }
        }
        this.setData({
            sendArr,
            goods
        })
        // 请求价格
        var that = this;
        that.getMoney(goods)

        this.setData({
            modal: false,
            changeStatus
        })
    },
    modelShow(id, index, choose) {
        this.setData({
            modal: true,
            modelId: id,
            modelIndex: index,
            modelchoose: choose
        })
    },


    // 确认付款
    confirm: function (e) {
        // 商品列表
        var { sendArr, careLog_goods } = this.data;
        var obj = {};
        // 选择的哪一项
        var index = e.currentTarget.dataset.index;
        // 订单ID
        var id = careLog_goods[index].id;
        // 状态
        var choose = e.currentTarget.dataset.choose;
        obj.choose = choose;
        obj.id = id;
        sendArr[index] = obj;
        this.calculationNumber(sendArr)
        var goods = [];
        for (let i = 0; i < sendArr.length; i++) {
            if (sendArr[i].choose == 1) {
                var obj = {};
                obj.id = sendArr[i].id;
                goods.push(obj)
            }
        }
        this.setData({
            sendArr,
            goods
        })
        // 请求价格
        var that = this;
        that.getMoney(goods)
    },
    // 拒绝支付，继续进行原项目
    continue: function (e) {
        // 商品列表
        var { sendArr, careLog_goods } = this.data;
        var obj = {};
        // 选择的哪一项
        var index = e.currentTarget.dataset.index;
        // 订单ID
        var id = careLog_goods[index].id;
        // 状态
        var choose = e.currentTarget.dataset.choose;
        this.modelShow(id, index, choose)
    },
    // 拒绝支付，退款并取消订单
    cancel: function (e) {
        // 商品列表
        var { sendArr, careLog_goods } = this.data;
        var obj = {};
        // 选择的哪一项
        var index = e.currentTarget.dataset.index;
        // 订单ID
        var id = careLog_goods[index].id;
        // 状态
        var choose = e.currentTarget.dataset.choose;
        this.modelShow(id, index, choose)
    },
    // 获取乱七八糟数据
    getDatas: function (id) {
        var that = this;
        app.isToken(
            function goNext(token) {
                wx.request({
                    url: app.globalData.url + '/api/ext/care/order/' + id + '/helporder',
                    method: 'GET',
                    data: {
                        token: token
                    },
                    success: function (res) {
                        var datas = res.data.data;
                        // console.log("乱七八糟", datas)
                        datas.order_price = Number(datas.order_price)
                        datas.user_wallet_last_money = Number(datas.user_wallet_last_money)
                        datas.user_carecard_last_money = Number(datas.user_carecard_last_money)
                        that.setData({
                            datas: datas
                        })
                    },
                    fail: function (e) {
                        console.log(e)
                    }
                })
            }
        );
    },


    // 获取数据
    getData: function () {
        var that = this;
        app.isToken(
            function goNext() {
                var token = wx.getStorageSync('token');
                wx.request({
                    url: app.globalData.url + '/api/care/order/' + that.data.log_id + '/detail/only_extra_cost_goods',
                    method: 'GET',
                    data: {
                        token: token
                    },
                    success: function (res) {
                        console.log(res.data)
                        var data = res.data.data;
                        var sendArr = that.data.sendArr;
                        var imgArr = that.data.imgArr;
                        // console.log("数据", data)
                        // 获取图片放大数组
                        for (let i = 0; i < data.careLog_goods.length; i++) {
                            var imgs = [];
                            for (let j = 0; j < data.careLog_goods[i].extra_costs.length; j++) {
                                var itemArr = [];
                                for (let k = 0; k < data.careLog_goods[i].extra_costs[j].images.length; k++) {
                                    itemArr[k] = that.data.imgUrl + data.careLog_goods[i].extra_costs[j].images[k]
                                }
                                imgs.push(itemArr)
                            }
                            imgArr.push(imgs)
                        }
                        if (that.data.extra_costs_pay_status != 0 ){
                            // 说明订单已经二次确认过了过了
                            for (let i = 0; i < data.careLog_goods.length; i++) {
                                var obj = {};
                                obj.choose = data.careLog_goods[i].extra_costs_pay_status;
                                obj.id = data.careLog_goods[i].id;
                                sendArr.push(obj)
                            }

                        }else {
                            // 订单未确认
                            for (let i = 0; i < data.careLog_goods.length; i++) {
                                var obj = {};
                                obj.choose = "";
                                obj.id = data.careLog_goods[i].id;
                                sendArr.push(obj)
                            }
                        }
                        that.calculationNumber(sendArr)
                        var goods = [];
                        for (let i = 0; i < sendArr.length; i++) {
                            if (sendArr[i].choose == 1) {
                                var obj = {};
                                obj.id = sendArr[i].id;
                                goods.push(obj)
                            }
                        }
                        that.getMoney(goods)
                        that.setData({
                            data: data,
                            sendArr,
                            imgArr,
                            goods,
                            careLog_goods: data.careLog_goods
                        })
                    },
                    fail: function (e) {
                        console.log(e)
                    }
                })
            }
        );
    },
    // 请求需付与实付价格
    getMoney: function (goods) {
        var that = this;
        app.isToken(
            function goNext() {
                var token = wx.getStorageSync('token');
                wx.request({
                    url: app.globalData.url + '/api/care/order/' + that.data.log_id + '/extra_cost/calc_price',
                    method: 'POST',
                    data: {
                        goods: goods,
                        token: token
                    },
                    success: function (res) {
                        if (goods.length == 0) {
                            that.setData({
                                needF: 0,
                                actualF: 0
                            })
                        } else {
                            that.setData({
                                needF: res.data.data.price,
                                actualF: res.data.data.vip_price
                            })
                        }
                    },
                    fail: function (e) {
                        console.log(e)
                    }
                })
            }
        );
    },
    bigImg(e) {
        var arr = [];
        arr.push(e.currentTarget.dataset.url)
        wx.previewImage({
            current: e.currentTarget.dataset.url,
            urls: arr
        })
    },
    itemBigImg(e) {
        var imgArr = this.data.imgArr;
        var index = e.currentTarget.dataset.index;
        var itemIndex = e.currentTarget.dataset.itemindex;
        var imgIndex = e.currentTarget.dataset.imgindex;
        wx.previewImage({
            current: imgArr[index][itemIndex][imgIndex],
            urls: imgArr[index][itemIndex],
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var log_id = options.log_id;
        var extra_costs_pay_status = options.extra_costs_pay_status;
        // mta
        mta.Page.init()
        var that = this;
        that.setData({
            // log_id: "3909"
            log_id,
            extra_costs_pay_status
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        var that = this;
        that.getData();
        that.setData({
            openType: app.globalData.openType
        })
        that.getDatas(that.data.log_id)
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})