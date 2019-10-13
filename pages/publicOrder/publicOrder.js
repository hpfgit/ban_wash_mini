// page/cleanOrder/cleanOrder.js
var app = getApp();
const qiniuUploader = require("../../utils/qiniuUploader"); //七牛sdk
var mta = require('../../utils/mta_analysis.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    globalApp: app,
    mend: '',
    static: app.globalData.statics,
    imgUrl: app.globalData.imgUrl,
    qiniuImgUrl: app.globalData.qiniuImgUrl,
    remarksValue: '',
    isCoupon: '', //从优惠卷选择页 带数据过来
    express: [], //可用快递
    coins: [], //金币数
    support: [{
        name: '否',
        value: '否',
        checked: true
      },
      {
        name: '是',
        value: '是',
        checked: false
      },
    ],
    inputValue: '',
    disabled: true,
    isswitch: false,
    coinsNum: '',
    serviceTrue: 0,
    address: [], // 邮寄地址
    qiniuToken: '', //七牛token
    log_id: '', //log唯一id
    shopArr: [], //商品数组
    total: '', //订单总额
    freight: '', //运费
    gold: '', //金币
    protection: '', //保价
    realPayment: '', //实付款
    nullImg: 0, //左侧图片是否为空,0为空。1表示都不空
    remarksValue: '',
    tag: '', //优惠券使用
    couponNum: '',
    express_check: 0,
    shoes_total: 1,
    radioArr: []
  },
  // 绑定买家备注信息
  bindValue: function(e) {
    if (e.detail.value.length < 150) {
      this.setData({
        remarksValue: e.detail.value
      })
    } else {
      wx.showToast({
        title: '最多输入150个文字',
        duration: 1500,
        icon: 'none',
        mask: true
      })
    }
  },
  // 获取七牛token
  qiniuToken: function() {
    var that = this;
    app.isToken(
      function goNext() {
        var token = wx.getStorageSync('token')
        wx.request({
          url: app.globalData.url + '/api/cloud-storage/qiniu/token',
          method: 'GET',
          data: {
            token: token
          },
          success: function(res) {
            that.setData({
              qiniuToken: res.data.data.upload_token
            })
          },
          fail: function() {

          }
        });
      }
    );
  },
  // 获取邮寄地址
  address: function() {
    var that = this;
    app.isToken(
      function goNext() {
        var token = wx.getStorageSync('token');
        wx.request({
          url: app.globalData.url + '/api/oms/consignee',
          method: 'GET',
          data: {
            token: token
          },
          success: function(res) {
            console.log(res)
            var data = res.data.data;
            if (data != '') {
              for (var i in data) {
                if (i == 0) {
                  that.setData({
                    address: data[i]
                  })
                }
              }
            } else {
              that.setData({
                address: []
              })
            }
          },
          fail: function(e) {

          }
        })
      }
    );
  },
  // 选择邮寄地址
  chooseAddress: function() {
    var that = this;
    wx.navigateTo({
      url: '/pages/addressList/addressList',
    })
  },
  // 获取商品信息
  getShopInfo: function(id) {
    var that = this;
    app.isToken(
      function goNext() {
        var token = wx.getStorageSync('token');
        wx.request({
          url: app.globalData.url + '/api/ext/care/order/log/' + id + '/countinfo',
          method: 'GET',
          data: {
            token: token
          },
          success: function(res) {
            // console.log(res.data.data,99)
            that.setData({
              shopArr: res.data.data
            })
          },
          fail: function(e) {
            console.log(e)
          }
        })
      }
    );
  },
  // 上传图片给服务器
  upImgServer: function(token, log_id, image) {
    var that = this;
    wx.request({
      url: app.globalData.url + '/api/ext/care/order/user/left_image',
      method: 'POST',
      data: {
        token: token,
        log_id: log_id,
        left_image: image
      },
      success: function(res) {
        console.log(res)
        if (res.data.status == 201) {
          that.getShopInfo(res.data.data.log_id);
        }
      },
      fail: function(e) {
        console.log(e)
      }
    })
  },
  // 上传图片
  upImg: function(e) {
    var that = this;
    app.isToken(
      function goNext() {
        var token = wx.getStorageSync('token');
        var goods_no = e.currentTarget.dataset.goods_no;
        var log_id = e.currentTarget.dataset.log_id;
        var express = that.data.express;
        console.log("1", express)
        wx.chooseImage({
          count: 1,
          sizeType: ['original', 'compressed'],
          sourceType: ['album', 'camera'],
          success: function(res) {
            console.log(111)
            that.setData({
              express
            })
            var tempFilePath = res.tempFilePaths[0];
            var imgName = tempFilePath.substr(30, 50);
            qiniuUploader.upload(tempFilePath, (res) => {
              var left_image = [{
                goods_no: goods_no,
                left_image: res.imageURL
              }]
              console.log(res)
              that.upImgServer(token, log_id, left_image)
            }, (error) => {
              console.log(error)
            }, {
              region: 'NCN',
              uploadURL: 'https://upload-z1.qiniup.com',
              // 正式环境
              //   domain: 'https://static.tosneaker.com',
              // stg环境
              //   domain: 'http://static-stg.tosneaker.com',
              domain: app.globalData.qiniuImgUrl,
              key: 'uploads/_tmp/' + imgName,
              uptoken: that.data.qiniuToken
            })
          }
        })
      }
    )
  },
  // 单选按钮
  radioChange1: function(e) {
    var that = this;
    var express = that.data.express;
    var index = e.currentTarget.dataset.index;
    this.data.radioArr.push(e.detail.value);
    console.log(e.detail.value);
    if (that.data.address !== '') {
      if (e.detail.value === '同城') {
        wx.showModal({
          title: "提示",
          content: "如果邮寄地址不再一个城市内，需要补交快递费。",
          success: function (res) {
            if (res.confirm) {
              for (let i in express) {
                if (e.detail.value === express[i].name) {
                  express[i].checked = true;
                  continue;
                }
                express[i].checked = false;
              }
            } else if (res.cancel) {
              for (let i in express) {
                console.log(that.data.radioArr[that.data.radioArr.length - 2] === express[i].name);
                if (!that.data.radioArr[that.data.radioArr.length - 2]) {
                  that.data.radioArr[that.data.radioArr.length - 2] = '韵达';
                }
                if (that.data.radioArr[that.data.radioArr.length - 2] === express[i].name) {
                  express[i].checked = true;
                  continue;
                }
                express[i].checked = false;
              }
              console.log(express);
            }
            that.setData({
              express: express
            });
            that.countPrice();
          }
        });
        return;
      }
      for (var i in express) {
        if (e.detail.value == express[i].name) {
          express[i].checked = true;
          if (e.detail.value == "韵达包邮") {
            // console.log(e.detail.value);
            var couponArr = app.globalData.couponArr;
            couponArr.forEach((item, index) => {
              that.data.isCoupon.forEach((itm, idx) => {
                if (itm.coupon_type_name == "运费劵" && item == itm.id) {
                  couponArr.splice(index, 1)
                  var text;
                  if (couponArr.length == 0) {
                    text = "点击使用"
                  } else {
                    text = '已选' + couponArr.length + '张优惠券';
                  }
                  that.setData({
                    couponNum: text
                  })
                }
              })
            })
          }
        } else {
          express[i].checked = false;
        }
      }
      that.setData({
        express: express
      });
      that.countPrice();
    } else {
      for (var i in express) {
        if (i == 0) {
          express[i].checked = true
        } else {
          express[i].checked = false
        }
      }
      that.setData({
        express: express
      });
      wx.showToast({
        title: '请添加收货地址',
        duration: 1500,
        icon: 'none',
        mask: true
      })
    }
  },
  radioChange2: function(e) {
    var that = this;
    if (that.data.address != '') {
      if (e.detail.value == '是') {
        that.setData({
          disabled: false
        })
      } else if (e.detail.value == '否') {
        that.setData({
          disabled: true,
          inputValue: ''
        })
      }
      that.countPrice();
    } else {
      var support = that.data.support
      for (var i in support) {
        support[0].checked = true;
        support[1].checked = false;
      };
      that.setData({
        support: support
      })
      wx.showToast({
        title: '请添加收货地址',
        duration: 1500,
        icon: 'none',
        mask: true
      })
    }
  },
  // 保价金额
  supportNum: function(e) {
    var that = this;
    let inputValue = e.detail.value;
    if (inputValue >= 20000) {
      this.setData({
        inputValue: 20000
      });
      wx.showToast({
        title: '保价金额不得超过20000',
        icon: "none"
      })
    } else {
      this.setData({
        inputValue: e.detail.value
      });
    }
    that.countPrice();
  },
  // BAN金币
  switchChange: function(e) {
    // 状态
    var isswitch = e.detail.value;
    var that = this;
    // 如果收货地址不是空的
    if (that.data.address != '') {
      this.setData({
        isswitch,
      })
      if (isswitch == true) {
        this.setData({
          coinsNum: that.data.coins.valid
        })
      } else {
        this.setData({
          isswitch: false,
          coinsNum: ''
        })
      }
      that.countPrice();
    } else {
      this.setData({
        isswitch: false
      })
      wx.showToast({
        title: '请添加收货地址',
        duration: 1500,
        icon: 'none',
        mask: true
      })
    }
  },
  // 计算价格
  countPrice: function() {
    var that = this;
    app.isToken(
      function goNext() {
        var token = wx.getStorageSync('token');
        var express = that.data.express; //可选快递
        var couponArr = app.globalData.couponArr;
        // console.log(couponArr)
        var param = {
          token: token,
          care_log_id: that.data.log_id,
          user_coupon_id: couponArr,
          shoes_total: that.data.shoes_total
        };
        for (var i in express) { // 选择快递
          if (express[i].checked == true) {
            param['express_type'] = express[i].code
          }
        };
        if (that.data.inputValue != '') {
          param['insurance_amount'] = that.data.inputValue
        }
        if (that.data.coinsNum != '') {
          param['user_coins'] = that.data.coinsNum
        }
        wx.request({
          url: app.globalData.url + '/api/oms/order/calculate',
          method: 'POST',
          data: param,
          success: function(res) {
            // console.log(res.data)
            var data = res.data.data;
            if (res.data.status == 403) {
              wx.showToast({
                title: res.data.message,
                duration: 1500,
                icon: 'none',
                mask: true
              })
            } else if (res.data.status == 201) {
              if (data.promotion_info != null) {
                if (data.promotion_info.coins != null) {
                  that.setData({
                    gold: data.promotion_info.coins.promotion_deduct
                  })
                }
              }
              that.setData({
                total: data.goods_amount,
                freight: data.freight,
                protection: data.insurance_fee,
                realPayment: data.order_amount,
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
  // 点击使用优惠券
  chooseCoupon: function() {
    var that = this;
    wx.navigateTo({
      url: '/pages/coupon/coupon?price=' + that.data.total + '&tag=' + that.data.tag + "&express=" + JSON.stringify(that.data.express)
    })
  },
  // 判断有没有左侧图
  submit1: function() {
    var that = this;
    var goods = that.data.shopArr.goods;
    var nullImg = that.data.nullImg;
    for (var i in goods) {
      if (goods[i].left_image != '') {
        nullImg = 1
      }
    }
    if (nullImg == 0) {
      wx.showToast({
        title: '请上传鞋子45°照片',
        duration: 1500,
        icon: 'none',
        mask: true
      })
    } else if (nullImg == 1) {
      that.submit();
    }
  },
  // 确认支付
  submit: function() {
    var that = this;
    app.isToken(
      function goNext() {
        var token = wx.getStorageSync('token');
        var openId = wx.getStorageSync("openId")
        var express = that.data.express; //可选快递
        var couponArr = app.globalData.couponArr;
        if (that.data.address != '') {
          var param = {
            token: token,
            care_log_id: that.data.log_id,
            consignee_id: that.data.address.id,
            order_remark: that.data.remarksValue, //新添加
            user_coupon_id: couponArr,
            shoes_total: that.data.shoes_total
          };
          for (var i in express) { // 选择快递
            if (express[i].checked == true) {
              that.setData({
                express_check: i
              })
              param['express_type'] = express[i].code
            }
          };
          if (that.data.inputValue != '') { //?
            param['insurance_amount'] = that.data.inputValue
          }
          if (that.data.coinsNum != '') {
            param['user_coins'] = that.data.coinsNum
          }
          wx.request({
            url: app.globalData.url + '/api/oms/order',
            method: 'POST',
            data: param,
            success: function(res) {
              wx.redirectTo({
                url: '/pages/payment/payment?pay_no=' + res.data.data.pay_no + '&log_id=' + that.data.log_id + "&express_check=" + that.data.express_check,
              })
            }
          })
        } else {
          wx.showToast({
            title: '请填写地址信息',
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
    // 获取七牛token
    that.qiniuToken();
    // 获取商品信息
    that.getShopInfo(options.log_id);
    // module = 0代表清洗
    // module = 1代表修复
    console.log(options.type)
    if (options.type) {
      that.setData({
        mend: options.type
      })
    }
    that.setData({
      tag: options.tag,
      shoes_total: options.shoes_total,
      mendType: options.mend
    })
    app.isToken(
      function goNext() {
        var token = wx.getStorageSync('token');
        if (options.module == 1) {
          that.setData({
            serviceTrue: 1,
            log_id: options.log_id
          })
        } else if (options.module == 0) {
          that.setData({
            serviceTrue: 0,
            log_id: options.log_id
          });
        }
        // 页面加载checkout
        wx.request({
          url: app.globalData.url + '/api/oms/order/checkout',
          method: 'POST',
          data: {
            token: token,
            care_log_id: options.log_id
          },
          success: function(res) {
            var express = res.data.data.express;
            for (var i in express) {
              if (that.data.mend !== '') {
                if (i == 3) {
                  express[i].checked = true
                }
              } else {
                if (i == 0) {
                  express[i].checked = true
                }
              }
            }
            that.setData({
              express: express,
              coins: res.data.data.coins
            })
            that.countPrice();
          },
          fail: function(e) {
            console.log(e)
          }
        });
        // 加载收货地址
        that.address();
      }
    );
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

    // 页面加载checkout
    var token = wx.getStorageSync('token');
    wx.request({
      url: app.globalData.url + '/api/oms/order/checkout',
      method: 'POST',
      data: {
        token: token,
        care_log_id: that.data.log_id
      },
      success: function(res) {
        that.setData({
          coins: res.data.data.coins
        })
        that.countPrice();
      },
      fail: function(e) {
        console.log(e)
      }
    });
    // 判断有没有选择优惠券
    var couponArr = app.globalData.couponArr;
    if (couponArr.length == 0) {
      that.setData({
        couponNum: '点击使用'
      })
    } else {
      var text = '已选' + couponArr.length + '张优惠券';
      that.setData({
        couponNum: text
      })
    }
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