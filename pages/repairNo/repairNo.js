// page/repairNO/repairNo.js
var mta = require('../../utils/mta_analysis.js')
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        static: app.globalData.statics,
        qiniuImgUrl: app.globalData.qiniuImgUrl,
        log_id: '',
        data: [],
        text: '修复'
    },
    // 获取数据
    getData: function() {
        var that = this;
        app.isToken(
            function goNext() {
                var token = wx.getStorageSync('token');
                wx.request({
                    url: app.globalData.url + '/api/ext/care/order/' + that.data.log_id,
                    method: 'GET',
                    data: {
                        token: token
                    },
                    success: function(res) {
                        var data = res.data.data;
                        if (data.order_type == 3) {
                            that.setData({
                                text: '修复'
                            })
                        } else if (data.order_type == 4) {
                            that.setData({
                                text: '改色'
                            })
                        } else if (data.order_type == 5) {
                            that.setData({
                                text: '自助'
                            })
                        }
                        that.setData({
                            data: data.goods
                        })
                    },
                    fail: function(e) {
                        console.log(e)
                    }
                })
            }
        )
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        // mta
        mta.Page.init()
        var that = this;
        that.setData({
            log_id: options.log_id
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
        var that = this;
        that.getData();
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