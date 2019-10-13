// page/repairCan/repairCan.js
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
        log_no: '',
        num: 0,

        user_info: [],
        order_info: [],
        order_type: '',
        service1: [],
        service2: [],
        service3: [],
        service4: [],
        service5: [],
        bigService: [],
        price: [],
        callback: [],
        total: 0,
        no1: 1,
        no2: 2,
        no3: 3,
        no4: 4,
        no5: 5,
        platform_advise: "" // 修复建议
    },
    // 获取token
    getToken: function() {
        var that = this;
        app.isToken(
            function goNext() {
                wx.navigateTo({
                    url: '/pages/mine/mine',
                })
            }
        );
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
                            user_info: res.data.data.user_info,
                        })
                    }
                })
            }
        );
    },
    // 获取数据
    getService: function() {
        var that = this;
        app.isToken(
            function goNext() {
                var token = wx.getStorageSync('token');
                var num = 0;
                wx.request({
                    url: app.globalData.url + '/api/ext/care/log/' + that.data.log_no + '/plan',
                    method: 'GET',
                    data: {
                        token: token
                    },
                    success: function(res) {
                        var plan = res.data.data.plan;
                        var platform_advise = res.data.data.order_info.platform_advise;
                        var bigService = that.data.bigService;
                        console.log(res.data)
                        for (var i in plan) {
                            if (plan[i].server_service_id == 1) {
                                var service1 = that.data.service1;
                                service1.push(plan[i]);
                                that.setData({
                                    service1: service1
                                })
                            }
                            if (plan[i].server_service_id == 2) {
                                var service2 = that.data.service2;
                                service2.push(plan[i]);
                                that.setData({
                                    service2: service2
                                })
                            }
                            if (plan[i].server_service_id == 3) {
                                var service3 = that.data.service3;
                                service3.push(plan[i]);
                                that.setData({
                                    service3: service3
                                })
                            }
                            if (plan[i].server_service_id == 4) {
                                var service4 = that.data.service4;
                                service4.push(plan[i]);
                                that.setData({
                                    service4: service4
                                })
                            }
                            if (plan[i].server_service_id == 5) {
                                var service5 = that.data.service5;
                                service5.push(plan[i]);
                                that.setData({
                                    service5: service5
                                })
                            }
                        }
                        if (that.data.service1 != '') {
                            bigService.push(that.data.service1)
                        }
                        if (that.data.service2 != '') {
                            bigService.push(that.data.service2)
                        }
                        if (that.data.service3 != '') {
                            bigService.push(that.data.service3)
                        }
                        if (that.data.service4 != '') {
                            bigService.push(that.data.service4)
                        }
                        if (that.data.service5 != '') {
                            bigService.push(that.data.service5)
                        }
                        // 修改第一项的状态
                        for (let i = 0; i < bigService.length; i++) {
                            for (let j = 0; j < bigService[i].length; j++) {
                                if (bigService[i][j].server_service_id == 1) {
                                    bigService[i][j].checked = true
                                    bigService[i][j].checkeds = true
                                    that.setData({
                                      num: 1
                                    })
                                  that.getPrice()
                                }
                            }
                        }
                      console.log(bigService)

                        // 更新数据
                        that.setData({
                            order_info: res.data.data.order_info,
                            bigService: bigService,
                            platform_advise
                        });
                    },
                    fail: function(e) {
                        console.log(e)
                    }
                })
            }
        );
    },
    // 全选择/取消
    choose: function(e) {
        var that = this;
        var bigService = that.data.bigService;
        var ins = e.currentTarget.dataset.ins;
        var inx = e.currentTarget.dataset.inx;
        for (var i in bigService) {
            if (ins == i) {
                if (bigService[i][0].checkeds == true) {
                    for (var j in bigService[i]) {
                        bigService[i][j].checked = false;
                    }
                    bigService[i][0].checkeds = false
                } else {
                    for (var j in bigService[i]) {
                        bigService[i][j].checked = true;
                    }
                    bigService[i][0].checkeds = true
                }
            }
        }
        that.setData({
            bigService: bigService
        })
        that.getPrice()
    },
    // 单选
    single: function(e) {
        var that = this;
        var bigService = that.data.bigService;
        var ins = e.currentTarget.dataset.ins;
        var index = e.currentTarget.dataset.index;
        var num = 0;
        // if(ins == 0) {
        //     return
        // }
        for (var i in bigService) {
            if (i == ins) {
                for (var j in bigService[i]) {
                    if (bigService[i][j].server_service_id != 2 && bigService[i][j].server_service_id != 3) {
                      if (bigService[i][j].server_service_id == 1) {
                        if (index == j) {
                          bigService[i][j].checked = true
                        }
                      }else {
                        if (index == j) {
                          if (bigService[i][j].checked == true) {
                            bigService[i][j].checked = false
                          } else {
                            bigService[i][j].checked = true
                          }
                        }
                      }
                    }else {
                        if (bigService[i][j].checked == true) {
                            bigService[i][j].checked = false
                        } else {
                            bigService[i][j].checked = true
                        }
                    }
                }
            }
        }
        for (var i in bigService) {
            if (ins == i) {
                for (var j in bigService[i]) {
                    if (bigService[i][j].checked) {
                        num += 1
                    }
                }
                if (bigService[i].length == num) {
                    for (var j in bigService[i]) {
                        bigService[i][j].checkeds = true
                    }
                } else {
                    for (var j in bigService[i]) {
                        bigService[i][j].checkeds = false
                    }
                }
            }
        }
        that.setData({
            bigService: bigService
        })
        that.getPrice()
    },
    // 计算价格
    getPrice: function() {
        var that = this;
        var price = [];
        app.isToken(
            function goNext() {
                var token = wx.getStorageSync('token');
                var bigService = that.data.bigService;
                var a = 0;
                var b = 0;
                var c = 0;
                var d = 0;
                var e = 0;
                for (var i in bigService) {
                    if (i == 0) {
                        for (var j in bigService[i]) {
                            if (bigService[i][j].checked == true) {
                                var nnn = {
                                    service_id: bigService[i][j].service_id,
                                    item_id: bigService[i][j].item_id
                                }
                                price.push(nnn)
                                a = 1;
                            }
                        }
                    }
                    if (i == 1) {
                        for (var j in bigService[i]) {
                            if (bigService[i][j].checked == true) {
                                var nnn = {
                                    service_id: bigService[i][j].service_id,
                                    item_id: bigService[i][j].item_id
                                }
                                price.push(nnn)
                                b = 1;
                            }
                        }
                    }
                    if (i == 2) {
                        for (var j in bigService[i]) {
                            if (bigService[i][j].checked == true) {
                                var nnn = {
                                    service_id: bigService[i][j].service_id,
                                    item_id: bigService[i][j].item_id
                                }
                                price.push(nnn)
                                c = 1;
                            }
                        }
                    }
                    if (i == 3) {
                        for (var j in bigService[i]) {
                            if (bigService[i][j].checked == true) {
                                var nnn = {
                                    service_id: bigService[i][j].service_id,
                                    item_id: bigService[i][j].item_id
                                }
                                price.push(nnn)
                                d = 1;
                            }
                        }
                    }
                    if (i == 4) {
                        for (var j in bigService[i]) {
                            if (bigService[i][j].checked == true) {
                                var nnn = {
                                    service_id: bigService[i][j].service_id,
                                    item_id: bigService[i][j].item_id
                                }
                                price.push(nnn)
                                e = 1;
                            }
                        }
                    }
                }
                var num = a + b + c + d + e;
                if (price != '') {
                    wx.request({
                        url: app.globalData.url + '/api/ext/care/item/' + that.data.log_no + '/price',
                        method: 'POST',
                        data: {
                            token: token,
                            items: price
                        },
                        success: function(res) {
                            that.setData({
                                price: price,
                                callback: res.data.data,
                                num: num
                            })
                        },
                        fail: function(e) {
                            console.log(e)
                        }
                    })
                } else {
                    that.setData({
                        callback: 0.0,
                        num: 0
                    })
                }
            }
        );

    },
    // 提交订单
    submit: function() {
        var that = this;
        app.isToken(
            function goNext() {
                var token = wx.getStorageSync('token');
                var bigService = that.data.bigService;
                var buy_item = [];
                for (var i in bigService) {
                    for (var j in bigService[i]) {
                        if (bigService[i][j].checked == true) {
                            var nnn = {
                                server_service_name: bigService[i][j].server_service_name,
                                server_service_id: bigService[i][j].server_service_id,
                                service_id: bigService[i][j].service_id,
                                service_name: bigService[i][j].service_name,
                                item_id: bigService[i][j].item_id,
                                item_name: bigService[i][j].item_name,
                                number: bigService[i][j].number
                            }
                            buy_item.push(nnn)
                        }
                    }
                }
                if (buy_item != '') {
                    wx.request({
                        url: app.globalData.url + '/api/ext/care/order/user/buy_items',
                        method: "POST",
                        data: {
                            token: token,
                            order_type: that.data.order_type,
                            log_no: that.data.log_no,
                            material: that.data.order_info.goods_material,
                            buy_item: buy_item
                        },
                        success: function(res) {
                            if (res.data.status == 201) {
                                var log_id = res.data.data.log_id;
                                wx.redirectTo({
                                    url: '/pages/publicOrder/publicOrder?module=1&log_id=' + log_id,
                                })
                            }
                        },
                        fail: function(e) {
                            console.log(e)
                        }
                    })
                } else {
                    wx.showToast({
                        title: '请至少选择一项服务',
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
        that.setData({
            log_no: options.log_no,
            order_type: options.order_type
        })
        // that.getToken();
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
        that.getService();
        that.getUser();
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