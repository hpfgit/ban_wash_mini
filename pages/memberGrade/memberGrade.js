// page/memberGrade/memberGrade.js
var mta = require('../../utils/mta_analysis.js')
var app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        static: app.globalData.statics,
        total: '',
        num: '',
        percent: '',
        cards_list: [],
        user_info: []
    },
    // 获取数据
    getData: function() {
        var that = this;
        app.isToken(
            function goNext(){
                var token = wx.getStorageSync('token');
                wx.request({
                    url: app.globalData.url + '/api/ext/care/member',
                    method: 'GET',
                    data: {
                        token: token
                    },
                    success: function (res) {
                        that.setData({
                            cards_list: res.data.data.cards_list,
                            user_info: res.data.data.user_info,
                            num: res.data.data.user_info.points,
                            total: res.data.data.user_info.points + res.data.data.user_info.next_level_need_points
                        })
                    },
                    fail: function (e) {
                        console.log(e)
                    }
                })
            }
        );
    },
    // 立即获取更多积分
    integral: function() {
        var that = this;
        wx.navigateTo({
            url: '/pages/memberCard/memberCard',
        })
    },
    // 查看详情
    look_info() {
      wx.navigateTo({
        url: '/pages/relus/relus',
      })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        // mta
        mta.Page.init()
        var that = this;
        that.getData();
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {
        var that = this;
        setTimeout(function() {
            var percent = that.data.num / that.data.total * 100;
            that.setData({
                percent: percent
            })
        }, 500)
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