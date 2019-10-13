// pages/chatPage/chatPage.js
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        url: 'https://www.tosneaker.com/m/meiqia/meiqia.html?_=t&eid=134989'
    },
    test:function(e){
        var that = this;
        console.log(e.detail.data)
        // if (e.detail.data.length>=3){
        //     wx.navigateBack();
        // }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var that = this;
        var gender = '';
        var module = '';
        if (wx.getStorageSync('gender') == 0) {
            gender = '&gender=保密'
        } else if (wx.getStorageSync('gender') == 1) {
            gender = '&gender=男'
        } else if (wx.getStorageSync('gender') == 2) {
            gender = '&gender=女'
        }
        if(options.type==1){
            module = '&module=洗护小程序-首页'
        }else if(options.type==2){
            module = '&module=洗护小程序-修复'
        }else if(options.type==3){
            module = '&module=洗护小程序-自助'
        }else if(options.type==4){
            module = '&module=洗护小程序-订单'
        }else if(options.type==5){
            module = '&module=洗护小程序-充值'
        }
        var avatar = '&avatar=' + app.globalData.imgUrl + wx.getStorageSync('avatar');
        var age = '&age=' + wx.getStorageSync('age');
        var name = '&name=' + wx.getStorageSync('name');
        var userid = '&userid=' + wx.getStorageSync('userid');
        var tel = '&tel=' + wx.getStorageSync('phone');
        var address = '&address=' + wx.getStorageSync('address');
        // var module = '&module=' + '洗护小程序'
        var url = that.data.url + avatar + age + name + userid + tel + address + gender + module;
        url = encodeURI(url);
        that.setData({
            url: url
        });
        // var metadata = {
        //     "avatar": app.globalData.imgUrl + wx.getStorageSync('avatar'),
        //     "age": wx.getStorageSync('age'),
        //     "name": wx.getStorageSync('name'),
        //     "userid": wx.getStorageSync('userid'),
        //     "tel": wx.getStorageSync('phone'),
        //     "address": wx.getStorageSync('address'),
        //     "gender": wx.getStorageSync('gender') == 0 ? '保密' : wx.getStorageSync('gender') == 1 ? '男' : '女',
        //     "module": "洗护版块"
        // }
        // console.log(metadata)
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
    onShareAppMessage: function() {

    }
})