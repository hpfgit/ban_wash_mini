//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    static: app.globalData.statics,
    imgUrl: '',
    code_num: '',
    order_num: '',
    order_list: [],
    page: 1
  },
  // 输入收货码
  getCode(e) {
    let value = e.detail.value;
    this.setData({
      code_num: value
    })
  },
  // 获取数量
  getNum(e) {
    let value = e.detail.value;
    this.setData({
      order_num: value
    })
  },
  submit() {
    let that = this;
    let token = wx.getStorageSync("token");
    if (that.data.code_num == '' && that.data.order_num == '') {
      wx.showToast({
        icon: "none",
        title: '请填写每一项',
      })
      return
    }
    app.isToken(function toNext() {
      wx.request({
        url: app.globalData.url + '/api/ext/care/order/shop-scan',
        data: {
          token,
          log_id: that.data.code_num,
          actual_recv_num: that.data.order_num
        },
        method: "POST",
        success(res) {
          if (res.data.status == 200) {
            that.setData({
              order_list: []
            })
            that.getData(1)
          } else {
            wx.showToast({
              icon: 'none',
              title: res.data.message,
            })
          }
        },
        fail(res) {
          console.log(res)
        }
      })
    })
    that.setData({
      code_num: '',
      order_num: ''
    })
  },
  getData(page) {
    let that = this;
    let token = wx.getStorageSync("token");
    wx.request({
      url: app.globalData.url + '/api/ext/care/order/shop-recv-list',
      data: {
        token,
        page
      },
      method: "GET",
      success(res) {
        console.log(res)
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh()
        if (res.data.status === 200) {
          if (res.data.data.length === 0) {
            wx.showToast({
              icon: 'none',
              title: '没有数据',
            })
            that.setData({
              page
            })
            return
          }
          if (page === 1) {
            that.setData({
              order_list: res.data.data,
              shop_no_recv_num: res.data.shop_no_recv_num
            })
          } else {
            let list = that.data.order_list.concat(res.data.data);
            that.setData({
              order_list: list,
              shop_no_recv_num: res.data.shop_no_recv_num
            })
          }
        } else {
          wx.showToast({
            icon: 'none',
            title: res.data.message,
          })
        }
      },
      fail(res) {
        wx.showToast({
          icon: "none",
          title: '数据请求失败',
        })
      }
    })
  },
  sweep(e) {
    let that = this;
    wx.scanCode({
      success(res) {
        console.log(res)
        that.setData({
          code_num: res.result
        })
      }
    })
  },
  onLoad: function () {
    let that = this;
    app.isToken(function goNext() {
      that.setData({
        imgUrl: app.globalData.imgUrl
      })
      that.getData(1);
    })
  },
  onReachBottom() {
    let that = this;
    if (!this.loading) {
      wx.showNavigationBarLoading();
      that.setData({
        page: that.data.page + 1
      })
      that.getData(that.data.page);
    }
  },
  onPullDownRefresh() {
    let that = this;
    that.getData(1)
  }
})
