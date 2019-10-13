// pages/selectWarehouse/selectWarehouse.js
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    log_id: "",
    page: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      log_id: options.log_id
    })
    let that = this;
    wx.getLocation({
      type: "gcj02",
      success(res) {
        app.isToken(function goNext() {
          var token = wx.getStorageSync('token');
          wx.request({
            url: app.globalData.url + '/api/oms/order/storehouse',
            data: {
              token,
              latitude: res.latitude,
              longitude: res.longitude
            },
            method: "GET",
            success(res) {
              console.log(res)
              if(res.data.status == 200) {
                that.setData({
                  list: res.data.data
                })
              }
              console.log(that.data.list)
            },
            fail() {
              wx.showToast({
                icon: "none",
                title: res.data.message,
              })
            }
          })
        })
      },
      fail() {
        wx.showToast({
          icon: "none",
          title: '数据请求失败',
        })
      }
    })
  },
  // 选择
  select(e) {
    let index = e.currentTarget.dataset.index;
    let selectWarehouse = JSON.stringify(this.data.list[index]);
    wx.redirectTo({
      url: '/pages/writeLogistics/writeLogistics?log_id=' + this.data.log_id + "&selectWarehouse=" + selectWarehouse,
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
    let page = this.data.page;
    let that = this;
    page++
    wx.getLocation({
      type: "gcj02",
      success(res) {
        app.isToken(function goNext() {
          var token = wx.getStorageSync('token');
          wx.request({
            url: app.globalData.url + '/api/oms/order/storehouse',
            data: {
              token,
              latitude: res.latitude,
              longitude: res.longitude,
              page
            },
            method: "GET",
            success(res) {
              if (res.data.status == 200) {
                if (res.data.data.length == 0) {
                  wx.showToast({
                    title: '已加载全部',
                    icon: "none"
                  })
                  that.setData({
                    page: page - 1
                  })
                } else {
                  that.setData({
                    list: that.data.list.concat(res.data.data),
                    page
                  })
                }
              }
            },
            fail() {
              wx.showToast({
                icon: "none",
                title: res.data.message,
              })
            }
          })
        })
      },
      fail() {
        wx.showToast({
          icon: "none",
          title: '数据请求失败',
        })
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})