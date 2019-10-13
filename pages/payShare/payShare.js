// pages/payShare/payShare.js
var mta = require('../../utils/mta_analysis.js')
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        imgUrl: app.globalData.imgUrl,
        static: app.globalData.statics,
        qiniuImgUrl: app.globalData.qiniuImgUrl,
        state: 1,
        draw: false,
        Doubling: false,
        success: false,
        indexSelect: 0, //被选中的奖品index
        isRunning: false, //是否正在抽奖
        imageAward: [
            '{{static}}/1.jpg',
            '{{static}}/2.jpg',
            '{{static}}/3.jpg',
            '{{static}}/4.jpg',
            '{{static}}/5.jpg',
            '{{static}}/6.jpg',
        ],
        log_id: '',
        order_id: '',
        animationGrade: {},
        shopArr: [], //服务数据
        left_image: '', //左侧图
        server_name: [], //服务名称数组
        data: [], //存放数据
        time: '', //倒计时
        priceInfo: [], //奖品信息及中奖信息
        coupons: [], //翻倍洗护券
        more: false, //判断是否抽过该订单
        pay_no: ''
    },
    // 获取服务信息
    getServer: function(log_id) {
        var that = this;
        wx.request({
            url: app.globalData.url + '/api/ext/care/order/' + log_id + '/helporder/countinfo',
            method: 'GET',
            data: {},
            success: function(res) {
                var data = res.data.data.goods;
                var name = [];
                for (var i in data) {
                    if (i == 0) {
                        for (var j in data[i].buy_item) {
                            name.push(data[i].buy_item[j].server_service_name)
                        }
                    }
                }
                var server_name = [...new Set(name)]; //ES6数组去重
                that.setData({
                    shopArr: res.data.data,
                    left_image: res.data.data.goods[0].left_image,
                    server_name: server_name
                })
            },
            fail: function(e) {
                console.log(e)
            }
        })
    },
    // 获取乱七八糟数据
    getData: function(log_id) {
        var that = this;
        wx.request({
            url: app.globalData.url + '/api/ext/care/order/' + log_id + '/helporder',
            method: 'GET',
            data: {},
            success: function(res) {
                console.log(res)
                var data = res.data.data;
                if (res.data.data.user_level == 0) {
                    that.change(622 / 6 * 1);
                } else if (res.data.data.user_level == 1) {
                    that.change(622 / 6 * 2);
                } else if (res.data.data.user_level == 2) {
                    that.change(622 / 6 * 3);
                } else if (res.data.data.user_level == 3) {
                    that.change(622 / 6 * 4);
                } else if (res.data.data.user_level == 4) {
                    that.change(622 / 6 * 5);
                } else if (res.data.data.user_level == 5) {
                    that.change(622 / 6 * 6);
                }
                that.setData({
                    data: data
                })
                that.setTime();
                console.log(that.data.data)
            },
            fail: function(e) {
                console.log(e)
            }
        })
    },
    // 刷新数据
    refreshData: function() {
        var that = this;
        wx.request({
            url: app.globalData.url + '/api/ext/care/order/' + that.data.log_id + '/helporder',
            method: 'GET',
            data: {},
            success: function(res) {
                var data = res.data.data;
                if (res.data.data.user_level == 0) {
                    that.change(622 / 6 * 2);
                } else if (res.data.data.user_level == 1) {
                    that.change(622 / 6 * 2);
                } else if (res.data.data.user_level == 2) {
                    that.change(622 / 6 * 3);
                } else if (res.data.data.user_level == 3) {
                    that.change(622 / 6 * 4);
                } else if (res.data.data.user_level == 4) {
                    that.change(622 / 6 * 5);
                } else if (res.data.data.user_level == 5) {
                    that.change(622 / 6 * 6);
                }
                that.setData({
                    data: data
                })
            },
            fail: function(e) {
                console.log(e)
            }
        })
    },
    // 开始洗护
    goClean: function() {
        var that = this;
        wx.reLaunch({
            url: '/pages/clean/clean',
        })
        that.setData({
            success: false
        })
    },
    // 下次再说
    cancel: function() {
        var that = this;
        that.setData({
            success: false
        })
        wx.redirectTo({
            url: '/pages/clean/clean'
        })
    },
    // 帮他升级
    upgrade: function() {
        var that = this;
        app.isToken(
            function goNext() {
                var token = wx.getStorageSync('token');
                wx.request({
                    url: app.globalData.url + '/api/ext/care/order/' + that.data.order_id + '/friends/check',
                    method: 'GET',
                    data: {
                        token: token
                    },
                    success: function(res) {
                        var lotteryStatus = res.data.data;
                        if (lotteryStatus.is_order_onwer == 1) {
                            wx.showToast({
                                title: '您不能为自己抽奖！',
                                duration: 1500,
                                icon: 'none',
                                mask: true
                            })
                        } else if (lotteryStatus.is_draw_this_order == 1) {
                            wx.showToast({
                                title: '您已经在该订单抽过奖！',
                                duration: 1500,
                                icon: 'none',
                                mask: true
                            })
                            that.setData({
                                more: true
                            })
                        } else if (lotteryStatus.user_draw_number >= 2) {
                            wx.showToast({
                                title: '您今天的抽奖次数已用完（每日最多两次）！',
                                duration: 1500,
                                icon: 'none',
                                mask: true
                            })
                            that.setData({
                                more: true
                            })
                        } else if (that.data.data.level_up_status == 0) {
                            wx.showToast({
                                title: '此订单已结束抽奖！',
                                duration: 1500,
                                icon: 'none',
                                mask: true
                            })
                        } else if (lotteryStatus.platform_changed_price == 1) {
                            wx.showToast({
                                title: '该订单因特殊原因已结束抽奖！',
                                duration: 1500,
                                icon: 'none',
                                mask: true
                            })
                        } else {
                            wx.request({
                                url: app.globalData.url + '/api/ext/care/order/friends/lucky_points',
                                method: 'POST',
                                data: {
                                    token: token,
                                    log_id: that.data.log_id
                                },
                                success: function(res) {
                                    var priceInfo = res.data.data;
                                    that.setData({
                                        priceInfo: priceInfo
                                    })
                                    that.drawAni(priceInfo.yes.id)
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
        );
    },
    // 抽奖动画
    drawAni: function(id) {
        var that = this;
        var n = id;
        if (n == 1) {
            n = 6
        } else if (n == 2 || n == 3 || n == 4 || n == 5 || n == 6) {
            n = n - 1
        }
        this.setData({
            draw: true
        })
        if (this.data.isRunning) return
        this.setData({
            isRunning: true
        })
        var that = this;
        var indexSelect = 0
        var i = 0;
        var timer = setInterval(function() {
            indexSelect++;
            i += 30;
            if (i > 800) {
                if (indexSelect == n) {
                    //去除循环
                    clearInterval(timer)
                    //获奖提示
                    setTimeout(function() {
                        that.setData({
                            draw: false,
                            Doubling: true
                        })
                    }, 1000)
                }
            }
            indexSelect = indexSelect % 6;
            that.setData({
                indexSelect: indexSelect
            })
        }, (200 + i))
    },
    // 隐藏弹出层
    hide: function() {
        var that = this;
        if (that.data.Doubling == true) {
            that.setData({
                Doubling: false
            })
        }
    },
    // 倒计时
    setTime: function() {
        var that = this;
        var time = that.data.data.level_up_end_time;

        function nowTime() {
            var intDiff = time - Date.parse(new Date()) / 1000;
            if (intDiff > 0) {
                var data = 0,
                    hour = 0,
                    minute = 0,
                    second = 0;
                var second = intDiff;
                // 天
                var day = Math.floor(second / 3600 / 24);
                var dayStr = day.toString();
                if (dayStr.length == 1) dayStr = '0' + dayStr;
                // 时
                var hr = Math.floor((second - day * 3600 * 24) / 3600);
                var hrStr = hr.toString();
                if (hrStr.length == 1) hrStr = '0' + hrStr;
                // 分
                var min = Math.floor((second - day * 3600 * 24 - hr * 3600) / 60);
                var minStr = min.toString();
                if (minStr.length == 1) minStr = '0' + minStr;
                // 秒
                var sec = second - day * 3600 * 24 - hr * 3600 - min * 60;
                var secStr = sec.toString();
                if (secStr.length == 1) secStr = '0' + secStr;
                // 合并
                // var str = '剩余' + dayStr + '天' + hrStr + '小时' + minStr + '分' + secStr + '秒'
                var str = hrStr + ':' + minStr + ':' + secStr
                that.setData({
                    time: str
                })
            } else {
                that.refreshData();
                that.setData({
                    time: '已结束'
                })
                clearInterval(timer)
            }
        }
        // nowTime();
        var timer = setInterval(nowTime, 1000);
    },
    // 动画
    change: function(length) {
        var that = this;
        var animation = wx.createAnimation({
            duration: 1000,
            timingFunction: 'ease'
        });
        that.animation = animation;
        animation.width('0').step();
        that.setData({
            animationGrade: animation.export()
        })
        setTimeout(function() {
            animation.width(length + 'rpx').step();
            that.setData({
                animationGrade: animation.export()
            })
        }.bind(that), 200);
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        console.log("options",options)
        // mta
        mta.Page.init()
        var that = this;
        that.getServer(options.log_id);
        that.getData(options.log_id);
        that.setData({
            log_id: options.log_id,
            order_id: options.order_id,
            pay_no: options.pay_no
        })
        // 判断有没有抽过
        var token = wx.getStorageSync('token');
        if (token != '') {
            var timestamp = Date.parse(new Date());
            timestamp = timestamp / 1000;
            var oldTimeStamp = wx.getStorageSync('time');
            if (timestamp - oldTimeStamp >= 3600) {
                wx.request({
                    url: that.globalData.url + '/api/auth/refresh-token',
                    method: 'POST',
                    data: {
                        token: token
                    },
                    success: function(res) {
                        if (res.data.status == 200) {
                            wx.setStorageSync('time', timestamp)
                            wx.setStorageSync('token', res.data.data.token);
                            wx.request({
                                url: app.globalData.url + '/api/care/order/' + options.order_id + '/friends/check',
                                method: 'GET',
                                data: {
                                    token: res.data.data.token
                                },
                                success: function(res) {
                                  console.log("lotteryStatus", lotteryStatus)
                                    var lotteryStatus = res.data.data;
                                    if (lotteryStatus.is_order_onwer == 1) {
                                        wx.redirectTo({
                                            url: '/pages/payment/payment?pay_no=' + options.pay_no + '&log_id=' + options.log_id,
                                        })
                                    } else if (lotteryStatus.is_draw_this_order == 1) {
                                        that.setData({
                                            more: true
                                        })
                                    } else if (lotteryStatus.user_draw_number >= 2) {
                                        that.setData({
                                            more: true
                                        })
                                    }
                                },
                                fail: function(e) {
                                    console.log(e)
                                }
                            })
                        } else {
                            wx.navigateTo({
                                url: '/pages/mine/mine',
                            })
                        }
                    },
                    fail: function(e) {
                        console.log(e)
                    }
                })
            } else {
                wx.request({
                    url: app.globalData.url + '/api/care/order/' + options.order_id + '/friends/check',
                    method: 'GET',
                    data: {
                        token: token
                    },
                    success: function(res) {
                      
                        var lotteryStatus = res.data.data;
                        console.log("lotteryStatus", lotteryStatus)
                        if (lotteryStatus.is_order_onwer == 1) {
                            wx.redirectTo({
                                url: '/pages/payment/payment?pay_no=' + options.pay_no + '&log_id=' + options.log_id,
                            })
                        } else if (lotteryStatus.is_draw_this_order == 1) {
                            that.setData({
                                more: true
                            })
                        } else if (lotteryStatus.user_draw_number >= 2) {
                            that.setData({
                                more: true
                            })
                        }
                    },
                    fail: function(e) {
                        console.log(e)
                    }
                })
            }
        }
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
        var that = this;
        if (res[0].from === 'button') {
            if (res[0].target.id == 1) {
                return {
                    title: '助我升级！你也能6折享受最极致的洗护服务！',
                    path: '/pages/payShare/payShare?log_id=' + that.data.log_id + '&order_id=' + that.data.order_id,
                    imageUrl: 'https://mini.tosneaker.com/assets/care/images_ma/add_pay_share_invite.png',
                    success: function(res) {
                        // if (res.errMsg == 'shareAppMessage:ok') {
                        //     console.log(111111)
                        // }
                    }
                }
            } else if (res[0].target.id == 2) {
                return {
                    title: '极致工序，追求零损伤洗护！',
                    path: '/pages/clean/clean',
                    imageUrl: 'https://mini.tosneaker.com/assets/care/images_ma/change_share_default.png',
                    success: function(res) {
                        if (res.errMsg == 'shareAppMessage:ok') {
                            app.isToken(
                                function goNext() {
                                    var token = wx.getStorageSync('token');
                                    console.log(that.data.order_id)
                                    wx.request({
                                        url: app.globalData.url + '/api/ext/care/order/helpupdate/coupon/update',
                                        method: 'PUT',
                                        data: {
                                            token: token,
                                            order_id: that.data.order_id
                                        },
                                        success: function(res) {
                                            that.setData({
                                                coupons: res.data.data,
                                                success: true
                                            })
                                        },
                                        fail: function(e) {
                                            console.log(e)
                                        }
                                    })
                                }
                            )
                        }
                    }
                }
            }
        } else if (res[0].from === 'menu') {
            return {
                title: '极致工序，追求零损伤洗护！',
                path: '/pages/clean/clean',
                imageUrl: 'https://mini.tosneaker.com/assets/care/images_ma/change_share_default.png'
            }
        }
    }
})