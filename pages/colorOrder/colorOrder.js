// page/colorOrder/colorOrder.js
var app = getApp();
const recorderManager = wx.getRecorderManager()
// var tempFilePath;
const qiniuUploader = require("../../utils/qiniuUploader"); //七牛sdk
var mta = require('../../utils/mta_analysis.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        static: app.globalData.statics,
        url: app.globalData.url,
        qiniuToken: '',
        img: '',
        datas: [],
        items1: {},
        items2: {},
        check1: [],
        check2: [],
        content1: '',
        content2: '',
        max: 500,
        currentWordNumber1: 0,
        currentWordNumber2: 0,
        status: '',
        voiceItem1: [],
        voiceItem2: [],
        zantingOne: 1,
        zantingTwo: 1,
        picItem1: [],
        picItem2: [],
        videoItem1: [],
        videoItem2: [],
        videois1: true,
        videois2: true,
        instep: 0,
        yuyinTrue: false
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
    // 获取上传七牛需要token
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
    // 获取数据
    getData: function() {
        var that = this;
        wx.request({
            url: app.globalData.url + '/api/ext/care/pricetable',
            method: 'GET',
            data: {},
            success: function(res) {
                var data = res.data.data;
                var datas = that.data.datas;
                for (var i in data) {
                    if (data[i].id == 17) {
                        datas.push(data[i])
                    }
                    if (data[i].id == 11) {
                        datas.push(data[i])
                    }
                }
                that.setData({
                    datas: datas
                })
            },
            fail: function(e) {
                console.log(e)
            }
        })
    },
    // 上传图片
    upload: function() {
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
    // 选择服务项目
    choose: function(e) {
        var that = this;
        var index = e.currentTarget.dataset.index;
        var inx = e.currentTarget.dataset.inx;
        var data = that.data.datas;
        var items1 = that.data.items1;
        var items2 = that.data.items2;
        var content1 = that.data.check1;
        var content2 = that.data.check2;
        for (var i in data) {
            if (i == index) {
                for (var j in data[i].item) {
                    if (j == inx) {
                        data[i].item[j].checked = !data[i].item[j].checked;
                    } else {
                        data[i].item[j].checked = false
                    }
                }
            }
        };
        if (index == 0) {
            var server_service_id = e.currentTarget.dataset.server_service_id;
            var service_id = e.currentTarget.dataset.service_id;
            var service_name = e.currentTarget.dataset.service_name;
            var items_id = e.currentTarget.dataset.items_id;
            var item_name = e.currentTarget.dataset.item_name;
            content1 = []
            for (var j in data[0].item) {
                if (data[0].item[j].checked == true) {
                    var nnn = data[0].name + '-' + data[0].item[j].item_name;
                    content1.push(nnn)
                    items1 = {
                        server_service_id: server_service_id,
                        service_id: service_id,
                        service_name: service_name,
                        item_id: items_id,
                        item_name: item_name
                    }
                }
            }
        }
        if (index == 1) {
            var server_service_id = e.currentTarget.dataset.server_service_id;
            var service_id = e.currentTarget.dataset.service_id;
            var service_name = e.currentTarget.dataset.service_name;
            var items_id = e.currentTarget.dataset.items_id;
            var item_name = e.currentTarget.dataset.item_name;

            content2 = []
            for (var j in data[1].item) {
                if (data[1].item[j].checked == true) {
                    var nnn = data[1].name + '-' + data[1].item[j].item_name;
                    content2.push(nnn)
                    items2 = {
                        server_service_id: server_service_id,
                        service_id: service_id,
                        service_name: service_name,
                        item_id: items_id,
                        item_name: item_name
                    }
                }
            }
        }
        // 显示鞋面改色描述
        for (var i in data) {
            for (var j in data[1].item) {
                if (data[1].item[0].checked == true || data[1].item[1].checked == true || data[1].item[2].checked == true) {
                    that.setData({
                        instep: 1
                    })
                } else {
                    that.setData({
                        instep: 0
                    })
                }
            }
        }
        that.setData({
            datas: data,
            check1: content1,
            check2: content2,
            items1: items1,
            items2: items2
        })
    },
    // 输入框
    input: function(e) {
        var that = this;
        var instep = e.currentTarget.dataset.instep;
        if (instep == 0) {
            var value = e.detail.value;
            var len = parseInt(value.length);
            if (len < that.data.max) {
                that.setData({
                    currentWordNumber1: len,
                    content1: value
                })
            } else {
                wx.showToast({
                    title: '最多输入500字',
                    duration: 1000,
                    icon: 'none',
                    mask: true
                })
            }
        } else if (instep == 1) {
            var value = e.detail.value;
            var len = parseInt(value.length);
            if (len < that.data.max) {
                that.setData({
                    currentWordNumber2: len,
                    content2: value
                })
            } else {
                wx.showToast({
                    title: '最多输入500字',
                    duration: 1000,
                    icon: 'none',
                    mask: true
                })
            }
        }
    },
    // 开始录音语音
    startVoice: function(e) {
        var that = this;
        var instep = e.currentTarget.dataset.instep;
        const options = {
            duration: 10000, //指定录音的时长，单位 ms
            sampleRate: 16000, //采样率
            numberOfChannels: 1, //录音通道数
            encodeBitRate: 96000, //编码码率
            format: 'mp3', //音频格式，有效值 aac/mp3
            frameSize: 50, //指定帧大小，单位 KB
        }
        // 开始录音
        if (instep == 0) {
            var len = that.data.voiceItem1.length;
        } else if (instep == 1) {
            var len = that.data.voiceItem2.length;
        }

        if (len == 0) {
            wx.authorize({
                scope: 'scope.record',
                success() {
                    recorderManager.start(options);
                    recorderManager.onStart(() => {
                        that.setData({
                            yuyinTrue: true
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

    },
    // 结束录音
    sedVoice: function(e) {
        var that = this;
        var instep = e.currentTarget.dataset.instep;
        recorderManager.stop();
        recorderManager.onStop((res) => {
            that.setData({
                yuyinTrue: false
            })
            var tempFilePaths = res.tempFilePath;
            that.voiceUploadQiniu(tempFilePaths, instep);
            const {
                tempFilePath
            } = res
        })
    },
    // 音频上传七牛
    voiceUploadQiniu: function(yinpinFile, instep) {
        var that = this;
        var voiceItem1 = that.data.voiceItem1;
        var voiceItem2 = that.data.voiceItem2;
        var yinpinName = yinpinFile.substr(30, 50);
        qiniuUploader.upload(yinpinFile, (res) => {
            if (instep == 0) {
                voiceItem1.push(res.imageURL)
                this.setData({
                    voiceItem1: voiceItem1
                })
            } else if (instep == 1) {
                voiceItem2.push(res.imageURL)
                this.setData({
                    voiceItem2: voiceItem2
                })
            }
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
    bofang: function(e) {
        var that = this;
        this.innerAudioContext = wx.createInnerAudioContext();
        var instep = e.currentTarget.dataset.instep;
        if (instep == 0) {
            var voiceItem = that.data.voiceItem1;
            var src;
            for (var i in voiceItem) {
                src = voiceItem[i]
            }
            this.innerAudioContext.autoplay = true;
            this.innerAudioContext.src = src;
            this.innerAudioContext.onPlay(() => {
                that.setData({
                    zantingOne: 2
                })
            })
            this.innerAudioContext.onEnded(() => {
                that.setData({
                    zantingOne: 1
                })
            })
            this.innerAudioContext.onError((res) => {
                console.log(res.errMsg)
                console.log(res.errCode)
            })
        } else if (instep == 1) {
            var voiceItem = that.data.voiceItem2;
            var src;
            for (var i in voiceItem) {
                src = voiceItem[i]
            }
            this.innerAudioContext.autoplay = true;
            this.innerAudioContext.src = src;
            this.innerAudioContext.onPlay(() => {
                that.setData({
                    zantingTwo: 2
                })
            })
            this.innerAudioContext.onEnded(() => {
                that.setData({
                    zantingTwo: 1
                })
            })
            this.innerAudioContext.onError((res) => {
                console.log(res.errMsg)
                console.log(res.errCode)
            })
        }

    },
    // 暂停语音
    zanting: function(e) {
        var that = this;
        var instep = e.currentTarget.dataset.instep;
        if (instep == 0) {
            var voiceItem = that.data.voiceItem1;
            var src;
            for (var i in voiceItem) {
                src = voiceItem[i]
            }
            this.innerAudioContext.src = src;
            this.innerAudioContext.stop();
            this.innerAudioContext.onStop((res) => {
                console.log(res)
                that.setData({
                    zantingOne: 1
                })
            })
        } else if (instep == 1) {
            var voiceItem = that.data.voiceItem2;
            var src;
            for (var i in voiceItem) {
                src = voiceItem[i]
            }
            this.innerAudioContext.src = src;
            this.innerAudioContext.stop();
            this.innerAudioContext.onStop(() => {
                that.setData({
                    zantingTwo: 1
                })
            })
        }

    },
    // 删除语音
    deleVoice: function(e) {
        var that = this;
        var instep = e.currentTarget.dataset.instep;
        var index = e.currentTarget.dataset.index;
        if (instep == 0) {
            var voiceItem = that.data.voiceItem1;
            var src;
            for (var i in voiceItem) {
                src = voiceItem[i]
            }
            voiceItem.splice(index, 1)
            that.setData({
                voiceItem1: voiceItem
            });
            this.innerAudioContext.src = src;
            this.innerAudioContext.stop();
            this.innerAudioContext.onStop(() => {
                that.setData({
                    zantingOne: 1
                })
            })
        } else if (instep == 1) {
            var voiceItem = that.data.voiceItem2;
            var src;
            for (var i in voiceItem) {
                src = voiceItem[i]
            }
            voiceItem.splice(index, 1)
            that.setData({
                voiceItem2: voiceItem
            });
            this.innerAudioContext.src = src;
            this.innerAudioContext.stop();
            this.innerAudioContext.onStop(() => {
                that.setData({
                    zantingTwo: 1
                })
            })
        }
    },
    // 上传备注图片
    addPic: function(e) {
        var that = this;
        var instep = e.currentTarget.dataset.instep;
        wx.chooseImage({
            count: 9,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success: function(res) {
                var tempFilePaths = res.tempFilePaths;
                that.pcUploadQiniu(tempFilePaths, instep)
            }
        })
    },
    // 得到图片路径数组后，准备上传七牛
    pcUploadQiniu: function(imageArray, instep) {
        var that = this;
        var picItem1 = that.data.picItem1;
        var picItem2 = that.data.picItem2;
        for (var i = 0; i < imageArray.length; i++) {
            var filePath = imageArray[i];
            var imgName = filePath.substr(30, 50);
            qiniuUploader.upload(filePath, (res) => {
                if (instep == 0) {
                    picItem1.push(res.imageURL);
                    that.setData({
                        picItem1: picItem1
                    })
                } else if (instep == 1) {
                    picItem2.push(res.imageURL);
                    that.setData({
                        picItem2: picItem2
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
        var instep = e.currentTarget.dataset.instep;
        var index = e.currentTarget.dataset.index;
        if (instep == 0) {
            var picItem1 = that.data.picItem1;
            wx.previewImage({
                current: picItem1[index],
                urls: picItem1
            })
        } else if (instep == 1) {
            var picItem2 = that.data.picItem2;
            wx.previewImage({
                current: picItem2[index],
                urls: picItem2
            })
        }

    },
    // 删除图片
    delePic: function(e) {
        var that = this;
        var instep = e.currentTarget.dataset.instep;
        var index = e.currentTarget.dataset.index;
        if (instep == 0) {
            var picItem1 = that.data.picItem1;
            picItem1.splice(index, 1);
            that.setData({
                picItem1: picItem1
            })
        } else if (instep == 1) {
            var picItem2 = that.data.picItem2;
            picItem2.splice(index, 1);
            that.setData({
                picItem2: picItem2
            })
        }
    },
    // 上传备注视频
    addVideo: function(e) {
        var that = this;
        var instep = e.currentTarget.dataset.instep;
        if (instep == 0) {
            if (that.data.videoItem1 == '') {
                wx.chooseVideo({
                    sourceType: ['album', 'camera'],
                    maxDuration: 60,
                    camera: ['front', 'back'],
                    success: function(res) {
                        var tempFilePath = res.tempFilePath;
                        that.videoUploadQiniu(tempFilePath, instep)
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
        } else if (instep == 1) {
            if (that.data.videoItem2 == '') {
                wx.chooseVideo({
                    sourceType: ['album', 'camera'],
                    maxDuration: 60,
                    camera: ['front', 'back'],
                    success: function(res) {
                        var tempFilePath = res.tempFilePath;
                        that.videoUploadQiniu(tempFilePath, instep)
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
        }
    },
    // 视频上传七牛
    videoUploadQiniu: function(shipinFile, instep) {
        var that = this;
        var videoItem1 = that.data.videoItem1;
        var videoItem2 = that.data.videoItem2;
        var shipinName = shipinFile.substr(30, 50);
        qiniuUploader.upload(shipinFile, (res) => {
            if (instep == 0) {
                videoItem1.push(res.imageURL)
                that.setData({
                    videoItem1: videoItem1
                })
            } else if (instep == 1) {
                videoItem2.push(res.imageURL)
                that.setData({
                    videoItem2: videoItem2
                })
            }
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
        var instep = e.currentTarget.dataset.instep;
        if (instep == 0) {
            this.videoContext1.requestFullScreen({});
        } else if (instep == 1) {
            this.videoContext2.requestFullScreen({});
        }
    },
    // 进入和退出全屏
    startScreenChange: function(e) {
        var that = this;
        var instep = e.currentTarget.dataset.instep;
        if (instep == 0) {
            if (e.detail.fullScreen == true) {
                that.setData({
                    videois1: true
                })
            } else {
                that.setData({
                    videois1: false
                })
            }
        } else if (instep == 1) {
            if (e.detail.fullScreen == true) {
                that.setData({
                    videois1: true
                })
            } else {
                that.setData({
                    videois1: false
                })
            }
        }
    },
    // 删除视频
    deleVideo: function(e) {
        var that = this;
        var instep = e.currentTarget.dataset.instep;
        var index = e.currentTarget.dataset.index;
        if (instep == 0) {
            var videoItem1 = that.data.videoItem1;
            videoItem1.splice(index, 1);
            that.setData({
                videoItem1: videoItem1
            })
        } else if (instep == 1) {
            var videoItem2 = that.data.videoItem2;
            videoItem2.splice(index, 1);
            that.setData({
                videoItem2: videoItem2
            })
        }
    },
    // 提交
    submit: function() {
        var that = this;
        wx.showToast({
            title: '订单生成中...',
            duration: 10000,
            icon: 'loading',
            mask: true
        })
        app.isToken(
            function goNext() {
                var map = {};
                map['token'] = wx.getStorageSync('token'); // token
                map['order_type'] = 4; //订单类型
                var content = {};
                var items = [];
                var help_image = {};
                var help_audio = {};
                var help_video = {};
                if (that.data.check1 != '' && that.data.check2 != '') {
                    if (that.data.content1.length < 10) {
                        wx.showToast({
                            title: '大底改色请至少输入10字备注信息',
                            duration: 1500,
                            icon: 'none',
                            mask: true
                        })
                    } else if (that.data.content2.length < 10) {
                        wx.showToast({
                            title: '鞋面改色请至少输入10字备注信息',
                            duration: 1500,
                            icon: 'none',
                            mask: true
                        })
                    } else {
                        if (that.data.img != '') {
                            map['left_image'] = that.data.img; //左侧45度图片
                            if (JSON.stringify(that.data.items1) != '{}') {
                                items.push(that.data.items1)
                            };
                            if (JSON.stringify(that.data.items2) != '{}') {
                                items.push(that.data.items2)
                            };
                            map['items'] = items; //要购买的服务
                            if (that.data.content1 != '') {
                                content['sole'] = that.data.content1;
                            };
                            if (that.data.content2 != '') {
                                content['instep'] = that.data.content2;
                            };
                            if (JSON.stringify(content) != '{}') {
                                map['content'] = content; //备注信息
                            }
                            if (that.data.picItem1 != '') {
                                help_image['sole'] = that.data.picItem1;
                            };
                            if (that.data.picItem2 != '') {
                                help_image['instep'] = that.data.picItem2;
                            };
                            if (JSON.stringify(help_image) != '{}') {
                                map['help_image'] = help_image; //辅助图片
                            };
                            if (that.data.voiceItem1 != '') {
                                help_audio['sole'] = that.data.voiceItem1;
                            };
                            if (that.data.voiceItem2 != '') {
                                help_audio['instep'] = that.data.voiceItem2;
                            };
                            if (JSON.stringify(help_audio) != '{}') {
                                map['help_audio'] = help_audio; //辅助录音
                            };
                            if (that.data.videoItem1 != '') {
                                help_video['sole'] = that.data.videoItem1;
                            };
                            if (that.data.videoItem2 != '') {
                                help_video['instep'] = that.data.videoItem2;
                            };
                            if (JSON.stringify(help_video) != '{}') {
                                map['help_video'] = help_video; //辅助视频
                            };
                            that.go(map);
                        } else {
                            wx.showToast({
                                title: '请上传鞋子45°照片',
                                duration: 1500,
                                icon: 'none',
                                mask: true
                            })
                        }
                    }
                } else if (that.data.check1 != '') { //大底改色
                    if (that.data.content1.length >= 10) {
                        content['sole'] = that.data.content1;
                        map['content'] = content; //备注信息
                        if (that.data.img != '') {
                            map['left_image'] = that.data.img; //左侧45度图片
                            if (JSON.stringify(that.data.items1) != '{}') {
                                items.push(that.data.items1)
                            };
                            map['items'] = items; //要购买的服务
                            if (that.data.picItem1 != '') {
                                help_image['sole'] = that.data.picItem1;
                            };
                            if (JSON.stringify(help_image) != '{}') {
                                map['help_image'] = help_image; //辅助图片
                            };
                            if (that.data.voiceItem1 != '') {
                                help_audio['sole'] = that.data.voiceItem1;
                            };
                            if (JSON.stringify(help_audio) != '{}') {
                                map['help_audio'] = help_audio; //辅助录音
                            };

                            if (that.data.videoItem1 != '') {
                                help_video['sole'] = that.data.videoItem1;
                            };
                            if (JSON.stringify(help_video) != '{}') {
                                map['help_video'] = help_video; //辅助视频
                            };
                            that.go(map);
                        } else {
                            wx.showToast({
                                title: '请上传鞋子45°照片',
                                duration: 1500,
                                icon: 'none',
                                mask: true
                            })
                        }
                    } else {
                        wx.showToast({
                            title: '大底改色请至少输入10字备注信息',
                            duration: 1500,
                            icon: 'none',
                            mask: true
                        })
                    }
                } else if (that.data.check2 != '') { //鞋面改色
                    if (that.data.content2.length >= 10) {
                        content['instep'] = that.data.content2;
                        map['content'] = content; //备注信息
                        if (that.data.img != '') {
                            map['left_image'] = that.data.img; //左侧45度图片
                            if (JSON.stringify(that.data.items2) != '{}') {
                                items.push(that.data.items2)
                            };
                            map['items'] = items; //要购买的服务
                            if (that.data.picItem2 != '') {
                                help_image['instep'] = that.data.picItem2;
                            };
                            if (JSON.stringify(help_image) != '{}') {
                                map['help_image'] = help_image; //辅助图片
                            };
                            if (that.data.voiceItem2 != '') {
                                help_audio['instep'] = that.data.voiceItem2;
                            };
                            if (JSON.stringify(help_audio) != '{}') {
                                map['help_audio'] = help_audio; //辅助录音
                            };
                            if (that.data.videoItem2 != '') {
                                help_video['instep'] = that.data.videoItem2;
                            };
                            if (JSON.stringify(help_video) != '{}') {
                                map['help_video'] = help_video; //辅助视频
                            };
                            that.go(map);
                        } else {
                            wx.showToast({
                                title: '请上传鞋子45°照片',
                                duration: 1500,
                                icon: 'none',
                                mask: true
                            })
                        }
                    } else {
                        wx.showToast({
                            title: '鞋面改色请至少输入10字备注信息',
                            duration: 1500,
                            icon: 'none',
                            mask: true
                        })
                    }
                } else {
                    wx.showToast({
                        title: '请至少选择一项服务',
                        duration: 1500,
                        icon: 'none',
                        mask: true
                    })
                }
            }
        );
    },
    go: function(map) {
        wx.request({
            url: app.globalData.url + '/api/ext/care/color/becolor',
            method: 'POST',
            data: map,
            success: function(res) {
                wx.hideToast();
                if (res.data.status == 201) {
                    wx.redirectTo({
                        url: '/pages/colorSubmit/colorSubmit',
                    })
                }
            },
            fail: function(e) {
                cosnole.log(e)
            }
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        // mta
        mta.Page.init()
        var that = this;
        that.getData();
        that.qiniuToken()
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {
        this.videoContext1 = wx.createVideoContext('myVideo1')
        this.videoContext2 = wx.createVideoContext('myVideo2')
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