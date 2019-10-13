// pages/writeLogistics/writeLogistics.js
var mta = require('../../utils/mta_analysis.js')
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        static: app.globalData.statics,
        num1: '',
        num2: '',
        address: [],
        log_id: '',
        companys: [],
        index: 0,
        code: [],
        name: [],
        express_code: '',
        default: true,
        mail_mode: 1,
        nearbyList: [],
        qrcode: '',
        page: 1
    },
    // 获取平台收货地址
    getData: function() {
      var that = this;
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
                if (res.data.status == 200) {
                  let list = res.data.data.filter((item, index) => {
                    return item.is_valid == 1
                  })
                  if(list.length == 0) {
                    wx.showToast({
                      icon: "none",
                      title: '暂无可用仓库',
                    })
                    return
                  }
                  let address = {};
                  let data = list[0];
                  address.consignee_address = data.area_info + data.address;
                  address.consignee_mobile = data.mb_phone;
                  address.consignee_name = data.storehouse_name;
                  address.storehouse_id = data.id;
                  that.setData({
                    address,
                  })
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
    // 获取物流公司
    getCompany: function() {
        var that = this;
        wx.request({
            url: app.globalData.url + '/api/oms/logistics/company',
            method: 'GET',
            data: {},
            success: function(res) {
                var company = res.data.data;
                var companys = [];
                var code = [];
                var name = [];
                for (var i in company) {
                  if (company[i].lable) {
                    companys.push(company[i].lable)
                  } else {
                    companys.push(company[i])
                  }
                }

                for (var i in company) {
                    if (company[i].lable) {
                        companys.push(company[i].lable)
                    } else {
                        companys.push(company[i])
                    } 
                }
                for (var i in company) {
                    if (company[i].lable) {
                        code.push(company[i].value)
                    } else {
                        code.push(i)
                    } 
                }
                for (var i in company) {
                    if (company[i].lable) {
                        name.push(company[i].lable)
                    } else {
                        name.push(company[i])
                    }
                    // companys.push(company[i]["lable"])
                }
                that.setData({
                    companys: companys,
                    code: code,
                    name: name
                })
            },
            fail: function(e) {
                console.log(e)
            }
        })
    },
  // 选择其他仓
  selectWarehouse() {
    wx.navigateTo({
      url: '/pages/selectWarehouse/selectWarehouse?log_id= ' + this.data.log_id,
    })
  },
  // 邮寄到仓按钮
  to_stored(e) {
    let that = this;
    that.setData({
      mail_mode: 1
    })
  },
  // 附近接收点
  to_nearby() {
    let that = this;
    let token = wx.getStorageSync("token");
    that.setData({
      mail_mode: 2
    })
    wx.getLocation({
      type: "gcj02",
      success: function(res) {
        app.isToken(function goNext(token) {
          wx.request({
            url: app.globalData.url + '/api/oms/order/shop-addr',
            data: {
              log_id: that.data.log_id,
              type: 1,
              token,
              latitude: res.latitude,
              longitude: res.longitude
            },
            method: "GET",
            success(res) {
              if(res.data.status == 200) {
                that.setData({
                  nearbyList: res.data.data,
                  qrcode: res.data.qrcode
                })
              }else {
                wx.showToast({
                  title: res.massage,
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
    bindPickerChange: function(e) {
        var that = this;
        var index = e.detail.value;
        var code = that.data.code;
        var name = that.data.name;
        this.setData({
            index: index
        });
        for (var i in code) {
            if (i == index) {
                that.setData({
                    express_code: code[i]
                })
            }
        }
        for (var i in name) {
            if (i == index) {
                that.setData({
                    num2: name[i],
                    default: false
                })
            }
        }
    },
    // 扫一扫
    sweep: function() {
        var that = this;
        wx.scanCode({
            success: (res) => {
                that.setData({
                    num1: res.result
                })
            }
        });
    },
    // 根据单号获取物流公司
    change: function(e) {
        var that = this;
        that.setData({
            num1: e.detail.value
        })
    },
    // 物流公司
    company: function(e) {
        var that = this;
        that.setData({
            num2: e.detail.value
        })
    },
    // 提交
    submit: function() {
        var that = this;
        app.isToken(
            function goNext() {
                var token = wx.getStorageSync('token');
                if (that.data.num2 != '') {
                    if (that.data.num1 != '') {
                        wx.request({
                            url: app.globalData.url + '/api/ext/care/express/user/platform',
                            method: 'POST',
                            data: {
                              token: token,
                              log_id: that.data.log_id,
                              express_no: that.data.num1,
                              express_company: that.data.num2,
                              express_code: that.data.express_code,
                              storehouse_id: that.data.address.storehouse_id
                            },
                            success: function(res) {
                              if (res.data.status == 201) {
                                  wx.redirectTo({
                                      url: '/pages/orders/orders'
                                  })
                              }
                            },
                            fail: function(e) {
                                console.log(e)
                            }
                        })
                    } else {
                        wx.showToast({
                            title: '请填写物流单号',
                            duration: 1500,
                            icon: 'none',
                            mask: true
                        })
                    }
                } else {
                    wx.showToast({
                        title: '请选择物流公司',
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
        log_id: options.log_id
      })
      if (options.selectWarehouse) {
        let selectWarehouse = JSON.parse(options.selectWarehouse);
        let address = {};
        address.consignee_address = selectWarehouse.area_info + selectWarehouse.address;
        address.consignee_mobile = selectWarehouse.mb_phone;
        address.consignee_name = selectWarehouse.storehouse_name;
        address.storehouse_id = selectWarehouse.id;
        that.setData({
          address
        })
      }else{
        that.getData();
      }
      that.getCompany();
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
      let page = this.data.page;
      let token = wx.getStorageSync("token");
      let that = this;
      if (this.data.mail_mode == 2) {
        page ++
        wx.getLocation({
          type: "gcj02",
          success: function (res) {
            app.isToken(function goNext(token) {
              wx.request({
                url: app.globalData.url + '/api/oms/order/shop-addr',
                data: {
                  log_id: that.data.log_id,
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
                        title: '已加载全部数据',
                        icon: "none"
                      })
                      that.setData({
                        page: page - 1
                      })
                    }else {
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
                    title: res.massage,
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
      }
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