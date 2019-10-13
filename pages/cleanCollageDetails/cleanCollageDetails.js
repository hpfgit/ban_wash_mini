// page/cleanCollageDetails.js
var app = getApp();
var mta = require('../../utils/mta_analysis.js')
var meiqiaPlugin = requirePlugin("meiqia");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    openType: "",
    static: app.globalData.statics,
    qiniuImgUrl: app.globalData.qiniuImgUrl,
    imgUrl: app.globalData.imgUrl,
    type: '0',
    hidden: true,
    danhao: '',
    log_id: '',
    data: [],
    status: 0,//订单状态
    isShowInfo: null,
    yongpin: false
  },
  kefu: function () {
    var that = this;
    app.isToken(
      function goNext(token) {
        if (token == "") {
          wx.navigateTo({
            url: '/pages/mine/mine',
          })
          return
        }
        // 设置美洽信息
        var params = {
          // 成功回调
          success: function () {
            // wx.showToast({
            //     title: '设置顾客信息成功',
            // });
          },
          // 失败回调
          fail: function (res) {
            // wx.showToast({
            //     title: '设置失败：' + res.toString(),
            // });
          }
        };
        // 用户信息：可以设置用户的一些基本信息
        var obj = JSON.parse(wx.getStorageSync("user_info"));
        // console.log(obj)
        var address = obj.province
        var gender = isgender(obj.gender)
        function isgender(val) {
          if (val == 0) {
            return "未知"
          } else if (val == 1) {
            return "男"
          } else {
            return "女"
          }
        }
        var name = obj.nickName
        let user_info = {
          address, // 地址
          gender, // 性别
          name,// 名字
          avatar: obj.avatarUrl, // 头像
          tel: wx.getStorageSync("phone"), // 电话
          "用户ID": wx.getStorageSync("userid"),
          "来源": "洗护小程序"

        };
        // 位置信息
        let location_info = {
          country: obj.country,
          province: obj.province
        };
        // 客服指定分配信息
        let agent_info = {
          agent_token: '', // 指定分配客服的 token，可以在 工作台设置 - ID查询 中查看
          group_token: '', // 指定分配分组的 token，可以在 工作台设置 - ID查询 中查看
          fallback: 3 // 指定分配客服不在线时候的处理情况：1 指定分配客服不在线，则发送留言；2 指定分配客服不在线，分配给组内的人，分配失败，则发送留言；3 指定分配客服不在线，分配给企业随机一个人，分配失败，则发送留言；
        };
        params.user_info = user_info;
        params.agent_info = agent_info;
        params.location_info = location_info;
        // 美洽企业ID 
        params.ent_id = '134989';
        // 小程序 token
        params.token = 'KCKsXREmWnZoQMwr';
        // 小程序 AppID
        params.app_id = 'wx51cb4be4ce4967e6';
        // 用户 openId
        params.open_id = wx.getStorageSync("openId");
        // 调用接口
        meiqiaPlugin.setClientInfo(params);
      }
    )
  },
  // 获取数据信息
  getData: function () {
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
          success: function (res) {
            console.log("数据：", res);
            that.setData({
              data: res.data.data,
              danhao: res.data.data.care_log.log_no,
              status: res.data.data.care_log.status
            });
          },
          fail: function (e) {
            console.log(e)
          }
        })
      }
    );
  },
  // 拼团规则
  see: function () {
    this.setData({
      hidden: false
    })
  },
  // 拼团规则确定
  confirm: function () {
    this.setData({
      hidden: true
    });
  },
  // 洗护服务
  service() {
    wx.navigateTo({
      url: '/pages/clean/clean',
    })
  },
  // 洗护用品
  go_yongpin() {
    this.setData({
      yongpin: true
    })
  },
  yongpin() {
    this.setData({
      yongpin: false
    })
  },
  // 复制单号
  copy: function (e) {
    var that = this;
    var danhao = that.data.danhao;
    var order_no = danhao.toString()
    wx.setClipboardData({
      data: order_no
    })
  },
  // 订单追踪
  track: function () {
    var that = this;
    wx.navigateTo({
      url: '/pages/track/track?log_id=' + that.data.log_id + '&log_no=' + that.data.danhao + '&order_no=' + that.data.data.order_no + '&danhao=' + that.data.danhao + '&type=' + that.data.data.express_type,
    })
    // wx.redirectTo({
    //     url: '/pages/track/track?log_id=' + that.data.log_id + '&log_no=' + that.data.danhao + '&order_no=' + that.data.data.order_no,
    // })
  },
  showFuwuIndo(e) {
    this.setData({
      isShowInfo: e.currentTarget.dataset.index
    })
  },


  goSupplement: function (e) {
    var log_id = this.data.data.careLog_goods[0].care_log_id;
    var extra_costs_pay_status = this.data.data.careLog_goods[0].extra_costs_pay_status;
    wx.redirectTo({
      url: '/pages/additional/additional?log_id=' + log_id + "&extra_costs_pay_status=" + extra_costs_pay_status,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // mta
    mta.Page.init()
    var that = this;
    that.setData({
      log_id: options.log_id
      // log_id: "3916"
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
    // console.log(Date.parse(new Date()) / 1000);
    // var totalSecond = 1528000000 - Date.parse(new Date()) / 1000;

    // var interval = setInterval(function () {
    //     // 秒数  
    //     var second = totalSecond;

    //     // 天数位  
    //     var day = Math.floor(second / 3600 / 24);
    //     var dayStr = day.toString();
    //     if (dayStr.length == 1) dayStr = '0' + dayStr;

    //     // 小时位  
    //     var hr = Math.floor((second - day * 3600 * 24) / 3600);
    //     var hrStr = hr.toString();
    //     if (hrStr.length == 1) hrStr = '0' + hrStr;

    //     // 分钟位  
    //     var min = Math.floor((second - day * 3600 * 24 - hr * 3600) / 60);
    //     var minStr = min.toString();
    //     if (minStr.length == 1) minStr = '0' + minStr;

    //     // 秒位  
    //     var sec = second - day * 3600 * 24 - hr * 3600 - min * 60;
    //     var secStr = sec.toString();
    //     if (secStr.length == 1) secStr = '0' + secStr;

    //     this.setData({
    //         countDownDay: dayStr,
    //         countDownHour: hrStr,
    //         countDownMinute: minStr,
    //         countDownSecond: secStr,
    //     });
    //     totalSecond--;
    //     if (totalSecond < 0) {
    //         clearInterval(interval);
    //         wx.showToast({
    //             title: '活动已结束',
    //         });
    //         this.setData({
    //             countDownDay: '00',
    //             countDownHour: '00',
    //             countDownMinute: '00',
    //             countDownSecond: '00',
    //         });
    //     }
    // }.bind(this), 1000);
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    that.setData({
      openType: app.globalData.openType
    })
    that.getData();
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    if (res[0].from === 'menu') {
      return {
        title: '极致工序，追求零损伤洗护！',
        path: '/pages/clean/clean',
        imageUrl: 'https://mini.tosneaker.com/assets/care/images_ma/change_share_default.png'
      }
    }
  }
})