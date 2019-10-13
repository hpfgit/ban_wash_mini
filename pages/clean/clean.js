var mta = require('../../utils/mta_analysis.js')
var meiqiaPlugin = requirePlugin("meiqia");

// 获取应用实例
const app = getApp()

Page({
  data: {
    openType: "",
    static: app.globalData.statics,
    imgUrl: app.globalData.imgUrl,
    winHeight: 90,
    scrollTop: 0,
    scrollHeight: 0,
    image: [],
    tab: 1,
    effectImage: [],
    bigImgs: [],
    hasMore: false,
    page: 1,
    moreCan: true,
    flow: false,
    service: false,
    yongpin: false,
    index: 0,
    animationData: {},
    // 重新开始(单双)
    data: [],
    currentTab: 0,
    wash: false,
    priceArr: {
      PZ: {
        server_service_id: 1,
        service_name: '清洗',
        number: 1,
        name: '精洗',
        material: 1,
        service_id: 1,
        item_id: 2,
        num: [],
        items: [],
        submit: []
      },
      PK: {
        server_service_id: 1,
        service_name: '清洗',
        number: 1,
        name: '精洗',
        material: 2,
        service_id: 1,
        item_id: 2,
        num: [],
        items: [],
        submit: []
      },
      SP: {
        server_service_id: 1,
        service_name: '清洗',
        number: 1,
        name: '精洗',
        material: 3,
        service_id: 1,
        item_id: 2,
        num: [],
        items: [],
        submit: []
      }
    },
    money: '0',
    oldMoney: '0',
    // 多双数据
    washMuch: false,
    morePriceArr: [{
      currentTab: 0,
      PZ: {
        server_service_id: 1,
        service_name: '清洗',
        number: 1,
        name: '精洗',
        material: 1,
        service_id: 1,
        item_id: 2,
        num: [],
        items: [],
        submit: []
      },
      PK: {
        server_service_id: 1,
        service_name: '清洗',
        number: 1,
        name: '精洗',
        material: 2,
        service_id: 1,
        item_id: 2,
        num: [],
        items: [],
        submit: []
      },
      SP: {
        server_service_id: 1,
        service_name: '清洗',
        number: 1,
        name: '精洗',
        material: 3,
        service_id: 1,
        item_id: 2,
        num: [],
        items: [],
        submit: []
      },
      data: [],
    }],
    moneyMuch: 0,
    old_moneyMuch: 0,
    serviceMuch: false,
    moreData: [], // 多双循环添加时使用，不做改变
    tixing: app.globalData.tixing, //监听消息
    interval: '', //定时器
    animationKefu: {}, //客服动画
    // 网易云信
    errorMessage: '', // 显示错误提示信息
    transports: ['websocket'], //传输方式
    isLogin: false, // 登录状态
    account: '', // 用户输入账号
    password: '', //用户输入密码
    prompt: true,
    modal: false,
    which: 1, //判断是单双还是多双
    kefuId: 'bu-0000000176',
    lock: true,
    store_SH: false,
    reason: "" //活动
  },
  sendToStore() {
    wx.navigateTo({
      url: '/pages/sendToStore/sendToStore',
    })
  },
  // 前往门店收货
  go_store_confirm() {
    wx.navigateTo({
      url: "/pages/store_select/store_select",
    })
  },
  // 客服
  kefu: function () {
    var that = this;
    app.isToken(
      function goNext(token) {
        console.log(55555)
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
  // 发送formid
  find: function (e) {
    var formid = e.detail.formId;
    var newFormId = app.globalData.newFormId;
    if (formid != 'the formId is a mock one') {
      var timestamp = Date.parse(new Date());
      timestamp = timestamp / 1000;
      var setFormid = {
        formid: formid,
        ts: timestamp
      }
      newFormId.formid.push(setFormid);
      var openId = wx.getStorageSync('openId')
      if (openId != '') {
        // 第一次发送formid
        if (app.globalData.first == true) {
          app.sendId();
          app.globalData.first = false;
        }
        // 一分钟之后
        var timestamp = Date.parse(new Date());
        timestamp = timestamp / 1000;
        if (timestamp - app.globalData.timestamp > 60) {
          app.sendId();
        }
      }
    }
  },
  // tab切换
  tabSwitchSingle: function () {
    var that = this;
    that.setData({
      tab: 1
    })
  },
  tabSwitchMuch: function () {
    var that = this;
    that.setData({
      tab: 2
    })
  },
  // 获取数据
  getData: function () {
    var that = this;
    wx.request({
      url: app.globalData.url + '/api/ext/care/static/image',
      method: 'GET',
      data: {
        care_service_id: 1,
        attribute: 1,
      },
      success: function (res) {
        console.log(res)
        var data = res.data.data;
        that.setData({
          image: data
        })
      },
      fail: function (e) {
        console.log(e)
      }
    })
  },
  getImg: function () {
    var that = this;
    wx.request({
      url: app.globalData.url + '/api/ext/care/static/image',
      method: 'GET',
      data: {
        care_service_id: 1,
        attribute: 2,
        page: 1
      },
      success: function (res) {
        var data = res.data.data;
        var effectImage = that.data.effectImage;
        var imgs = that.data.bigImgs;
        for (var i in data) {
          effectImage.push(data[i])
          imgs.push(that.data.imgUrl + data[i].path)
        }
        that.setData({
          effectImage: effectImage,
          bigImgs: imgs,
        })
      },
      fail: function (e) {
        console.log(e)
      }
    })
  },
  getPrice: function () {
    var that = this;
    var morePriceArr = that.data.morePriceArr;
    wx.request({
      url: app.globalData.url + '/api/ext/care/pricetable',
      method: 'GET',
      data: {},
      success: function (res) {
        var data = res.data.data;
        for (var i in morePriceArr) {
          morePriceArr[i].data = data
        }
        that.setData({
          data: data,
          morePriceArr: morePriceArr,
          moreData: data
        })
      }
    })
  },
  // 标洗精洗选择弹出
  chooseWash: function (e) {
    var that = this;
    var animation = wx.createAnimation({
      // 动画持续时间
      duration: 500,
      // 定义动画效果，当前是匀速
      timingFunction: 'linear'
    });
    that.animation = animation;
    animation.translateY(200).step();
    that.setData({
      // 通过export()方法导出数据
      animationData: animation.export(),
      // 改变view里面的Wx：if
      wash: true,
    });
    // 设置setTimeout来改变y轴偏移量，实现有感觉的滑动
    setTimeout(function () {
      animation.translateY(0).step()
      that.setData({
        animationData: animation.export()
      })
    }, 200);
  },
  hideWash: function () {
    var that = this;
    that.setData({
      wash: false,
      washMuch: false
    })
  },
  // 清洗选择
  chooseText: function (e) {
    var that = this;
    var tab = that.data.tab; //单双/多双
    var currentTab = that.data.currentTab; //当前皮质
    var text = e.currentTarget.dataset.text; //选中内容
    var priceArr = that.data.priceArr; // 存放选中的选项(单双)
    var material = e.currentTarget.dataset.material;
    var service_id = e.currentTarget.dataset.service;
    var item_id = e.currentTarget.dataset.item;
    var server_service_id = e.currentTarget.dataset.server_service_id;
    var service_name = e.currentTarget.dataset.service_name;
    if (currentTab == 0) {
      priceArr.PZ.name = text;
      priceArr.PZ.material = material;
      priceArr.PZ.service_id = service_id;
      priceArr.PZ.item_id = item_id;
      priceArr.PZ.server_service_id = server_service_id;
      priceArr.PZ.service_name = service_name;

      that.setData({
        priceArr: priceArr
      })
    } else if (currentTab == 1) {
      priceArr.PK.name = text;
      priceArr.PK.material = material;
      priceArr.PK.service_id = service_id;
      priceArr.PK.item_id = item_id;
      priceArr.PK.server_service_id = server_service_id;
      priceArr.PK.service_name = service_name;
      that.setData({
        priceArr: priceArr
      })
    } else if (currentTab == 2) {
      priceArr.SP.name = text;
      priceArr.SP.material = material;
      priceArr.SP.service_id = service_id;
      priceArr.SP.item_id = item_id;
      priceArr.SP.server_service_id = server_service_id;
      priceArr.SP.service_name = service_name;
      that.setData({
        priceArr: priceArr
      })
    }
    that.shopPrice();
  },
  // 附加服务
  attach: function () {
    var that = this;
    var data = that.data.data;
    if (that.data.service == false) {
      that.setData({
        service: true,
        newData: data
      })
    }
  },
  // 附加服务选择
  servierChoose1: function (e) {
    var that = this;
    var tab = that.data.tab; //单双/多双
    var currentTab = that.data.currentTab; //面料
    var data = that.data.data; //所有列表数据
    var itemid = e.currentTarget.dataset.itemid;
    var name = e.currentTarget.dataset.name;

    for (var i in data) {
      if (itemid == data[i].id) {
        for (var j in data[i].item) {
          if (currentTab == 0) {
            if (name == data[i].item[j].item_name) {
              if (data[i].item[j].singlePZ == true) {
                data[i].item[j].singlePZ = false;
              } else {
                data[i].item[j].singlePZ = true;
              }
            } else {
              data[i].item[j].singlePZ = false;
            }
          } else if (currentTab == 1) {
            if (name == data[i].item[j].item_name) {
              if (data[i].item[j].singlePK == true) {
                data[i].item[j].singlePK = false;
              } else {
                data[i].item[j].singlePK = true;
              }
            } else {
              data[i].item[j].singlePK = false;
            }
          } else if (currentTab == 2) {
            if (name == data[i].item[j].item_name) {
              if (data[i].item[j].singleSP == true) {
                data[i].item[j].singleSP = false;
              } else {
                data[i].item[j].singleSP = true;
              }
            } else {
              data[i].item[j].singleSP = false;
            }
          }
        }
      }
    }
    that.setData({
      data: data
    })

  },
  servierChoose2: function (e) {
    var that = this;
    var tab = that.data.tab; //单双/多双
    var currentTab = that.data.currentTab; //面料
    var data = that.data.data; //所有列表数据
    var itemid = e.currentTarget.dataset.itemid;
    var name = e.currentTarget.dataset.name;

    for (var i in data) {
      if (itemid == data[i].id) {
        for (var j in data[i].item) {
          if (currentTab == 0) {
            if (name == data[i].item[j].item_name) {
              if (data[i].item[j].singlePZ == true) {
                data[i].item[j].singlePZ = false;
              } else {
                data[i].item[j].singlePZ = true;
              }
            } else {
              data[i].item[j].singlePZ = false;
            }
          } else if (currentTab == 1) {
            if (name == data[i].item[j].item_name) {
              if (data[i].item[j].singlePK == true) {
                data[i].item[j].singlePK = false;
              } else {
                data[i].item[j].singlePK = true;
              }
            } else {
              data[i].item[j].singlePK = false;
            }
            if (data[i].item[1].singlePK == true) {
              data[i].item[0].singlePK = false
            } else {
              data[i].item[0].singlePK = true
            }
          } else if (currentTab == 2) {
            if (name == data[i].item[j].item_name) {
              if (data[i].item[j].singleSP == true) {
                data[i].item[j].singleSP = false;
              } else {
                data[i].item[j].singleSP = true;
              }
            } else {
              data[i].item[j].singleSP = false;
            }
          }
        }
      }
    }

    that.setData({
      data: data
    })
  },
  servierChoose3: function (e) {
    var that = this;
    var tab = that.data.tab; //单双/多双
    var currentTab = that.data.currentTab; //面料
    var data = that.data.data; //所有列表数据
    var itemid = e.currentTarget.dataset.itemid;
    var name = e.currentTarget.dataset.name;
    if (tab == 1) {
      for (var i in data) {
        if (itemid == data[i].id) {
          for (var j in data[i].item) {
            if (currentTab == 0) {
              if (name == data[i].item[j].item_name) {
                if (data[i].item[j].singlePZ == true) {
                  data[i].item[j].singlePZ = false;
                } else {
                  data[i].item[j].singlePZ = true;
                }
              } else {
                data[i].item[j].singlePZ = false;
              }
            } else if (currentTab == 1) {
              if (name == data[i].item[j].item_name) {
                if (data[i].item[j].singlePK == true) {
                  data[i].item[j].singlePK = false;
                } else {
                  data[i].item[j].singlePK = true;
                }
              } else {
                data[i].item[j].singlePK = false;
              }
            } else if (currentTab == 2) {
              if (name == data[i].item[j].item_name) {
                if (data[i].item[j].singleSP == true) {
                  data[i].item[j].singleSP = false;
                } else {
                  data[i].item[j].singleSP = true;
                }
              } else {
                data[i].item[j].singleSP = false;
              }
            }
          }
        }
      }
    }
    that.setData({
      data: data
    })
  },
  // 单双附加服务确定
  sure: function () {
    var that = this;
    var data = that.data.data;
    var tab = that.data.tab;
    var currentTab = that.data.currentTab;
    var priceArr = that.data.priceArr;
    if (currentTab == 0) {
      var services = [];
      var submit = [];
      var num = [];
      for (var i in data) {
        if (data[i].id == 10) {
          for (var j in data[i].item) {
            if (data[i].item[j].singlePZ) {
              var ser1 = {
                material: currentTab + 1,
                service_id: data[i].item[j].service_id,
                item_id: data[i].item[j].id
              }
              var submit1 = {
                server_service_id: data[i].server_service_id,
                service_id: data[i].item[j].service_id,
                service_name: data[i].name,
                item_id: data[i].item[j].id,
                item_name: data[i].item[j].item_name,
                number: 1
              }
              submit.push(submit1)
              services.push(ser1)
              num.push(1)
            }
          }
        }
        if (data[i].id == 6) {
          for (var j in data[i].item) {
            if (data[i].item[j].singlePZ) {
              var ser2 = {
                material: currentTab + 1,
                service_id: data[i].item[j].service_id,
                item_id: data[i].item[j].id
              }
              var submit2 = {
                server_service_id: data[i].server_service_id,
                service_id: data[i].item[j].service_id,
                service_name: data[i].name,
                item_id: data[i].item[j].id,
                item_name: data[i].item[j].item_name,
                number: 1
              }
              submit.push(submit2)
              services.push(ser2)
              num.push(2)
            }
          }
        }
        if (data[i].id == 7) {
          for (var j in data[i].item) {
            if (data[i].item[j].singlePZ) {
              var ser3 = {
                material: currentTab + 1,
                service_id: data[i].item[j].service_id,
                item_id: data[i].item[j].id
              }
              var submit3 = {
                server_service_id: data[i].server_service_id,
                service_id: data[i].item[j].service_id,
                service_name: data[i].name,
                item_id: data[i].item[j].id,
                item_name: data[i].item[j].item_name,
                number: 1
              }
              submit.push(submit3)
              services.push(ser3)
              num.push(3)
            }
          }
        }
      }
      priceArr.PZ.num = num.sort();
      priceArr.PZ.items = services;
      priceArr.PZ.submit = submit;
      that.setData({
        service: false,
        priceArr: priceArr
      })
      that.shopPrice();
    } else if (currentTab == 1) {
      var services = [];
      var submit = [];
      var num = []
      for (var i in data) {
        if (data[i].id == 10) {
          for (var j in data[i].item) {
            if (data[i].item[j].singlePK) {
              var ser1 = {
                material: currentTab + 1,
                service_id: data[i].item[j].service_id,
                item_id: data[i].item[j].id
              }
              var submit1 = {
                server_service_id: data[i].server_service_id,
                service_id: data[i].item[j].service_id,
                service_name: data[i].name,
                item_id: data[i].item[j].id,
                item_name: data[i].item[j].item_name,
                number: 1
              }
              submit.push(submit1)
              services.push(ser1)
              num.push(1)
            }
          }
        }
        if (data[i].id == 6) {
          for (var j in data[i].item) {
            if (data[i].item[j].singlePK) {
              var ser2 = {
                material: currentTab + 1,
                service_id: data[i].item[j].service_id,
                item_id: data[i].item[j].id
              }
              var submit2 = {
                server_service_id: data[i].server_service_id,
                service_id: data[i].item[j].service_id,
                service_name: data[i].name,
                item_id: data[i].item[j].id,
                item_name: data[i].item[j].item_name,
                number: 1
              }
              submit.push(submit2)
              services.push(ser2)
              num.push(2)
            }
          }
        }
        if (data[i].id == 7) {
          for (var j in data[i].item) {
            if (data[i].item[j].singlePK) {
              var ser3 = {
                material: currentTab + 1,
                service_id: data[i].item[j].service_id,
                item_id: data[i].item[j].id
              }
              var submit3 = {
                server_service_id: data[i].server_service_id,
                service_id: data[i].item[j].service_id,
                service_name: data[i].name,
                item_id: data[i].item[j].id,
                item_name: data[i].item[j].item_name,
                number: 1
              }
              submit.push(submit3)
              services.push(ser3)
              num.push(3)
            }
          }
        }
      }
      priceArr.PK.num = num.sort();
      priceArr.PK.items = services;
      priceArr.PK.submit = submit;
      that.setData({
        service: false,
        priceArr: priceArr
      })
      that.shopPrice();
    } else if (currentTab == 2) {
      var services = [];
      var submit = [];
      var num = [];
      for (var i in data) {
        if (data[i].id == 10) {
          for (var j in data[i].item) {
            if (data[i].item[j].singleSP) {
              var ser1 = {
                material: currentTab + 1,
                service_id: data[i].item[j].service_id,
                item_id: data[i].item[j].id
              }
              var submit1 = {
                server_service_id: data[i].server_service_id,
                service_id: data[i].item[j].service_id,
                service_name: data[i].name,
                item_id: data[i].item[j].id,
                item_name: data[i].item[j].item_name,
                number: 1
              }
              submit.push(submit1)
              services.push(ser1)
              num.push(1)
            }
          }
        }
        if (data[i].id == 6) {
          for (var j in data[i].item) {
            if (data[i].item[j].singleSP) {
              var ser2 = {
                material: currentTab + 1,
                service_id: data[i].item[j].service_id,
                item_id: data[i].item[j].id
              }
              var submit2 = {
                server_service_id: data[i].server_service_id,
                service_id: data[i].item[j].service_id,
                service_name: data[i].name,
                item_id: data[i].item[j].id,
                item_name: data[i].item[j].item_name,
                number: 1
              }
              submit.push(submit2)
              services.push(ser2)
              num.push(2)
            }
          }
        }
        if (data[i].id == 7) {
          for (var j in data[i].item) {
            if (data[i].item[j].singleSP) {
              var ser3 = {
                material: currentTab + 1,
                service_id: data[i].item[j].service_id,
                item_id: data[i].item[j].id
              }
              var submit3 = {
                server_service_id: data[i].server_service_id,
                service_id: data[i].item[j].service_id,
                service_name: data[i].name,
                item_id: data[i].item[j].id,
                item_name: data[i].item[j].item_name,
                number: 1
              }
              submit.push(submit3)
              services.push(ser3)
              num.push(3)
            }
          }
        }
      }
      priceArr.SP.num = num.sort();
      priceArr.SP.items = services;
      priceArr.SP.submit = submit;
      that.setData({
        service: false,
        priceArr: priceArr
      })
      that.shopPrice();
    }
  },
  // 单双附加服务取消
  cancel: function () {
    var that = this;
    var newData = that.data.newData;
    that.setData({
      data: newData,
      service: false
    })
  },
  //滑动切换(单双)
  swiperTab: function (e) {
    var that = this;
    var data = that.data.data; //所有列表数据
    var currentTab = that.data.currentTab; //面料
    // 翻毛皮整体护理基础版默认选中
    // if (e.detail.current == 1) {
    //   for (var i in data) {
    //     if (data[i].id == 6) {
    //       for (var j in data[i].item) {
    //         if (data[i].item[0].singlePK == true || data[i].item[1].singlePK == true) {
    //
    //         } else {
    //           if (j == 0) {
    //             data[i].item[j].singlePK = true;
    //           }
    //         }
    //       }
    //     }
    //   }
    // }
    that.setData({
      data: data,
      currentTab: e.detail.current,
    })
    that.sure();
  },
  clickTab: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current,
        arr: [],
      })
    };
  },
  // 价格计算
  shopPrice: function () {
    var that = this;
    var material = that.data.currentTab;
    var priceArr = that.data.priceArr;
    if (material == 0) {
      var clear = [{
        material: priceArr.PZ.material,
        service_id: priceArr.PZ.service_id,
        item_id: priceArr.PZ.item_id
      }]
      var price = priceArr.PZ.items.concat(clear)
    } else if (material == 1) {
      var clear = [{
        material: priceArr.PK.material,
        service_id: priceArr.PK.service_id,
        item_id: priceArr.PK.item_id
      }]
      var price = priceArr.PK.items.concat(clear)
    } else if (material == 2) {
      var clear = [{
        material: priceArr.SP.material,
        service_id: priceArr.SP.service_id,
        item_id: priceArr.SP.item_id
      }]
      var price = priceArr.SP.items.concat(clear)
    }
    var items = JSON.stringify(price)
    wx.request({
      url: app.globalData.url + '/api/ext/care/item/price',
      data: {
        items: items
      },
      method: 'POST',
      success: function (res) {
        console.log(res.data.data.sum_price_original)
        that.setData({
          money: res.data.data.sum_price,
          oldMoney: res.data.data.sum_price_original,
          reason: res.data.data.reason
        })
      },
      fail: function (res) { },
    })
  },
  //tab滑动切换(多双)
  swiperTabMuch: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var morePriceArr = that.data.morePriceArr;
    for (var i in morePriceArr) {
      if (i == index) {
        morePriceArr[i].currentTab = e.detail.current
      }
    }
    // 翻毛皮整体护理基础版默认选中
    // if (e.detail.current == 1) {
    //   for (var i in morePriceArr) {
    //     if (i == index) {
    //       for (var j in morePriceArr[i].data) {
    //         if (morePriceArr[i].data[j].id == 6) {
    //           for (var k in morePriceArr[i].data[j].item) {
    //             if (morePriceArr[i].data[j].item[0].morePK == true || morePriceArr[i].data[j].item[1].morePK == true) {
    //
    //             } else {
    //               if (k == 0) {
    //                 morePriceArr[i].data[j].item[k].morePK = true
    //               }
    //             }
    //           }
    //         }
    //       }
    //     }
    //   }
    // }
    that.setData({
      morePriceArr: morePriceArr,
    })
    that.sureMuch();
  },
  clickTabMuch: function (e) {
    var that = this;
    let lock = that.data.lock;
    if (lock) {
      that.setData({
        lock: false
      })
      var index = e.currentTarget.dataset.index;
      var num = that.data.morePriceArr;
      for (var i in num) {
        if (i == index) {
          num[i].currentTab = e.target.dataset.current
        }
      }
      that.setData({
        morePriceArr: num,
      })
      setTimeout(function () {
        that.setData({
          lock: true
        })
      }, 1000)
    }

  },
  // 再添加一双
  add: function () {
    var that = this;
    var morePriceArr = that.data.morePriceArr;
    var addContent = {
      currentTab: 0,
      PZ: {
        server_service_id: 1,
        service_name: '清洗',
        number: 1,
        name: '精洗',
        material: 1,
        service_id: 1,
        item_id: 2,
        num: [],
        items: [],
        submit: []
      },
      PK: {
        server_service_id: 1,
        service_name: '清洗',
        number: 1,
        name: '精洗',
        material: 2,
        service_id: 1,
        item_id: 2,
        num: [],
        items: [],
        submit: []
      },
      SP: {
        server_service_id: 1,
        service_name: '清洗',
        number: 1,
        name: '精洗',
        material: 3,
        service_id: 1,
        item_id: 2,
        num: [],
        items: [],
        submit: []
      },
      data: that.data.moreData
    }
    if (morePriceArr.length < 10) {
      morePriceArr.push(addContent)
      that.setData({
        morePriceArr: morePriceArr
      })
    } else {
      wx.showToast({
        title: '多双清洗最多添加十双',
        duration: 1500,
        icon: 'none',
        mask: true
      })
    }
    that.shopPriceMuch();
  },
  // 清空列表
  empty() {
    var that = this;
    var morePriceArr = that.data.morePriceArr;
    var moneyMuch = that.data.moneyMuch;
    morePriceArr = []
    var addContent = {
      currentTab: 0,
      PZ: {
        server_service_id: 1,
        service_name: '清洗',
        number: 1,
        name: '精洗',
        material: 1,
        service_id: 1,
        item_id: 2,
        num: [],
        items: [],
        submit: []
      },
      PK: {
        server_service_id: 1,
        service_name: '清洗',
        number: 1,
        name: '精洗',
        material: 2,
        service_id: 1,
        item_id: 2,
        num: [],
        items: [],
        submit: []
      },
      SP: {
        server_service_id: 1,
        service_name: '清洗',
        number: 1,
        name: '精洗',
        material: 3,
        service_id: 1,
        item_id: 2,
        num: [],
        items: [],
        submit: []
      },
      data: that.data.moreData
    }
    morePriceArr.push(addContent)
    that.setData({
      morePriceArr,
    })
    that.shopPriceMuch();
  },
  // 多双清洗 删除单一项事件
  remove(e) {
    let that = this;
    // 获取第几项索引
    let idx = e.currentTarget.dataset.index;
    // 获取列表数组
    let morePriceArr = that.data.morePriceArr;
    let newArr = [];
    // 删除当前项
    morePriceArr.forEach((item, index) => {
      if (idx != index) {
        newArr.push(item)
      }
    })
    that.setData({
      morePriceArr: newArr
    })
    that.shopPriceMuch();
  },
  // 标洗精洗选择弹出(多双)
  chooseWashMore: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var animation = wx.createAnimation({
      // 动画持续时间
      duration: 500,
      // 定义动画效果，当前是匀速
      timingFunction: 'linear'
    });
    that.animation = animation;
    animation.translateY(200).step();
    that.setData({
      // 通过export()方法导出数据
      animationData: animation.export(),
      // 改变view里面的Wx：if
      washMuch: true,
      indexClean: index
    });
    // 设置setTimeout来改变y轴偏移量，实现有感觉的滑动
    setTimeout(function () {
      animation.translateY(0).step()
      that.setData({
        animationData: animation.export()
      })
    }, 200);
  },
  // 清洗选择
  chooseTextMuch: function (e) {
    var that = this;
    var indexs = e.currentTarget.dataset.indexs;
    var text = e.currentTarget.dataset.text;
    var morePriceArr = that.data.morePriceArr;
    var material = e.currentTarget.dataset.material;
    var service_id = e.currentTarget.dataset.service;
    var item_id = e.currentTarget.dataset.item;
    var server_service_id = e.currentTarget.dataset.server_service_id;
    var service_name = e.currentTarget.dataset.service_name;
    for (var i in morePriceArr) {
      if (i == indexs) {
        if (morePriceArr[i].currentTab == 0) {
          morePriceArr[i].PZ.name = text;
          morePriceArr[i].PZ.material = material;
          morePriceArr[i].PZ.service_id = service_id;
          morePriceArr[i].PZ.item_id = item_id;
          morePriceArr[i].PZ.server_service_id = server_service_id;
          morePriceArr[i].PZ.service_name = service_name;
          that.setData({
            morePriceArr: morePriceArr
          })
        } else if (morePriceArr[i].currentTab == 1) {
          morePriceArr[i].PK.name = text;
          morePriceArr[i].PK.material = material;
          morePriceArr[i].PK.service_id = service_id;
          morePriceArr[i].PK.item_id = item_id;
          morePriceArr[i].PK.server_service_id = server_service_id;
          morePriceArr[i].PK.service_name = service_name;
          that.setData({
            morePriceArr: morePriceArr
          })
        } else if (morePriceArr[i].currentTab == 2) {
          morePriceArr[i].SP.name = text;
          morePriceArr[i].SP.material = material;
          morePriceArr[i].SP.service_id = service_id;
          morePriceArr[i].SP.item_id = item_id;
          morePriceArr[i].SP.server_service_id = server_service_id;
          morePriceArr[i].SP.service_name = service_name;
          that.setData({
            morePriceArr: morePriceArr
          })
        }
      }
    }
    that.shopPriceMuch();
  },
  // 多双计算总价格
  shopPriceMuch: function () {
    var that = this;
    var morePriceArr = that.data.morePriceArr;
    var price = [];
    for (var i in morePriceArr) {
      if (morePriceArr[i].currentTab == 0) {
        var clear = [{
          material: morePriceArr[i].PZ.material,
          service_id: morePriceArr[i].PZ.service_id,
          item_id: morePriceArr[i].PZ.item_id,
        }]
        var priceArr = morePriceArr[i].PZ.items.concat(clear)
        for (var j in priceArr) {
          price.push(priceArr[j])
        }
      } else if (morePriceArr[i].currentTab == 1) {
        var clear = [{
          material: morePriceArr[i].PK.material,
          service_id: morePriceArr[i].PK.service_id,
          item_id: morePriceArr[i].PK.item_id,
        }]
        var priceArr = morePriceArr[i].PK.items.concat(clear)
        for (var j in priceArr) {
          price.push(priceArr[j])
        }
      } else if (morePriceArr[i].currentTab == 2) {
        var clear = [{
          material: morePriceArr[i].SP.material,
          service_id: morePriceArr[i].SP.service_id,
          item_id: morePriceArr[i].SP.item_id,
        }]
        var priceArr = morePriceArr[i].SP.items.concat(clear)
        for (var j in priceArr) {
          price.push(priceArr[j])
        }
      }
    }
    var items = JSON.stringify(price);
    wx.request({
      url: app.globalData.url + '/api/ext/care/item/price',
      data: {
        items: items,
        shoes_total: morePriceArr.length
      },
      method: 'POST',
      success: function (res) {
        that.setData({
          moneyMuch: res.data.data.sum_price,
          old_moneyMuch: res.data.data.sum_price_original,
          reason: res.data.data.reason
        })
      },
      fail: function (res) { },
    })
  },
  // 多双附加服务弹出
  attachMuch: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var newMorePriceArr = that.data.morePriceArr;
    that.setData({
      serviceMuch: true,
      indexService: index,
      newMorePriceArr: newMorePriceArr
    });
  },
  // 附加服务多双
  servierSureMuch1: function (e) {
    var that = this;
    var morePriceArr = that.data.morePriceArr;
    var indexs = e.currentTarget.dataset.indexs;
    var data = that.data.data; //所有列表数据
    var itemid = e.currentTarget.dataset.itemid;
    var name = e.currentTarget.dataset.name;
    for (var i in morePriceArr) {
      if (indexs == i) {
        for (var j in morePriceArr[i].data) {
          if (itemid == morePriceArr[i].data[j].id) {
            for (var k in morePriceArr[i].data[j].item) {
              if (morePriceArr[i].currentTab == 0) {
                if (name == morePriceArr[i].data[j].item[k].item_name) {
                  if (morePriceArr[i].data[j].item[k].morePZ == true) {
                    morePriceArr[i].data[j].item[k].morePZ = false
                  } else {
                    morePriceArr[i].data[j].item[k].morePZ = true
                  }
                } else {
                  morePriceArr[i].data[j].item[k].morePZ = false
                }
              } else if (morePriceArr[i].currentTab == 1) {
                if (name == morePriceArr[i].data[j].item[k].item_name) {
                  if (morePriceArr[i].data[j].item[k].morePK == true) {
                    morePriceArr[i].data[j].item[k].morePK = false
                  } else {
                    morePriceArr[i].data[j].item[k].morePK = true
                  }
                } else {
                  morePriceArr[i].data[j].item[k].morePK = false
                }
              } else if (morePriceArr[i].currentTab == 2) {
                if (name == morePriceArr[i].data[j].item[k].item_name) {
                  if (morePriceArr[i].data[j].item[k].moreSP == true) {
                    morePriceArr[i].data[j].item[k].moreSP = false
                  } else {
                    morePriceArr[i].data[j].item[k].moreSP = true
                  }
                } else {
                  morePriceArr[i].data[j].item[k].moreSP = false
                }
              }
            }
          }
        }
      }
    }
    that.setData({
      morePriceArr: morePriceArr
    })
  },
  servierSureMuch2: function (e) {
    var that = this;
    var morePriceArr = that.data.morePriceArr;
    var indexs = e.currentTarget.dataset.indexs;
    var data = that.data.data; //所有列表数据
    var itemid = e.currentTarget.dataset.itemid;
    var name = e.currentTarget.dataset.name;
    for (var i in morePriceArr) {
      if (indexs == i) {
        for (var j in morePriceArr[i].data) {
          if (itemid == morePriceArr[i].data[j].id) {
            for (var k in morePriceArr[i].data[j].item) {
              if (morePriceArr[i].currentTab == 0) {
                if (name == morePriceArr[i].data[j].item[k].item_name) {
                  if (morePriceArr[i].data[j].item[k].morePZ == true) {
                    morePriceArr[i].data[j].item[k].morePZ = false
                  } else {
                    morePriceArr[i].data[j].item[k].morePZ = true
                  }
                } else {
                  morePriceArr[i].data[j].item[k].morePZ = false
                }
              } else if (morePriceArr[i].currentTab == 1) {
                if (name == morePriceArr[i].data[j].item[k].item_name) {
                  if (morePriceArr[i].data[j].item[k].morePK == true) {
                    morePriceArr[i].data[j].item[k].morePK = false
                  } else {
                    morePriceArr[i].data[j].item[k].morePK = true
                  }
                } else {
                  morePriceArr[i].data[j].item[k].morePK = false
                }
                if (morePriceArr[i].data[j].item[1].morePK == true) {
                  morePriceArr[i].data[j].item[0].morePK = false
                } else {
                  morePriceArr[i].data[j].item[0].morePK = true
                }
              } else if (morePriceArr[i].currentTab == 2) {
                if (name == morePriceArr[i].data[j].item[k].item_name) {
                  if (morePriceArr[i].data[j].item[k].moreSP == true) {
                    morePriceArr[i].data[j].item[k].moreSP = false
                  } else {
                    morePriceArr[i].data[j].item[k].moreSP = true
                  }
                } else {
                  morePriceArr[i].data[j].item[k].moreSP = false
                }
              }
            }
          }
        }
      }
    }
    that.setData({
      morePriceArr: morePriceArr
    })
  },
  servierSureMuch3: function (e) {
    var that = this;
    var morePriceArr = that.data.morePriceArr;
    var indexs = e.currentTarget.dataset.indexs;
    var data = that.data.data; //所有列表数据
    var itemid = e.currentTarget.dataset.itemid;
    var name = e.currentTarget.dataset.name;
    for (var i in morePriceArr) {
      if (indexs == i) {
        for (var j in morePriceArr[i].data) {
          if (itemid == morePriceArr[i].data[j].id) {
            for (var k in morePriceArr[i].data[j].item) {
              if (morePriceArr[i].currentTab == 0) {
                if (name == morePriceArr[i].data[j].item[k].item_name) {
                  if (morePriceArr[i].data[j].item[k].morePZ == true) {
                    morePriceArr[i].data[j].item[k].morePZ = false
                  } else {
                    morePriceArr[i].data[j].item[k].morePZ = true
                  }
                } else {
                  morePriceArr[i].data[j].item[k].morePZ = false
                }
              } else if (morePriceArr[i].currentTab == 1) {
                if (name == morePriceArr[i].data[j].item[k].item_name) {
                  if (morePriceArr[i].data[j].item[k].morePK == true) {
                    morePriceArr[i].data[j].item[k].morePK = false
                  } else {
                    morePriceArr[i].data[j].item[k].morePK = true
                  }
                } else {
                  morePriceArr[i].data[j].item[k].morePK = false
                }
              } else if (morePriceArr[i].currentTab == 2) {
                if (name == morePriceArr[i].data[j].item[k].item_name) {
                  if (morePriceArr[i].data[j].item[k].moreSP == true) {
                    morePriceArr[i].data[j].item[k].moreSP = false
                  } else {
                    morePriceArr[i].data[j].item[k].moreSP = true
                  }
                } else {
                  morePriceArr[i].data[j].item[k].moreSP = false
                }
              }
            }
          }
        }
      }
    }
    that.setData({
      morePriceArr: morePriceArr
    })
  },
  // 多双确定
  sureMuch: function () {
    var that = this;
    // var indexs = e.currentTarget.dataset.indexs;
    var morePriceArr = that.data.morePriceArr;
    for (var i in morePriceArr) {
      // if (indexs == i) {
      if (morePriceArr[i].currentTab == 0) {
        var services = [];
        var submit = [];
        var num = [];
        for (var j in morePriceArr[i].data) {
          if (morePriceArr[i].data[j].id == 10) {
            for (var k in morePriceArr[i].data[j].item) {
              if (morePriceArr[i].data[j].item[k].morePZ == true) {
                var ser1 = {
                  material: morePriceArr[i].currentTab + 1,
                  service_id: morePriceArr[i].data[j].item[k].service_id,
                  item_id: morePriceArr[i].data[j].item[k].id
                }
                var submit1 = {
                  server_service_id: morePriceArr[i].data[j].server_service_id,
                  service_id: morePriceArr[i].data[j].item[k].service_id,
                  service_name: morePriceArr[i].data[j].name,
                  item_id: morePriceArr[i].data[j].item[k].id,
                  item_name: morePriceArr[i].data[j].item[k].item_name,
                  number: 1
                }
                submit.push(submit1)
                services.push(ser1)
                num.push(1)
              }
            }
          }
          if (morePriceArr[i].data[j].id == 6) {
            for (var k in morePriceArr[i].data[j].item) {
              if (morePriceArr[i].data[j].item[k].morePZ == true) {
                var ser2 = {
                  material: morePriceArr[i].currentTab + 1,
                  service_id: morePriceArr[i].data[j].item[k].service_id,
                  item_id: morePriceArr[i].data[j].item[k].id
                }
                var submit2 = {
                  server_service_id: morePriceArr[i].data[j].server_service_id,
                  service_id: morePriceArr[i].data[j].item[k].service_id,
                  service_name: morePriceArr[i].data[j].name,
                  item_id: morePriceArr[i].data[j].item[k].id,
                  item_name: morePriceArr[i].data[j].item[k].item_name,
                  number: 1
                }
                submit.push(submit2)
                services.push(ser2)
                num.push(2)
              }
            }
          }
          if (morePriceArr[i].data[j].id == 7) {
            for (var k in morePriceArr[i].data[j].item) {
              if (morePriceArr[i].data[j].item[k].morePZ == true) {
                var ser3 = {
                  material: morePriceArr[i].currentTab + 1,
                  service_id: morePriceArr[i].data[j].item[k].service_id,
                  item_id: morePriceArr[i].data[j].item[k].id
                }
                var submit3 = {
                  server_service_id: morePriceArr[i].data[j].server_service_id,
                  service_id: morePriceArr[i].data[j].item[k].service_id,
                  service_name: morePriceArr[i].data[j].name,
                  item_id: morePriceArr[i].data[j].item[k].id,
                  item_name: morePriceArr[i].data[j].item[k].item_name,
                  number: 1
                }
                submit.push(submit3)
                services.push(ser3)
                num.push(3)
              }
            }
          }
        }
        morePriceArr[i].PZ.num = num.sort();
        morePriceArr[i].PZ.items = services;
        morePriceArr[i].PZ.submit = submit;
        that.setData({
          serviceMuch: false,
          morePriceArr: morePriceArr
        })
        that.shopPriceMuch();
      } else if (morePriceArr[i].currentTab == 1) {
        var services = [];
        var submit = [];
        var num = [];
        for (var j in morePriceArr[i].data) {
          if (morePriceArr[i].data[j].id == 10) {
            for (var k in morePriceArr[i].data[j].item) {
              if (morePriceArr[i].data[j].item[k].morePK == true) {
                var ser1 = {
                  material: morePriceArr[i].currentTab + 1,
                  service_id: morePriceArr[i].data[j].item[k].service_id,
                  item_id: morePriceArr[i].data[j].item[k].id
                }
                var submit1 = {
                  server_service_id: morePriceArr[i].data[j].server_service_id,
                  service_id: morePriceArr[i].data[j].item[k].service_id,
                  service_name: morePriceArr[i].data[j].name,
                  item_id: morePriceArr[i].data[j].item[k].id,
                  item_name: morePriceArr[i].data[j].item[k].item_name,
                  number: 1
                }
                submit.push(submit1)
                services.push(ser1)
                num.push(1)
              }
            }
          }
          if (morePriceArr[i].data[j].id == 6) {
            for (var k in morePriceArr[i].data[j].item) {
              if (morePriceArr[i].data[j].item[k].morePK == true) {
                var ser2 = {
                  material: morePriceArr[i].currentTab + 1,
                  service_id: morePriceArr[i].data[j].item[k].service_id,
                  item_id: morePriceArr[i].data[j].item[k].id
                }
                var submit2 = {
                  server_service_id: morePriceArr[i].data[j].server_service_id,
                  service_id: morePriceArr[i].data[j].item[k].service_id,
                  service_name: morePriceArr[i].data[j].name,
                  item_id: morePriceArr[i].data[j].item[k].id,
                  item_name: morePriceArr[i].data[j].item[k].item_name,
                  number: 1
                }
                submit.push(submit2)
                services.push(ser2)
                num.push(2)
              }
            }
          }
          if (morePriceArr[i].data[j].id == 7) {
            for (var k in morePriceArr[i].data[j].item) {
              if (morePriceArr[i].data[j].item[k].morePK == true) {
                var ser3 = {
                  material: morePriceArr[i].currentTab + 1,
                  service_id: morePriceArr[i].data[j].item[k].service_id,
                  item_id: morePriceArr[i].data[j].item[k].id
                }
                var submit3 = {
                  server_service_id: morePriceArr[i].data[j].server_service_id,
                  service_id: morePriceArr[i].data[j].item[k].service_id,
                  service_name: morePriceArr[i].data[j].name,
                  item_id: morePriceArr[i].data[j].item[k].id,
                  item_name: morePriceArr[i].data[j].item[k].item_name,
                  number: 1
                }
                submit.push(submit3)
                services.push(ser3)
                num.push(3)
              }
            }
          }
        }
        morePriceArr[i].PK.num = num.sort();
        morePriceArr[i].PK.items = services;
        morePriceArr[i].PK.submit = submit;
        that.setData({
          serviceMuch: false,
          morePriceArr: morePriceArr
        })
        that.shopPriceMuch();
      } else if (morePriceArr[i].currentTab == 2) {
        var services = [];
        var submit = [];
        var num = [];
        for (var j in morePriceArr[i].data) {
          if (morePriceArr[i].data[j].id == 10) {
            for (var k in morePriceArr[i].data[j].item) {
              if (morePriceArr[i].data[j].item[k].moreSP == true) {
                var ser1 = {
                  material: morePriceArr[i].currentTab + 1,
                  service_id: morePriceArr[i].data[j].item[k].service_id,
                  item_id: morePriceArr[i].data[j].item[k].id
                }
                var submit1 = {
                  server_service_id: morePriceArr[i].data[j].server_service_id,
                  service_id: morePriceArr[i].data[j].item[k].service_id,
                  service_name: morePriceArr[i].data[j].name,
                  item_id: morePriceArr[i].data[j].item[k].id,
                  item_name: morePriceArr[i].data[j].item[k].item_name,
                  number: 1
                }
                submit.push(submit1)
                services.push(ser1)
                num.push(1)
              }
            }
          }
          if (morePriceArr[i].data[j].id == 6) {
            for (var k in morePriceArr[i].data[j].item) {
              if (morePriceArr[i].data[j].item[k].moreSP == true) {
                var ser2 = {
                  material: morePriceArr[i].currentTab + 1,
                  service_id: morePriceArr[i].data[j].item[k].service_id,
                  item_id: morePriceArr[i].data[j].item[k].id
                }
                var submit2 = {
                  server_service_id: morePriceArr[i].data[j].server_service_id,
                  service_id: morePriceArr[i].data[j].item[k].service_id,
                  service_name: morePriceArr[i].data[j].name,
                  item_id: morePriceArr[i].data[j].item[k].id,
                  item_name: morePriceArr[i].data[j].item[k].item_name,
                  number: 1
                }
                submit.push(submit2)
                services.push(ser2)
                num.push(2)
              }
            }
          }
          if (morePriceArr[i].data[j].id == 7) {
            for (var k in morePriceArr[i].data[j].item) {
              if (morePriceArr[i].data[j].item[k].moreSP == true) {
                var ser3 = {
                  material: morePriceArr[i].currentTab + 1,
                  service_id: morePriceArr[i].data[j].item[k].service_id,
                  item_id: morePriceArr[i].data[j].item[k].id
                }
                var submit3 = {
                  server_service_id: morePriceArr[i].data[j].server_service_id,
                  service_id: morePriceArr[i].data[j].item[k].service_id,
                  service_name: morePriceArr[i].data[j].name,
                  item_id: morePriceArr[i].data[j].item[k].id,
                  item_name: morePriceArr[i].data[j].item[k].item_name,
                  number: 1
                }
                submit.push(submit3)
                services.push(ser3)
                num.push(3)
              }
            }
          }
        }
        morePriceArr[i].SP.num = num.sort();
        morePriceArr[i].SP.items = services;
        morePriceArr[i].SP.submit = submit;
        that.setData({
          serviceMuch: false,
          morePriceArr: morePriceArr
        })
        that.shopPriceMuch();
      }
      // }
    }
  },
  // 多双取消
  cancelMuch: function () {
    var that = this;
    var newMorePriceArr = that.data.newMorePriceArr;
    that.setData({
      serviceMuch: false,
      morePriceArr: newMorePriceArr
    })
  },
  // 点击看大图
  bigImg: function (e) {
    var that = this;
    var src = e.currentTarget.dataset.src;
    wx.previewImage({
      current: src,
      urls: that.data.bigImgs
    })
  },
  // 洗护流程
  flow: function () {
    var that = this;
    if (that.data.flow == false) {
      that.setData({
        flow: true
      })
    }
  },
  hideFlow: function () {
    var that = this;
    if (that.data.flow == true) {
      that.setData({
        flow: false
      })
    }
  },
  // 单双下单
  singleSubmit: function () {
    var that = this;
    app.isToken(
      function goNext() {
        var currentTab = that.data.currentTab;
        var priceArr = that.data.priceArr;
        var prompt = wx.getStorageSync('prompt')
        var material;
        if (prompt == true) {
          that.setData({
            modal: true,
            which: 1
          })
        } else {
          var token = wx.getStorageSync('token')
          if (currentTab == 0) {
            var submit = [{
              server_service_id: priceArr.PZ.server_service_id,
              service_id: priceArr.PZ.service_id,
              service_name: priceArr.PZ.service_name,
              item_id: priceArr.PZ.item_id,
              item_name: priceArr.PZ.name,
              number: priceArr.PZ.number
            }];
            var buy_item = priceArr.PZ.submit.concat(submit);
            material = 1
          } else if (currentTab == 1) {
            var submit = [{
              server_service_id: priceArr.PK.server_service_id,
              service_id: priceArr.PK.service_id,
              service_name: priceArr.PK.service_name,
              item_id: priceArr.PK.item_id,
              item_name: priceArr.PK.name,
              number: priceArr.PK.number
            }]
            var buy_item = priceArr.PK.submit.concat(submit);
            material = 2
          } else if (currentTab == 2) {
            var submit = [{
              server_service_id: priceArr.SP.server_service_id,
              service_id: priceArr.SP.service_id,
              service_name: priceArr.SP.service_name,
              item_id: priceArr.SP.item_id,
              item_name: priceArr.SP.name,
              number: priceArr.SP.number
            }]
            var buy_item = priceArr.SP.submit.concat(submit);
            material = 3
          }
          wx.request({
            url: app.globalData.url + '/api/ext/care/order/user/buy_items',
            method: 'POST',
            data: {
              token: token,
              order_type: 1,
              material: material,
              buy_item: buy_item
            },
            success: function (res) {
              if (res.data.status == 201) {
                wx.navigateTo({
                  url: '/pages/publicOrder/publicOrder?module=0&log_id=' + res.data.data.log_id + '&tag=' + 5,
                })
              }
            },
            fail: function (e) {
              console.log(e)
            }
          })
        }
      }
    );
  },
  // 多双下单
  moreSubmit: function () {
    var that = this;
    app.isToken(
      function goNext() {
        var morePriceArr = that.data.morePriceArr;
        var prompt = wx.getStorageSync('prompt')
        var buy_item = [];
        if (prompt == true) {
          that.setData({
            modal: true,
            which: 2
          })
        } else {
          var token = wx.getStorageSync('token')
          for (var i in morePriceArr) {
            if (morePriceArr[i].currentTab == 0) {
              var submit = [{
                server_service_id: morePriceArr[i].PZ.server_service_id,
                service_id: morePriceArr[i].PZ.service_id,
                service_name: morePriceArr[i].PZ.service_name,
                item_id: morePriceArr[i].PZ.item_id,
                item_name: morePriceArr[i].PZ.name,
                number: morePriceArr[i].PZ.number
              }];
              var info = morePriceArr[i].PZ.submit.concat(submit);
              var datas = {
                material: 1,
                buy_item: info
              }
            } else if (morePriceArr[i].currentTab == 1) {
              var submit = [{
                server_service_id: morePriceArr[i].PK.server_service_id,
                service_id: morePriceArr[i].PK.service_id,
                service_name: morePriceArr[i].PK.service_name,
                item_id: morePriceArr[i].PK.item_id,
                item_name: morePriceArr[i].PK.name,
                number: morePriceArr[i].PK.number
              }];
              var info = morePriceArr[i].PK.submit.concat(submit);
              var datas = {
                material: 2,
                buy_item: info
              }
            } else if (morePriceArr[i].currentTab == 2) {
              var submit = [{
                server_service_id: morePriceArr[i].SP.server_service_id,
                service_id: morePriceArr[i].SP.service_id,
                service_name: morePriceArr[i].SP.service_name,
                item_id: morePriceArr[i].SP.item_id,
                item_name: morePriceArr[i].SP.name,
                number: morePriceArr[i].SP.number
              }];
              var info = morePriceArr[i].SP.submit.concat(submit);
              var datas = {
                material: 3,
                buy_item: info
              }
            }
            buy_item.push(datas)
          }
          wx.request({
            url: app.globalData.url + '/api/ext/care/order/user/buy_items',
            method: 'POST',
            data: {
              token: token,
              order_type: 2,
              buy_item: buy_item,
            },
            success: function (res) {
              if (res.data.status == 201) {
                wx.navigateTo({
                  url: '/pages/publicOrder/publicOrder?module=0&log_id=' + res.data.data.log_id + '&tag=' + 6 + "&shoes_total=" + buy_item.length,
                })
              }
            },
            fail: function (e) {
              console.log(e)
            }
          })
        }
      }
    );
  },
  // 常见问题
  commonProblem: function () {
    wx.navigateTo({
      url: '/pages/commonProblem/commonProblem',
    })
  },
  // 费用标准
  priceList: function () {
    wx.navigateTo({
      url: '/pages/priceList/priceList',
    })
  },
  // 修复服务
  goXiuFu: function () {
    wx.navigateTo({
      url: '/pages/repairHome/repairHome',
    })
  },
  // 洗护用品
  goYongpin: function () {
    var that = this;
    if (that.data.flow == false) {
      that.setData({
        yongpin: true
      })
    }
  },
  yongpin: function () {
    var that = this;
    that.setData({
      yongpin: false
    })
  },
  // 会员中心
  goHuiYuan: function () {
    var that = this;
    app.isToken(
      function goNext() {
        wx.navigateTo({
          url: '/pages/memberHome/memberHome',
        })
      }
    );
  },
  // 改色补色
  colorChange: function () {
    wx.reLaunch({
      url: '/pages/colorHome/colorHome',
    })
  },

  // 自助服务
  featureService: function () {
    wx.reLaunch({
      url: '/pages/specialHome/specialHome',
    })
  },
  // 洗护订单
  cleanOrder: function () {
    app.isToken(
      function goNext() {
        wx.navigateTo({
          url: '/pages/orders/orders',
        })
      }
    );
  },
  // 不再提醒
  noPrompt: function () {
    var that = this;
    if (that.data.prompt == true) {
      that.setData({
        prompt: false
      })
      wx.setStorageSync('prompt', false)
    } else {
      that.setData({
        prompt: true
      })
      wx.setStorageSync('prompt', true)
    }
  },
  // 提示模态层确定
  confirm: function () {
    var that = this;
    if (that.data.which == 1) {
      app.isToken(
        function goNext() {
          var currentTab = that.data.currentTab;
          var priceArr = that.data.priceArr;
          var material;
          var token = wx.getStorageSync('token')
          if (currentTab == 0) {
            var submit = [{
              server_service_id: priceArr.PZ.server_service_id,
              service_id: priceArr.PZ.service_id,
              service_name: priceArr.PZ.service_name,
              item_id: priceArr.PZ.item_id,
              item_name: priceArr.PZ.name,
              number: priceArr.PZ.number
            }];
            var buy_item = priceArr.PZ.submit.concat(submit);
            material = 1
          } else if (currentTab == 1) {
            var submit = [{
              server_service_id: priceArr.PK.server_service_id,
              service_id: priceArr.PK.service_id,
              service_name: priceArr.PK.service_name,
              item_id: priceArr.PK.item_id,
              item_name: priceArr.PK.name,
              number: priceArr.PK.number
            }]
            var buy_item = priceArr.PK.submit.concat(submit);
            material = 2
          } else if (currentTab == 2) {
            var submit = [{
              server_service_id: priceArr.SP.server_service_id,
              service_id: priceArr.SP.service_id,
              service_name: priceArr.SP.service_name,
              item_id: priceArr.SP.item_id,
              item_name: priceArr.SP.name,
              number: priceArr.SP.number
            }]
            var buy_item = priceArr.SP.submit.concat(submit);
            material = 3
          }
          wx.request({
            url: app.globalData.url + '/api/ext/care/order/user/buy_items',
            method: 'POST',
            data: {
              token: token,
              order_type: 1,
              material: material,
              buy_item: buy_item
            },
            success: function (res) {
              if (res.data.status == 201) {
                wx.navigateTo({
                  url: '/pages/publicOrder/publicOrder?module=0&log_id=' + res.data.data.log_id + '&tag=' + 5,
                })
              }
              that.setData({
                modal: false
              })
            },
            fail: function (e) {
              console.log(e)
            }
          })
        }
      );
    } else {
      app.isToken(
        function goNext() {
          var morePriceArr = that.data.morePriceArr;
          var buy_item = [];
          var token = wx.getStorageSync('token')
          for (var i in morePriceArr) {
            if (morePriceArr[i].currentTab == 0) {
              var submit = [{
                server_service_id: morePriceArr[i].PZ.server_service_id,
                service_id: morePriceArr[i].PZ.service_id,
                service_name: morePriceArr[i].PZ.service_name,
                item_id: morePriceArr[i].PZ.item_id,
                item_name: morePriceArr[i].PZ.name,
                number: morePriceArr[i].PZ.number
              }];
              var info = morePriceArr[i].PZ.submit.concat(submit);
              var datas = {
                material: 1,
                buy_item: info
              }
            } else if (morePriceArr[i].currentTab == 1) {
              var submit = [{
                server_service_id: morePriceArr[i].PK.server_service_id,
                service_id: morePriceArr[i].PK.service_id,
                service_name: morePriceArr[i].PK.service_name,
                item_id: morePriceArr[i].PK.item_id,
                item_name: morePriceArr[i].PK.name,
                number: morePriceArr[i].PK.number
              }];
              var info = morePriceArr[i].PK.submit.concat(submit);
              var datas = {
                material: 2,
                buy_item: info
              }
            } else if (morePriceArr[i].currentTab == 2) {
              var submit = [{
                server_service_id: morePriceArr[i].SP.server_service_id,
                service_id: morePriceArr[i].SP.service_id,
                service_name: morePriceArr[i].SP.service_name,
                item_id: morePriceArr[i].SP.item_id,
                item_name: morePriceArr[i].SP.name,
                number: morePriceArr[i].SP.number
              }];
              var info = morePriceArr[i].SP.submit.concat(submit);
              var datas = {
                material: 3,
                buy_item: info
              }
            }
            buy_item.push(datas)
          }
          wx.request({
            url: app.globalData.url + '/api/ext/care/order/user/buy_items',
            method: 'POST',
            data: {
              token: token,
              order_type: 2,
              buy_item: buy_item
            },
            success: function (res) {
              if (res.data.status == 201) {
                wx.navigateTo({
                  url: '/pages/publicOrder/publicOrder?module=0&log_id=' + res.data.data.log_id + '&tag=' + 6,
                })
                that.setData({
                  modal: false
                })
              }
            },
            fail: function (e) {
              console.log(e)
            }
          })
        }
      );
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if (options.chatTo == 'bu-0000000176') {
      wx.navigateTo({
        url: '/partials/chating/chating?chatTo=' + options.chatTo,
      })
      that.setData({
        tixing: 0
      })
    }
    // mta
    mta.Page.init()
    // 这里第一次请求数据
    that.getData();
    that.getImg();
    that.getPrice();
    that.shopPrice();
    that.shopPriceMuch();
    // 解析scene值
    var scene = decodeURIComponent(options.scene);
    if (scene != 'undefined') {
      var pid = scene.match(/pid=(\S*)/)[1];
      var token = wx.getStorageSync('token');
      if (token) {
        wx.setStorageSync('pid', pid);
        app.isToken(
          function goNext(token) {
            wx.request({
              url: app.globalData.url + '/api/wechat/ma/parent/bind',
              method: 'POST',
              data: {
                token: token,
                miniapp_name: 'care',
                pid: pid
              },
              success: function (res) {
                if (res.data.status == 201) {
                  wx.removeStorageSync('pid');
                }
              },
              fail: function (error) {
                console.log(error)
              }
            })
          }
        )
      } else {
        wx.setStorageSync('pid', pid);
      }
    }
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
    var that = this;
    let token = wx.getStorageSync("token");
    if (token) {
      app.isToken(function goNext() {
        let token = wx.getStorageSync("token");
        wx.request({
          url: app.globalData.url + '/api/ext/care/order/is-shop',
          method: "GET",
          data: {
            token
          },
          success(res) {
            if (res.data.status == 200) {
              if (res.data.is_shop == 1) {
                that.setData({
                  store_SH: true
                })
              } else {
                that.setData({
                  store_SH: false
                })
              }
            }
          },
          fail(res) {
            console.log(res)
          }
        })
      })
    }

    // 清空优惠券id数组
    that.setData({
      openType: app.globalData.openType
    })
    app.cleanCouponArr();
  },
  /**
   * 网易云信登录逻辑
   */
  login: function (user) {
    let self = this
    this.setData({
      isLogin: true
    })
    app.globalData.isLogin = true
    setTimeout(() => {
      if (app.globalData.isLogin === true) {
        // self.setData({
        //     isLogin: false
        // })
        // wx.showToast({
        //     title: '请检查网络',
        //     icon: 'none',
        //     duration: 1500
        // })
      }
    }, 15 * 1000)
    new IMEventHandler({
      token: user.password,
      account: user.account
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    var that = this;
    clearInterval(that.data.interval)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    var that = this;
    clearInterval(that.data.interval)
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
    var that = this;
    if (that.data.moreCan == true) {
      wx.request({
        url: app.globalData.url + '/api/ext/care/static/image',
        method: 'GET',
        data: {
          care_service_id: 1,
          attribute: 2,
          page: ++that.data.page
        },
        success: function (res) {
          if (res.data.data.length != 0) {
            var data = res.data.data;
            var effectImage = that.data.effectImage;
            var imgs = that.data.bigImgs
            for (var i in data) {
              effectImage.push(data[i])
              imgs.push(that.data.imgUrl + data[i].path)
            }
            that.setData({
              effectImage: effectImage,
              bigImgs: imgs
            })
          } else {
            that.setData({
              moreCan: false
            });
            wx.showToast({
              title: '已经到底了',
              duration: 1500,
              icon: 'none',
              mask: true
            })
          }
        },
        fail: function (e) {
          console.log(e)
        }
      })
    } else {
      wx.showToast({
        title: '已经到底了',
        duration: 1500,
        icon: 'none',
        mask: true
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    if (res[0].from === 'menu') {
      return {
        title: '极致工序，追求零损伤洗护！',
        path: '/pages/clean/clean',
        imageUrl: 'https://mini.tosneaker.com/assets/care/images_ma/change_share_default.png',
      }
    }
  }
})