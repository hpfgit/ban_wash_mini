// pages/sendToStore/sendToStore.js
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nearbyList: [],
    page: 1,
    qrcode: ''
  },
  getData() {
    let that = this;
    wx.getLocation({ // 获取位置信息
      type: "gcj02",
      success: function (res) {
        app.isToken2().then(token => {
          wx.request({
            url: app.globalData.url + '/api/oms/order/shop-addr',
            data: {
              type: 2,
              token,
              latitude: res.latitude,
              longitude: res.longitude
            },
            method: "GET",
            success(res) {
              if (res.data.status == 200) {
                that.setData({
                  nearbyList: res.data.data,
                  qrcode: res.data.qrcode
                })
              } else {
                wx.showToast({
                  title: res.data.massage,
                  icon: 'none',
                })
              }
            },
            fail(res) {
              wx.showToast({
                title: res.massage,
                icon: 'none',
              })
            }
          })
        }).catch(path => {
          wx.navigateTo({
            url: path,
          })
        });
      },
      fail() {
        wx.showToast({
          icon: 'none',
          title: '获取位置信息失败',
        })
      }
    })
  },
  // 打开地图
  open_map(e) {
    let latitude = Number(e.currentTarget.dataset.latitude);
    let longitude = Number(e.currentTarget.dataset.longitude);
    wx.openLocation({
      latitude,
      longitude,
      scale: 15
    })
  },
  // 电话
  open_phone(e) {
    let phone = e.currentTarget.dataset.phone;
    wx.makePhoneCall({
      phoneNumber: phone
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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
    this.getData();
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
    let token = wx.getStorageSync("token");
    let that = this;
    page++
    wx.getLocation({
      type: "gcj02",
      success: function (res) {
        app.isToken(function goNext(token) {
          wx.request({
            url: app.globalData.url + '/api/oms/order/shop-addr',
            data: {
              token,
              type: 2,
              latitude: res.latitude,
              longitude: res.longitude,
              page
            },
            method: "GET",
            success(res) {
              if (res.data.status == 200) {
                if (res.data.data.length == 0) {
                  wx.showToast({
                    title: '已加载全部数据',
                    icon: "none"
                  })
                  that.setData({
                    page: page - 1
                  })
                } else {
                  that.setData({
                    nearbyList: that.data.nearbyList.concat(res.data.data),
                    page
                  })
                }
              } else {
                wx.showToast({
                  title: res.massage,
                  icon: 'none',
                })
              }
            },
            fail(res) {
              wx.showToast({
                title: res.data.massage,
                icon: 'none',
              })
            }
          })
        })
      },
      fail() {
        wx.showToast({
          icon: 'none',
          title: '获取位置信息失败',
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