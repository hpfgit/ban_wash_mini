// pages/sendToStoreUser/sendToStoreUser.js
let app = getApp();
const recorderManager = wx.getRecorderManager();
const qiniuUploader = require("../../utils/qiniuUploader"); //七牛sdk
Page({
  /**
   * 页面的初始数据
   */
  data: {
    is_tab: 1,
    static: app.globalData.statics,
    user: {},
    // 以下是清洗的数据
    serviceMuch: false,
    indexService: 0,
    qx_price: 0,
    addServiceData: [], // 附加服务项
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
    // 以下是修复的数据
    max: 500, //最大输入字数
    currentWordNumber: 0, //当前输入字数
    imgs: [{
        default: 'https://static.tosneaker.com/uploads/wash/wxxcx/image/zhengmian.png',
        pic: ''
      },
      {
        default: 'https://static.tosneaker.com/uploads/wash/wxxcx/image/change_repair_face.png',
        pic: ''
      },
      {
        default: 'https://static.tosneaker.com/uploads/wash/wxxcx/image/change_repair_con.png',
        pic: ''
      },
      {
        default: 'https://static.tosneaker.com/uploads/wash/wxxcx/image/xiehougen.png',
        pic: ''
      },
      {
        default: 'https://static.tosneaker.com/uploads/wash/wxxcx/image/xiedi.png',
        pic: ''
      },
      {
        default: 'https://static.tosneaker.com/uploads/wash/wxxcx/image/xiaci.png',
        pic: ''
      }
    ],
    // 方案
    service: [], //选中方案数组
    choose: [{
        text: '鞋面修复',
        checked: false
      },
      {
        text: '中底修复',
        checked: false
      },
      {
        text: '粘胶',
        checked: false
      },
      {
        text: '去油处理',
        checked: false
      },
      {
        text: '翻毛皮提色',
        checked: false
      },
      {
        text: '发黄去氧化',
        checked: false
      },
      {
        text: '破洞织补',
        checked: false
      },
      {
        text: '内衬更换',
        checked: false
      },
      {
        text: '串色处理',
        checked: false
      },
      {
        text: '局部改色',
        checked: false
      },
    ],
    // 七牛token
    qiniuToken: '',
    isRecording: true, // 是否录音
    textarea: '', // 备注文本
    picItem: [], //展示的图片路径数组
    voiceItem: [], //展示的录音路径数组
    videoItem: [], // 展示的视频路径数组
    positionImg: {}, //六张详情图
    help_audio: [], //上传的录音数组
    help_image: [], //上传的图片数组
    help_video: [] //上传的视频数组
  },
  // 切换清洗与修复状态
  change_tab(e) {
    let is_tab = e.currentTarget.dataset.index;
    this.setData({
      is_tab
    })
  },
  // 扫码获取用户信息
  scanCode() {
    let that = this;
    wx.scanCode({
      success(res) {
        const userInfo = JSON.parse(res.result);
        console.log(userInfo.avatar);
        that.setData({
          user: userInfo
        })
      }
    })
  },
  // ***************************************清洗相关*************************************
  // 再添加一双
  add: function() {
    var that = this;
    var morePriceArr = that.data.morePriceArr;
    wx.request({
      url: app.globalData.url + '/api/ext/care/pricetable',
      method: 'GET',
      data: {},
      success: function(res) {
        console.log(res.data.data)
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
          data: res.data.data
        }
        if (morePriceArr.length < 10) {
          morePriceArr.push(addContent)
          that.setData({
            morePriceArr: morePriceArr
          })
          that.shopPriceMuch();
        } else {
          wx.showToast({
            title: '多双清洗最多添加十双',
            duration: 1500,
            icon: 'none',
            mask: true
          })
        }
      }
    })
  },
  // 清空列表
  empty() {
    this.setData({
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
    })
    this.shopPriceMuch();
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
  // 获取附加服务项
  getPrice: function() {
    var that = this;
    var morePriceArr = that.data.morePriceArr;
    wx.request({
      url: app.globalData.url + '/api/ext/care/pricetable',
      method: 'GET',
      data: {},
      success: function(res) {
        for (var i in morePriceArr) {
          morePriceArr[i].data = res.data.data
        }
        that.setData({
          addServiceData: res.data.data,
          morePriceArr: morePriceArr,
        })
      }
    })
  },
  // 附加服务选择
  servierSureMuch(e) {
    let {
      indexs,
      index,
      inx,
      current,
      num
    } = e.currentTarget.dataset;
    let backup_arr = this.data.morePriceArr;
    backup_arr[indexs].data[index].item.forEach((item, index) => {
      if (index == inx) {
        if (current == 0) {
          // 皮质
          if (item.selectPZ) {
            item.selectPZ = false;
            let i = backup_arr[indexs].PZ.num.indexOf(num);
            backup_arr[indexs].PZ.num.splice(i, 1)
            return
          }
          if (!backup_arr[indexs].PZ.num.includes(num)) {
            backup_arr[indexs].PZ.num.push(num);
          }
          item.selectPZ = true;
        } else if (current == 1) {
          // 翻毛皮
          if (item.selectFMP) {
            item.selectFMP = false;
            let i = backup_arr[indexs].PK.num.indexOf(num);
            backup_arr[indexs].PK.num.splice(i, 1)
            return
          }
          if (!backup_arr[indexs].PK.num.includes(num)) {
            backup_arr[indexs].PK.num.push(num);
          }
          item.selectFMP = true;
        } else if (current == 2) {
          // 其他
          if (item.selectQT) {
            item.selectQT = false;
            let i = backup_arr[indexs].SP.num.indexOf(num);
            backup_arr[indexs].SP.num.splice(i, 1)
            return
          }
          if (!backup_arr[indexs].SP.num.includes(num)) {
            backup_arr[indexs].SP.num.push(num);
          }
          item.selectQT = true;
        }
      } else {
        if (current == 0) {
          // 皮质
          item.selectPZ = false;
        } else if (current == 1) {
          // 翻毛皮
          item.selectFMP = false;
        } else if (current == 2) {
          // 其他
          item.selectQT = false;
        }
      }
    })
    this.setData({
      morePriceArr: backup_arr
    })
  },
  // 取消附加服务弹出框
  cancelMuch(e) {
    let indexs = e.currentTarget.dataset.indexs; //确定是哪一个商品的索引
    let current = e.currentTarget.dataset.current;
    let backup_arr = this.data.morePriceArr;
    backup_arr[indexs].data.forEach(item => {
      item.item.forEach(itm => {
        if (current == 0) {
          itm.selectPZ = false
        } else if (current == 1) {
          itm.selectFMP = false
        } else if (current == 2) {
          itm.selectQT = false
        }
      })
    })
    this.setData({
      morePriceArr: backup_arr,
      serviceMuch: false
    })
  },
  // 确定附加服务弹出框
  sureMuch() {
    this.setData({
      serviceMuch: false
    })
    this.shopPriceMuch();
  },
  // 计算价格
  shopPriceMuch() {
    let that = this;
    let arr = [];
    let morePriceArr = this.data.morePriceArr;
    console.log(morePriceArr)
    morePriceArr.forEach((item, index) => {
      // 创建默认服务
      let obj = {};
      obj.material = Number(item.currentTab) + 1;
      obj.service_id = 1;
      obj.item_id = 2;
      arr.push(obj);
      item.data.forEach(itm => {
        if (itm.id == 10 || itm.id == 6 || itm.id == 7) {
          let obj = {};
          obj.material = Number(item.currentTab) + 1;
          itm.item.forEach(it => {
            if (item.currentTab == 0) {
              // 皮质
              if (it.selectPZ) {
                obj.service_id = it.service_id;
                obj.item_id = it.id;
              }
            } else if (item.currentTab == 1) {
              // 翻毛皮
              if (it.selectFMP) {
                obj.service_id = it.service_id;
                obj.item_id = it.id;
              }
            } else if (item.currentTab == 2) {
              // 其他面料
              if (it.selectQT) {
                obj.service_id = it.service_id;
                obj.item_id = it.id;
              }
            }
          })
          arr.push(obj)
        }
      })
    })
    let arr_ = [];
    arr.forEach(item => {
      if (item.service_id) {
        arr_.push(item)
      }
    })
    wx.request({
      url: app.globalData.url + '/api/ext/care/item/price',
      data: {
        items: JSON.stringify(arr_),
        shoes_total: morePriceArr.length
      },
      method: 'POST',
      success: function(res) {
        console.log(res.data)
        that.setData({
          qx_price: res.data.data.sum_price
        })
      },
      fail: function(res) {},
    })
  },
  // 切换材质
  change_select(e) {
    let morePriceArr = this.data.morePriceArr;
    let {
      index,
      current
    } = e.currentTarget.dataset;
    morePriceArr[index].currentTab = current;
    this.setData({
      morePriceArr
    })
    this.shopPriceMuch();
  },
  // 显示附加服务弹出框
  show_module(e) {
    let index = e.currentTarget.dataset.index;
    this.setData({
      indexService: index,
      serviceMuch: true
    })
  },
  // 清洗去下单
  singleSubmit: function() {
    wx.showLoading({
      title: '加载中...',
    });
    let user_id = this.data.user.user_id;
    if (!user_id) {
      wx.showToast({
        title: '请扫码获取user_id',
        icon: "none"
      })
      return
    }
    var that = this;
    app.isToken(
      function goNext() {
        var morePriceArr = that.data.morePriceArr;
        var token = wx.getStorageSync('token');
        let buy_item = []; // 包含几个商品
        morePriceArr.forEach((item, index) => {
          if (!item.img) {
            wx.showToast({
              title: '请上传鞋子左侧45°照片',
              icon: 'none'
            })
            return
          }
          if (item.currentTab == 0) {
            let arr = [{
              item_id: 2,
              item_name: "精洗",
              number: 1,
              server_service_id: 1,
              service_id: 1,
              service_name: "清洗"
            }];
            item.data.forEach(itm => {
              if (itm.id == 10 || itm.id == 6 || itm.id == 7) {
                itm.item.forEach(it => {
                  if (it.selectPZ) {
                    let obj = {
                      item_id: it.id,
                      item_name: it.item_name,
                      number: 1,
                      server_service_id: itm.server_service_id,
                      service_id: itm.id,
                      service_name: itm.name
                    }
                    arr.push(obj)
                  }
                })
              }
            })
            var datas = {
              material: item.currentTab + 1,
              left_image: item.img,
              buy_item: arr
            }
          } else if (item.currentTab == 1) {
            let arr = [{
              item_id: 2,
              item_name: "精洗",
              number: 1,
              server_service_id: 1,
              service_id: 1,
              service_name: "清洗"
            }];
            item.data.forEach(itm => {
              if (itm.id == 10 || itm.id == 6 || itm.id == 7) {
                itm.item.forEach(it => {
                  if (it.selectPZ) {
                    let obj = {
                      item_id: it.id,
                      item_name: it.item_name,
                      number: 1,
                      server_service_id: itm.server_service_id,
                      service_id: itm.id,
                      service_name: itm.name
                    }
                    arr.push(obj)
                  }
                })
              }
            })
            var datas = {
              material: item.currentTab + 1,
              left_image: item.img,
              buy_item: arr
            }
          } else if (item.currentTab == 2) {
            let arr = [{
              item_id: 2,
              item_name: "精洗",
              number: 1,
              server_service_id: 1,
              service_id: 1,
              service_name: "清洗"
            }];
            item.data.forEach(itm => {
              if (itm.id == 10 || itm.id == 6 || itm.id == 7) {
                itm.item.forEach(it => {
                  if (it.selectPZ) {
                    let obj = {
                      item_id: it.id,
                      item_name: it.item_name,
                      number: 1,
                      server_service_id: itm.server_service_id,
                      service_id: itm.id,
                      service_name: itm.name
                    }
                    arr.push(obj)
                  }
                })
              }
            })
            var datas = {
              material: item.currentTab + 1,
              left_image: item.img,
              buy_item: arr
            }
          }
          buy_item.push(datas);
          wx.request({
            url: app.globalData.url + '/api/ext/care/order/user/buy_items',
            method: 'POST',
            data: {
              token: token,
              user_id,
              order_type: 2,
              buy_item: buy_item,
            },
            success: function(res) {
              console.log(res)
              wx.request({
                url: app.globalData.url + '/api/oms/order',
                method: 'POST',
                data: {
                  care_log_id: res.data.data.log_id,
                  user_id,
                  user_name: that.data.user.name,
                  token,
                },
                success: function(response) {
                  wx.hideLoading();
                  wx.showToast({
                    title: '下单成功',
                  });
                  setTimeout(() => {
                    wx.navigateTo({
                      url: '/pages/clean/clean',
                    });
                  }, 500);
                  console.log(response)
                },
                fail: (err) => {
                  wx.hideLoading();
                }
              })
            },
            fail: function (e) {
              wx.hideLoading();
              console.log(e)
            }
          })
        })
      }
    );
  },
  // 清洗上传图片
  add_item_img(e) {
    var that = this;
    let index = e.currentTarget.dataset.index;
    let arr = that.data.morePriceArr;
    app.isToken(
      function goNext() {
        var token = wx.getStorageSync('token');
        wx.chooseImage({
          count: 1,
          sizeType: ['original', 'compressed'],
          sourceType: ['album', 'camera'],
          success: function(res) {
            var tempFilePath = res.tempFilePaths[0];
            var imgName = tempFilePath.substr(30, 50);
            qiniuUploader.upload(tempFilePath, (res) => {
              arr[index].img = res.imageURL;
              that.setData({
                morePriceArr: arr
              })
            }, (error) => {
              console.log(error)
            }, {
              region: 'NCN',
              uploadURL: 'https://upload-z1.qiniup.com',
              domain: app.globalData.qiniuImgUrl,
              key: 'uploads/_tmp/' + imgName,
              uptoken: that.data.qiniuToken
            })
          }
        })
      }
    )
  },
































  // **************************************************修复相关*****************************************
  // 提交修复订单
  submit: function() {
    var that = this;
    wx.showToast({
      title: '',
      duration: 1000000,
      icon: 'loading',
      mask: true
    })
    // 备注信息
    let {
      voiceItem,
      picItem,
      videoItem,
      positionImg,
      textarea,
      help_audio,
      help_image,
      help_video,
      service
    } = that.data;

    var content = service + '#' + textarea;
    var six_image = positionImg; // 球鞋详情图片

    Promise.all([that.voiceUploadQiniu(voiceItem), that.pcUploadQiniu(picItem), that.videoUploadQiniu(videoItem)]).then(result => {
      app.isToken(
        function goNext() {
          var token = wx.getStorageSync('token')
          if (Object.keys(six_image).length === 6) {
            if (that.data.textarea.length >= 10) {
              wx.request({
                url: app.globalData.url + '/api/ext/care/becare',
                method: 'POST',
                data: {
                  token: token,
                  order_type: 3,
                  six_image: six_image,
                  content: content,
                  help_image,
                  help_audio,
                  help_video
                },
                success: function(res) {
                  if (res.data.status == 200) {
                    wx.redirectTo({
                      url: '/pages/repairSubmit/repairSubmit'
                    })
                    wx.hideToast();
                  } else {
                    that.toast(res.data.message)
                  }
                },
                fail: function(res) {
                  console.log(res)
                }
              })
            } else {
              wx.showToast({
                title: '请输入10个字以上备注信息',
                duration: 1500,
                icon: 'none',
                mask: true
              })
              that.setData({
                help_audio: [], //上传的录音数组
                help_image: [], //上传的图片数组
                help_video: [] //上传的视频数组
              })
            }
          } else {
            that.toast('请上传6张对应介绍图')
            that.setData({
              help_audio: [], //上传的录音数组
              help_image: [], //上传的图片数组
              help_video: [] //上传的视频数组
            })
          }
        }
      )
    }).catch(res => {
      that.toast(res)
    })
  },
  // 发送formid
  find: function(e) {
    var formid = e.detail.formId;
    var newFormId = app.globalData.newFormId;
    if (formid != 'the formId is a mock one') {
      var timestamp = Date.parse(new Date());
      timestamp = timestamp / 1000;
      var formid = e.detail.formId;
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
  // 提示框
  toast: function(title) {
    wx.showToast({
      title: title,
      duration: 1000,
      icon: 'none',
      mask: true
    })
  },
  // 上传六张详情图
  uploadPic: function(e) {
    var that = this;
    app.isToken(
      function goNext() {
        var token = wx.getStorageSync('token');
        var positionImg = that.data.positionImg;
        wx.chooseImage({
          count: 1,
          sizeType: ['original', 'compressed'],
          sourceType: ['album', 'camera'],
          success: function(res) {
            var filePath = res.tempFilePaths[0];
            var imgName = filePath.substr(30, 50);
            var index = e.currentTarget.dataset.index;
            var imgs = that.data.imgs;
            qiniuUploader.upload(filePath, (res) => {
              if (index == 0) {
                positionImg.top = res.imageURL
              } else if (index == 1) {
                positionImg.left = res.imageURL
              } else if (index == 2) {
                positionImg.right = res.imageURL
              } else if (index == 3) {
                positionImg.back = res.imageURL
              } else if (index == 4) {
                positionImg.bottom = res.imageURL
              } else if (index == 5) {
                positionImg.closeup = res.imageURL
              }
              for (var i in imgs) {
                if (i == index) {
                  imgs[i].pic = res.imageURL
                }
              }
              that.setData({
                imgs: imgs,
                positionImg: positionImg
              })
            }, (error) => {
              console.log(error)
            }, {
              region: 'NCN',
              uploadURL: 'https://upload-z1.qiniup.com',
              //正式环境
              // domain: 'https://static.tosneaker.com',
              // stg环境
              domain: app.globalData.qiniuImgUrl,
              key: 'uploads/_tmp/' + imgName,
              uptoken: that.data.qiniuToken
            })
          }
        })
      }
    );
  },
  // 选择标签
  choose: function(e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var choose = that.data.choose;
    for (var i in choose) {
      if (i == index) {
        choose[i].checked = !choose[i].checked
      }
    }
    that.setData({
      choose: choose
    })
    var service = [];
    for (var i in that.data.choose) {
      if (that.data.choose[i].checked == true) {
        service += '/' + that.data.choose[i].text
      }
    }
    that.setData({
      service: service
    })
  },
  // 输入框
  input: function(e) {
    var that = this;
    var value = e.detail.value;
    var len = parseInt(value.length);
    if (len < that.data.max) {
      that.setData({
        currentWordNumber: len,
        textarea: value
      })
    } else {
      wx.showToast({
        title: '最多输入500字',
        duration: 1000,
        icon: 'none',
        mask: true
      })
    }
  },
  // 开始录音语音
  startVoice: function() {
    var that = this;
    let isRecording = that.data.isRecording;
    let voiceItem = that.data.voiceItem;
    var len = voiceItem.length;
    if (isRecording) {
      // 录音开始
      if (len == 0) {
        wx.authorize({ // 向用户拉取授权
          scope: 'scope.record',
          success() {
            that.setData({
              isRecording: false
            })
            recorderManager.start({
              duration: 10000, //指定录音的时长，单位 ms
              sampleRate: 16000, //采样率
              numberOfChannels: 1, //录音通道数
              encodeBitRate: 96000, //编码码率
              format: 'mp3', //音频格式，有效值 aac/mp3
              frameSize: 50, //指定帧大小，单位 KB
            }); // 开始录音
            recorderManager.onStart(() => {
              that.setData({
                yuyinTrue: true,
              })
            });
            recorderManager.onError((res) => {
              console.log(res)
            })
          },
          fail() {
            console.log('录音授权失败')
          }
        })
      } else {
        wx.showToast({
          title: '只能提交一条语音消息',
          duration: 1000,
          icon: 'none',
          mask: true
        })
      }
    } else {
      // 结束录音
      recorderManager.stop();
      recorderManager.onStop((res) => {
        that.setData({
          yuyinTrue: false,
          isRecording: true
        })
        var tempFilePaths = res.tempFilePath;
        voiceItem.push(tempFilePaths);
        that.setData({
          voiceItem,
          zanting: 1
        })
      })
    }
  },
  // 音频上传七牛
  voiceUploadQiniu: function(voiceItem) {
    var that = this;
    return new Promise((resolve, reject) => {
      if (voiceItem.length == 0) {
        resolve("音频为空")
      }
      let help_audio = that.data.help_audio;
      var yinpinName = voiceItem[0].substr(30, 50);
      qiniuUploader.upload(voiceItem[0], (res) => {
        help_audio.push(res.imageURL)
        this.setData({
          help_audio: help_audio
        })
        resolve("音频上传成功")
      }, (error) => {
        reject("音频上传失败")
      }, {
        region: 'NCN',
        uploadURL: 'https://upload-z1.qiniup.com',
        domain: app.globalData.qiniuImgUrl,
        key: 'uploads/_tmp/' + yinpinName,
        uptoken: that.data.qiniuToken
      })
    })
  },
  // 播放语音
  bofang: function() {
    var that = this;
    this.innerAudioContext = wx.createInnerAudioContext();
    var voiceItem = that.data.voiceItem;
    var src;
    for (var i in voiceItem) {
      src = voiceItem[i]
    }
    this.innerAudioContext.autoplay = true;
    this.innerAudioContext.src = src;
    this.innerAudioContext.onPlay(() => {
      that.setData({
        zanting: 2
      })
    })
    this.innerAudioContext.onEnded(() => {
      that.setData({
        zanting: 1
      })
    })
    this.innerAudioContext.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
    })
  },
  // 暂停语音
  zanting: function() {
    var that = this;
    var voiceItem = that.data.voiceItem;
    var src;
    for (var i in voiceItem) {
      src = voiceItem[i]
    }
    this.innerAudioContext.src = src;
    this.innerAudioContext.stop();
    this.innerAudioContext.onStop(() => {
      that.setData({
        zanting: 1
      })
    })
  },
  // 删除语音
  deleVoice: function(e) {
    var that = this;
    var voiceItem = that.data.voiceItem;
    var src;
    for (var i in voiceItem) {
      src = voiceItem[i]
    }
    var index = e.currentTarget.dataset.index;
    var voiceItem = that.data.voiceItem;
    voiceItem.splice(index, 1)
    that.setData({
      voiceItem: voiceItem
    });
    this.innerAudioContext.src = src;
    this.innerAudioContext.stop();
    this.innerAudioContext.onStop(() => {
      that.setData({
        zanting: 1
      })
    })
  },


  // 上传备注图片
  addPic: function() {
    var that = this;
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        var tempFilePaths = res.tempFilePaths;
        that.setData({
          picItem: tempFilePaths
        })
      }
    })
  },
  // 得到图片路径数组后，准备上传七牛
  pcUploadQiniu: function(imageArray) {
    var that = this;
    return new Promise((resolve, reject) => {
      if (imageArray.length == 0) {
        resolve("备注图片为空")
      }
      var help_image = that.data.help_image;
      for (var i = 0; i < imageArray.length; i++) {
        var filePath = imageArray[i];
        var imgName = filePath.substr(30, 50);
        qiniuUploader.upload(filePath, (res) => {
          help_image.push(res.imageURL)
          that.setData({
            help_image
          })
          if (imageArray.length == help_image.length) {
            resolve("图片上传完成")
          }
        }, (error) => {
          reject("图片上传失败")
        }, {
          region: 'NCN',
          uploadURL: 'https://upload-z1.qiniup.com',
          domain: app.globalData.qiniuImgUrl,
          key: 'uploads/_tmp/' + imgName,
          uptoken: that.data.qiniuToken
        })
      }
    })
  },
  // 点击看大图
  bigPic: function(e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var picItem = that.data.picItem;
    wx.previewImage({
      current: picItem[index],
      urls: picItem
    })
  },
  // 删除图片
  delePic: function(e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var picItem = that.data.picItem;
    picItem.splice(index, 1);
    that.setData({
      picItem,
    })
  },
  // 上传备注视频
  addVideo: function() {
    var that = this;
    let videoItem = that.data.videoItem;
    if (that.data.videoItem.length == 0) {
      wx.chooseVideo({
        sourceType: ['album', 'camera'],
        maxDuration: 60,
        camera: ['front', 'back'],
        success: function(res) {
          var tempFilePath = res.tempFilePath;
          videoItem.push(tempFilePath)
          that.setData({
            videoItem
          })
        }
      })
    } else {
      wx.showToast({
        title: '最多只能上传一个视频',
        duration: 1000,
        icon: 'none',
        mask: true
      })
    }
  },
  // 视频上传七牛
  videoUploadQiniu: function(videoItem) {
    var that = this;
    return new Promise((resolve, reject) => {
      if (videoItem.length == 0) {
        resolve('备注视频为空')
      }
      var help_video = that.data.help_video;
      var shipinName = videoItem[0].substr(30, 50);
      qiniuUploader.upload(videoItem[0], (res) => {
        help_video.push(res.imageURL);
        that.setData({
          help_video
        })
        resolve("视频上传成功")
      }, (error) => {
        reject("视频上传失败")
      }, {
        region: 'NCN',
        uploadURL: 'https://upload-z1.qiniup.com',
        domain: app.globalData.qiniuImgUrl,
        key: 'uploads/_tmp/' + shipinName,
        uptoken: that.data.qiniuToken
      })
    })
  },
  // 播放
  play: function(e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    this.videoContext.requestFullScreen({});
  },
  // 切换视频是否全屏播放
  startScreenChange: function(e) {
    var that = this;
    if (e.detail.fullScreen == true) {
      that.setData({
        videois1: true
      })
    } else {
      that.setData({
        videois1: false
      })
    }
  },
  // 删除视频
  deleVideo: function(e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var videoItem = that.data.videoItem;
    videoItem.splice(index, 1);
    that.setData({
      videoItem: videoItem
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.qiniuToken();
    this.getPrice();
    this.shopPriceMuch();
  },
  // 获取上传七牛需要的token
  qiniuToken: function() {
    var that = this;
    app.isToken(
      function goNext() {
        var token = wx.getStorageSync('token');
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