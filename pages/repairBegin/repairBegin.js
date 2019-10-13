// page/repairBegin/repairBegin.js
var app = getApp();
const recorderManager = wx.getRecorderManager()
const qiniuUploader = require("../../utils/qiniuUploader"); //七牛sdk
var mta = require('../../utils/mta_analysis.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        static: app.globalData.statics,
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
            },
        ],
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
        max: 500,
        currentWordNumber: 0,
        status: '',
        voiceItem: [],
        zanting: 1,
        picItem: [

        ],
        videoItem: [],
        service: [],
        textarea: '',

        // 上传七牛token
        qiniuToken: '',
        // 六张介绍图
        positionImg: {},
        videois1: true,
        yuyinTrue: false,
        isRecording: true,
        addPicArr: []
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
    // 上传图片
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
  startVoice: function () {
    var that = this;
    let isRecording = that.data.isRecording;
    const options = {
      duration: 10000, //指定录音的时长，单位 ms
      sampleRate: 16000, //采样率
      numberOfChannels: 1, //录音通道数
      encodeBitRate: 96000, //编码码率
      format: 'mp3', //音频格式，有效值 aac/mp3
      frameSize: 50, //指定帧大小，单位 KB
    }
    var len = that.data.voiceItem.length;
    if (isRecording) {
      // 录音开始
      if (len == 0) {
        wx.authorize({
          scope: 'scope.record',
          success() {
            that.setData({
              isRecording: false
            })
            recorderManager.start(options);
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
        that.voiceUploadQiniu(tempFilePaths);
        const {
          tempFilePath
        } = res
      })
    }
  },
  // 音频上传七牛
  voiceUploadQiniu: function(yinpinFile) {
      var that = this;
      var voiceItem = that.data.voiceItem;
      var yinpinName = yinpinFile.substr(30, 50);
      qiniuUploader.upload(yinpinFile, (res) => {
          voiceItem.push(res.imageURL)
          this.setData({
              voiceItem: voiceItem
          })
      }, (error) => {
          console.log(error)
      }, {
          region: 'NCN',
          uploadURL: 'https://upload-z1.qiniup.com',
          // domain: 'https://static.tosneaker.com',
          domain: app.globalData.qiniuImgUrl,
          key: 'uploads/_tmp/' + yinpinName,
          uptoken: that.data.qiniuToken
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
  addPic: function () {
    var that = this;
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        var tempFilePaths = res.tempFilePaths;
        that.setData({
          addPicArr: tempFilePaths
        })
        that.pcUploadQiniu(tempFilePaths)
      }
    })
  },
  // 得到图片路径数组后，准备上传七牛
  pcUploadQiniu: function (imageArray) {
    var that = this;
    var picItem = that.data.picItem;
    for (var i = 0; i < imageArray.length; i++) {
      var filePath = imageArray[i];
      var imgName = filePath.substr(30, 50);
      qiniuUploader.upload(filePath, (res) => {
        console.log(res.imageURL)
        picItem.push(res.imageURL)
        if (picItem.length >= 9) {
          let picItem_ = picItem.slice(0, 9)
          that.setData({
            picItem: picItem_
          })
        } else {
          that.setData({
            picItem: picItem
          })
        }
      }, (error) => {
        console.log(error)
      }, {
          region: 'NCN',
          uploadURL: 'https://upload-z1.qiniup.com',
          // domain: 'https://static.tosneaker.com',
          domain: app.globalData.qiniuImgUrl,
          key: 'uploads/_tmp/' + imgName,
          uptoken: that.data.qiniuToken
        })
    }
  },
  // 点击看大图
  bigPic: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var picItem = that.data.picItem;
    wx.previewImage({
      current: picItem[index],
      urls: picItem
    })
  },
  // 删除图片
  delePic: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var picItem = that.data.picItem;
    let addPicArr = that.data.addPicArr;
    picItem.splice(index, 1);
    addPicArr.splice(index, 1);
    that.setData({
      picItem,
      addPicArr
    })
  },
  // 上传备注视频
  addVideo: function() {
    var that = this;
    if (that.data.videoItem == '') {
        wx.chooseVideo({
            sourceType: ['album', 'camera'],
            maxDuration: 60,
            camera: ['front', 'back'],
            success: function(res) {
                var tempFilePath = res.tempFilePath;
                that.videoUploadQiniu(tempFilePath);
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
  videoUploadQiniu: function(shipinFile) {
      var that = this;
      var videoItem = that.data.videoItem;
      var shipinName = shipinFile.substr(30, 50);
      qiniuUploader.upload(shipinFile, (res) => {
          videoItem.push(res.imageURL);
          that.setData({
              videoItem: videoItem
          })
      }, (error) => {
          console.log('上传失败' + error)
      }, {
          region: 'NCN',
          uploadURL: 'https://upload-z1.qiniup.com',
          // domain: 'https://static.tosneaker.com',
          domain: app.globalData.qiniuImgUrl,
          key: 'uploads/_tmp/' + shipinName,
          uptoken: that.data.qiniuToken
      })
  },
  // 播放
  play: function(e) {
      var that = this;
      var index = e.currentTarget.dataset.index;
      this.videoContext.requestFullScreen({});
  },
  // 切换是否全屏播放
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
  // 提示框
  toast: function(title) {
      wx.showToast({
          title: title,
          duration: 1000,
          icon: 'none',
          mask: true
      })
  },
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
        var content = that.data.service + '#' + that.data.textarea;
        // 备注视频
        var help_video = that.data.videoItem;
        // 备注图片组
        var help_image = that.data.picItem
        // 备注音频
        var help_audio = that.data.voiceItem
        // 球鞋角度介绍图个数
        var six_image = that.data.positionImg;
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
                                help_image: help_image,
                                help_audio: help_audio,
                                help_video: help_video
                            },
                            success: function(res) {
                                if (res.data.status == 200) {
                                    wx.redirectTo({
                                        url: '/pages/repairSubmit/repairSubmit'
                                    })
                                    wx.hideToast();
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
                    }
                } else {
                    that.toast('请上传6张对应介绍图')
                }
            }
        )
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        // mta
        mta.Page.init()
        var that = this;
        that.qiniuToken()
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {
        this.videoContext = wx.createVideoContext('myVideo')
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        var that = this;
        console.log(app.globalData.qiniuImgUrl)

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