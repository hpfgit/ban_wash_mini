// pages/drawalDetail/drawalDetail.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    details: []
  },

  onPullDownRefresh() {
    this.getData();
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中...',
    });
    this.getData();
  },

  getData() {
    wx.showLoading({
      title: '加载中...',
    });
    const that = this;
    app.isToken(function goNext(token) {
      wx.request({
        url: app.globalData.url + '/api/appraisal/drawCash/cashList',
        method: 'GET',
        data: {
          token
        },
        success(res) {
          wx.hideLoading();
          that.setData({
            details: res.data.data
          });
          wx.stopPullDownRefresh();
        },
        fail(err) {
          wx.stopPullDownRefresh();
          wx.hideLoading();
          console.log(err);
        }
      })
    });
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