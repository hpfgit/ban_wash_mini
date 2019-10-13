// pages/logistics/logistics.js
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
        data: [],
        imgData: [],
        express_no: '',
        chenggong: 1,
        no: '221216425920'
    },
    // 查看物流
    getInfo: function(express_no, express_code) {
        var that = this;
        wx.request({
            url: app.globalData.url + '/api/oms/logistics/query?waybill_no=' + express_no + '&company=' + express_code,
            method: 'GET',
            header: {},
            data: {},
            success: function(res) {
                console.log("返回物流信息", res)
                if (res.data.status == 200) {
                    that.setData({
                        data: res.data.data,
                        chenggong: 1
                    })
                } else if (res.data.status == 403) {
                    that.setData({
                        data: res.data.data,
                        chenggong: 0
                    })
                }
            },
            fail: function(e) {
                console.log(e)
            }
        })
    },
    // 从详情中获取图片
    getLeftImg: function(log_id) {
        var that = this;
        app.isToken(
            function goNext() {
                var token = wx.getStorageSync('token');
                wx.request({
                    url: app.globalData.url + '/api/ext/care/order/' + log_id,
                    method: 'GET',
                    data: {
                        token: token
                    },
                    success: function(res) {
                        if (res.data.data.careLog_goods) {
                            var img = that.data.imgUrl + res.data.data.careLog_goods[0].left_image;
                            that.setData({
                                imgData: img
                            })
                        } else {
                            var img = that.data.imgUrl + res.data.data.goods[0].left_image;
                            that.setData({
                                imgData: img
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
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        // mta
        mta.Page.init()
        var that = this;
        that.getLeftImg(options.log_id)
        that.getInfo(options.express_no, options.express_code);
        that.setData({
            express_no: options.express_no
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