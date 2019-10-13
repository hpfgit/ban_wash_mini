// pages/coupon/coupon.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 0,
    modal: false,
    isTrue: false,
    tag: '',
    price: '',
    inputVal: '', //输入框内容
    unused_count: 0, // 未使用数
    used_count: 0, // 已使用数
    overdue_count: 0, //已过期数
    unusedList: [], //未使用列表
    usedList: [], //已使用列表
    overdueList: [], //已过期列表
    codeText: '', //兑换优惠券提示
    tap1_pageNum: 1,
    tap2_pageNum: 2,
    tap3_pageNum: 1,
    express: ""//上个页面带来的物流
  },
  // 获取数据
  getData: function (use_type, page, limit, classNum) {
    var that = this;
    app.isToken(
      function goNext(token) {
        var tag = that.data.tag;
        var price = that.data.price;
        var used_id = app.globalData.couponArr.length == 0 ? null : app.globalData.couponArr;
        var ajaxdata;
        if (used_id == null) {
          ajaxdata = {
            token: token,
            use_type: use_type,
            tag: tag,
            price: price,
            page: page,
            limit: limit
          }
        } else {
          ajaxdata = {
            token: token,
            use_type: use_type,
            tag: tag,
            price: price,
            used_id: used_id,
            page: page,
            limit: limit
          }
        }
        wx.request({
          url: app.globalData.url + '/api/activity/p/user-coupon/xcx',
          method: 'POST',
          data: ajaxdata,
          success: function(res) {
            console.log(res)
            if (res.data.status == 200) {
              var data = res.data.data;
              for (var i in data) {
                data[i]['isOpen'] = false; //返回列表增加一个下拉开关控制
                data[i]['isUse'] = false; //返回列表增加一个判断有没有选择
                console.log(data[i].coupon_type_name)
                if (data[i].coupon_type_name == "运费劵") {
                  if(that.data.express == 0) {
                    data[i].can_used = false
                  }
                }
                if (data[i].start_time != null) {
                  data[i].start_time = data[i].start_time.replace(/-/g, '/');
                  data[i].start_time = data[i].start_time.substr(0, 10);
                }
                if (data[i].end_time != null) {
                  data[i].end_time = data[i].end_time.replace(/-/g, '/');
                  data[i].end_time = data[i].end_time.substr(0, 10);
                }
              }
              if(use_type == 0) {
                // 未使用
                if(classNum == 1) {
                  // 未使用下拉
                  that.setData({
                    unusedList: that.data.unusedList.concat(data)
                  })
                }else {
                  that.setData({
                    unusedList: data
                  })
                }
              }else if(use_type == 1) {
                if(classNum == 2) {
                  that.setData({
                    usedList: that.data.usedList.concat(data)
                  })
                }else {
                  that.setData({
                    usedList: data
                  })
                }
              } else if (use_type == 2) {
                if (classNum == 3) {
                  that.setData({
                    overdueList: that.data.overdueList.concat(data)
                  })
                } else {
                  that.setData({
                    overdueList: data
                  })
                }
              }
              that.setData({
                overdue_count: res.data.overdue_count,
                unused_count: res.data.unused_count,
                used_count: res.data.used_count,
              })
              that.isUse();
            }
            console.log(that.data.unusedList)
          },
          fail: function(e) {
            console.log(e)
          }
        })
      }
    )
  },
  // tab切换
  clickTab: function(e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current,
      })
      if (e.target.dataset.current == 0) {
        that.getData(0,1,10)
      } else if (e.target.dataset.current == 1) {
        that.getData(1,1,10)
      } else if (e.target.dataset.current == 2) {
        that.getData(2,1,10)
      }
    }
  },
  // 判断有没有使用过
  isUse: function() {
    var that = this;
    var couponArr = app.globalData.couponArr;
    var unusedList = that.data.unusedList;
    for (var i in unusedList) {
      unusedList[i].isUse = false;
      for (var j in couponArr) {
        if (unusedList[i].id == couponArr[j]) {
          unusedList[i].isUse = true;
        }
      }
    };
    that.setData({
      unusedList: unusedList
    })
  },
  // 立即使用
  use: function(e) {
    var that = this;
    app.isToken(
      function goNext(token) {
        var idx;
        var id = e.currentTarget.dataset.id;
        var tag = that.data.tag;
        var used_id = app.globalData.couponArr.length == 0 ? null : app.globalData.couponArr;
        var ajaxdata;
        if (used_id == null) {
          ajaxdata = {
            token: token,
            tag: tag
          }
        } else {
          ajaxdata = {
            token: token,
            used_id: used_id,
            tag: tag
          }
        }
        wx.request({
          url: app.globalData.url + '/api/activity/p/user-coupon/' + id + '/xcx',
          method: 'POST',
          data: ajaxdata,
          success: function(res) {
            if (res.data.status == 201) {
              // 获取选中的优惠卷
              var isCoupon = [];
              var pages = getCurrentPages();
              var prevPage = pages[pages.length - 2];  //上一个页面
              that.data.unusedList.forEach((item, index) => {
                if (item.id == id) {
                  isCoupon.push(item)
                }
              })
              app.globalData.couponArr.push(id);
              // that.isUse();
              //直接调用上一个页面对象的setData()方法，把数据存到上一个页面中去
              console.log(isCoupon)
              prevPage.setData({
                isCoupon
              });
              wx.navigateBack({
                delta: 1
              });
            }
          },
          fail: function(e) {
            console.log(e)
          }
        })
      }
    )
  },
  // 取消使用
  cancelUse: function(e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    var couponArr = app.globalData.couponArr;
    
    for (var i in couponArr) {
      if (couponArr[i] == id) {
        couponArr.splice(i, 1);
        app.globalData.couponArr = couponArr;
        that.isUse();
        that.getData(0,1,10)
        // // 获取未使用的优惠卷数组
        // let unusedList = that.data.unusedList;
        // // 循环未使用优惠券数组
        // for (let i = 0; i < unusedList.length; i++) {
        //   // 将优惠券改为可用状态
        //   unusedList[i].isUse = false;
        //   // unusedList[i].can_used = true;
        //   that.setData({
        //     unusedList
        //   })
        // }
      }
    }
  },
  // 向下打开
  openInfo: function(e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var unusedList = that.data.unusedList;
    for (var i in unusedList) {
      if (index == i) {
        if (unusedList[i].isOpen) {
          unusedList[i].isOpen = false;
        } else {
          unusedList[i].isOpen = true;
        }
      }
    }
    that.setData({
      unusedList: unusedList
    })
  },
  // 点击添加优惠券
  add: function() {
    var that = this;
    that.setData({
      modal: true,
      codeText: '',
      isTrue: false
    })
  },
  // 点击立即兑换
  submit: function() {
    var that = this;
    var inputVal = that.data.inputVal;
    app.isToken(
      function goNext(token) {
        wx.request({
          url: app.globalData.url + '/api/activity/p/user-coupon/receive_code',
          method: 'PUT',
          data: {
            token: token,
            receive_code: inputVal
          },
          success: function(res) {
            if (res.data.status == 403) {
              that.setData({
                codeText: res.data.message,
                isTrue: true
              })
            } else if (res.data.status == 201) {
              that.setData({
                modal: false,
                codeText: '',
                isTrue: false
              })
              that.getData(0,1,10)
            }
          },
          fail: function(e) {
            console.log(e)
          }
        })
      }
    )
  },
  // 优惠券输入框
  inputChange: function(e) {
    var that = this;
    that.setData({
      inputVal: e.detail.value
    })
  },
  // 关闭添加优惠券
  close: function() {
    var that = this;
    that.setData({
      modal: false
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    let express = JSON.parse(options.express)
    let idx;
    express.forEach((item, index) => {
      if (item.checked) {
        idx = index
      }
    })
    var that = this;
    that.setData({
      price: options.price,
      tag: options.tag,
      express: idx
    })
    that.getData(0,1,10);
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
    let that = this;
    // let currentTab = that.data.currentTab;
    let { currentTab, tap1_pageNum, tap2_pageNum, tap3_pageNum} = that.data;
    if (currentTab == 0) {
      // 未使用的下拉加载
      tap1_pageNum ++
      that.setData({
        tap1_pageNum
      })
      that.getData(currentTab, tap1_pageNum, 10, 1)
    } else if (currentTab == 1) {
      tap2_pageNum++
      that.setData({
        tap2_pageNum
      })
      that.getData(currentTab, tap2_pageNum, 10, 2)
      // 使用记录的下拉加载
    } else if (currentTab == 2) {
      // 已过期的下拉加载
      tap3_pageNum++
      that.setData({
        tap3_pageNum
      })
      that.getData(currentTab, tap3_pageNum, 10, 3)
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})