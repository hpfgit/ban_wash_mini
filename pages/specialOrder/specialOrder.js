// page/specialOrder/specialOrder.js
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
        img: '',
        data: [{
                service_id: 1,
                service_name: '清洗',
                text: '清洗',
                checked: false
            },
            {
                service_id: 3,
                service_name: '鞋面修复',
                text: '鞋面修复',
                checked: false
            },
            {
                service_id: 5,
                service_name: '中底修复',
                text: '中底修复',
                checked: false
            },
            {
                service_id: 2,
                service_name: '黏胶',
                text: '黏胶',
                checked: false
            },
            {
                service_id: 9,
                service_name: '去油',
                text: '去油处理',
                checked: false
            },
            {
                service_id: 15,
                service_name: '串色处理',
                text: '串色处理',
                checked: false
            },
            {
                service_id: 12,
                service_name: '破洞织补',
                text: '破洞织补',
                checked: false
            },
            {
                service_id: 13,
                service_name: '内衬变换',
                text: '内村更换',
                checked: false
            },
            {
                service_id: 10,
                service_name: '发黄去氧化',
                text: '发黄去氧化',
                checked: false
            },
            {
                service_id: 14,
                service_name: '专业贴底',
                text: '贴底保护',
                checked: false
            },
            {
                service_id: 7,
                service_name: '防水',
                text: '防水处理',
                checked: false
            },
            {
                service_id: 6,
                service_name: '护理',
                text: '上油护理',
                checked: false
            },
            {
                service_id: 16,
                service_name: '翻面/绒皮修复',
                text: '翻毛皮/绒皮补色',
                checked: false
            },
        ],
        num: 0,
        qiniuToken: '', //七牛token
        max: 500,
        currentWordNumber: 0,
        status: '',
        voiceItem: [],
        zanting: 1,
        picItem: [],
        videoItem: [],
        service: [],
        textarea: '',
        videois1: true,
        yuyinTrue: false,
        isRecording: true,
        addPicArr: []
    },
    // 获取七牛token
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
    uploadLeft: function() {
        var that = this;
        wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success: function(res) {
                var tempFilePath = res.tempFilePaths[0];
                var imgName = tempFilePath.substr(30, 50);
                qiniuUploader.upload(tempFilePath, (res) => {
                    that.setData({
                        img: res.imageURL
                    })
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
        })
    },
    //选择服务项目
    change: function(e) {
        var that = this;
        var index = e.currentTarget.dataset.index;
        var data = that.data.data;
        for (var i in data) {
            if (index == i) {
                data[i].checked = !data[i].checked
            }
        };
        var num = 0;
        for (var j in data) {
            if (data[j].checked) {
                num++
            }
        }
        that.setData({
            data: data,
            num: num
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
        }else {
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
    // // 结束录音
    // sedVoice: function() {
    //     var that = this;
    //     recorderManager.stop();
    //     recorderManager.onStop((res) => {
    //         that.setData({
    //             yuyinTrue: false
    //         })
    //         var tempFilePaths = res.tempFilePath;
    //         that.voiceUploadQiniu(tempFilePaths);
    //         const {
    //             tempFilePath
    //         } = res
    //     })
    // },
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
    addPic: function() {
        var that = this;
        wx.chooseImage({
            count: 9,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success: function(res) {
                var tempFilePaths = res.tempFilePaths;
                that.setData({
                  addPicArr: tempFilePaths
                })
              that.pcUploadQiniu(tempFilePaths)
            }
        })
    },
    // 得到图片路径数组后，准备上传七牛
    pcUploadQiniu: function(imageArray) {
        var that = this;
        var picItem = that.data.picItem;
        for (var i = 0; i < imageArray.length; i++) {
            var filePath = imageArray[i];
            var imgName = filePath.substr(30, 50);
            qiniuUploader.upload(filePath, (res) => {
              console.log(res.imageURL)
                picItem.push(res.imageURL)
                if (picItem.length >= 9) {
                  let picItem_ =  picItem.slice(0, 9)
                  that.setData({
                    picItem: picItem_
                  })
                }else {
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
    // 提交订单
    submit: function() {
        var that = this;
        wx.showToast({
            title: '',
            duration: 1000000,
            icon: 'loading',
            mask: true
        })
        // 备注信息
        var content = that.data.textarea;
        // 备注视频
        var help_video = that.data.videoItem;
        // 备注音频
        var help_audio = that.data.voiceItem;
        // 备注图片组
        var help_image = that.data.picItem;
        app.isToken(
            function goNext() {
                var token = wx.getStorageSync('token');
                var data = that.data.data;
                var require_item = [];
                for (var i in data) {
                    if (data[i].checked == true) {
                        var item = {
                            service_id: data[i].service_id,
                            service_name: data[i].service_name
                        };
                        require_item.push(item);
                    }
                }
                if (require_item != '') {
                    if (that.data.img != '') {
                        if (content.length >= 10) {
                            wx.request({
                                url: app.globalData.url + '/api/ext/care/spservice/bespservice',
                                method: 'POST',
                                data: {
                                    token: token,
                                    order_type: 5,
                                    left_image: that.data.img,
                                    require_item: require_item,
                                    content: content,
                                    help_video: help_video,
                                    help_image: help_image,
                                    help_audio: help_audio
                                },
                                success: function(res) {
                                    if (res.data.status == 200) {
                                        wx.redirectTo({
                                            url: '/pages/specialSubmit/specialSubmit?log_id=' + res.data.data.id,
                                        })
                                        wx.hideToast();
                                    }
                                },
                                fail: function(e) {
                                    console.log(e)
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
                        wx.showToast({
                            title: '请先上传左侧45°照片',
                            duration: 1500,
                            icon: 'none',
                            mask: true
                        })
                    }
                } else {
                    wx.showToast({
                        title: '最少选择一项服务',
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