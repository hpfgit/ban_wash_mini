var app = getApp();
var address = require('../../utils/city.js')
var mta = require('../../utils/mta_analysis.js')
Page({
    data: {
        default: 1,
        static: app.globalData.statics,
        addModule: false,
        reviseModule: false,
        animationAddressMenu: {},
        addressMenuIsShow: false,
        value: [0, 0, 0],
        provinces: [],
        citys: [],
        areas: [],
        addInfo: '',
        state: 1,
        data: [],
        // 添加地址
        name: '',
        phone: '',
        pCode: '',
        cCode: '',
        aCode: '',
        address: '',
        editInfo: 'aaa',
        isDefault: 0,
        // 删除第几个
        delId: ''
    },
    getData: function() {
        var that = this;
        app.isToken(
            function goNext() {
                var token = wx.getStorageSync("token")
                wx.request({
                    url: app.globalData.url + '/api/oms/consignee',
                    method: 'GET',
                    data: {
                        token: token
                    },
                    success: function(res) {
                        that.setData({
                            data: res.data.data
                        })
                    },
                    fail: function(e) {

                    }
                })
            }
        );
    },
    // 添加输入框
    addName: function(e) {
        var that = this;
        that.setData({
            name: e.detail.value
        })
    },
    addPhone: function(e) {
        var that = this;
        that.setData({
            phone: e.detail.value
        })
    },
    addAddress: function(e) {
        var that = this;
        that.setData({
            address: e.detail.value
        })
    },
    // 默认地址开关
    switchChange: function(e) {
        var that = this;
        if (e.detail.value == true) {
            that.setData({
                isDefault: 1
            })
        } else {
            that.setData({
                isDefault: 0
            })
        }

    },
    // 编辑地址
    edit: function(e) {
        var that = this;
        var index = e.currentTarget.dataset.index;
        var data = that.data.data;
        for (var i in data) {
            if (i == index) {
                that.setData({
                    reviseModule: true,
                    state: 1,
                    name: data[i].consignee_name,
                    phone: data[i].mb_phone,
                    pCode: data[i].province_code,
                    cCode: data[i].city_code,
                    aCode: data[i].area_code,
                    editInfo: data[i].area_info,
                    address: data[i].address,
                    isDefault: data[i].is_default,
                    delId: data[i].id
                });
            }
        }
    },
    // 关闭编辑地址
    closeRevise: function() {
        var that = this;
        that.setData({
            reviseModule: false,
            name: '',
            phone: '',
            pCode: '',
            cCode: '',
            aCode: '',
            editInfo: '',
            address: '',
            isDefault: 0,
            delIndex: ''
        })
    },
    // 删除地址
    delRevise: function() {
        var that = this;
        var token = wx.getStorageSync('token')
        var delId = that.data.delId;
        wx.request({
            url: app.globalData.url + '/api/oms/consignee/' + delId,
            method: 'DELETE',
            data: {
                token: token
            },
            success: function(res) {
                if (res.data.status == 204) {
                    that.setData({
                        reviseModule: false,
                        name: '',
                        phone: '',
                        pCode: '',
                        cCode: '',
                        aCode: '',
                        editInfo: '',
                        address: '',
                        isDefault: 0,
                        delIndex: ''
                    })
                    that.getData();
                }
            },
            fail: function(e) {
                console.log(e)
            }
        })
    },
    // 确定修改地址
    confirmRevise: function() {
        var that = this;
        var token = wx.getStorageSync('token')
        var delId = that.data.delId;
        if (that.data.editInfo !== '' && that.data.name != '' && that.data.phone != '' && that.data.address != '') {
            wx.request({
                url: app.globalData.url + '/api/oms/consignee/' + delId,
                method: 'PUT',
                data: {
                    token: token,
                    consignee_name: that.data.name,
                    mb_phone: that.data.phone,
                    province_code: that.data.pCode,
                    city_code: that.data.cCode,
                    area_code: that.data.aCode,
                    address: that.data.address,
                    is_default: that.data.isDefault
                },
                success: function(res) {
                    if (res.data.status == 201) {
                        that.setData({
                            reviseModule: false,
                            name: '',
                            phone: '',
                            pCode: '',
                            cCode: '',
                            aCode: '',
                            editInfo: '',
                            address: '',
                            isDefault: 0,
                            delIndex: ''
                        })
                    }
                    that.getData();
                },
                fail: function(e) {
                    console.log(e)
                }
            })
        } else {
            wx.showToast({
                title: '请完善收获地址信息',
                duration: 1500,
                icon: 'none',
                mask: true
            })
        }
    },
    // 添加新地址
    addNewAddress: function() {
        var that = this;
        that.setData({
            addModule: true,
            addInfo: '',
            state: 2
        })
    },
    // 关闭添加新地址
    closeAdd: function() {
        var that = this;
        that.setData({
            addModule: false
        })
    },
    // 确定添加新地址
    confirmAdd: function() {
        var that = this;
        var token = wx.getStorageSync('token')
        if (that.data.addInfo !== '' && that.data.name != '' && that.data.phone != '' && that.data.address != '' && that.data.phone.length == 11) {
            wx.request({
                url: app.globalData.url + '/api/oms/consignee',
                method: 'POST',
                data: {
                    token: token,
                    consignee_name: that.data.name,
                    mb_phone: that.data.phone,
                    province_code: that.data.pCode,
                    city_code: that.data.cCode,
                    area_code: that.data.aCode,
                    address: that.data.address,
                    is_default: that.data.isDefault
                },
                success: function(res) {
                    if (res.data.status == 201) {
                        that.setData({
                            addModule: false
                        })
                    }
                    that.getData();
                },
                fail: function(e) {
                    console.log(e)
                }
            })
        } else {
            wx.showToast({
                title: '请完善收获地址信息',
                duration: 1500,
                icon: 'none',
                mask: true
            })
        }
    },
    // 选择地址
    select_add(e) {
      let idx = e.currentTarget.dataset.index;
      let address = this.data.data[idx];
      let pages = getCurrentPages();
      let prevPages = pages[pages.length - 2];
      prevPages.setData({
        address
      })
      wx.navigateBack({
        delta: 1
      })
    },
    // 加载页面执行
    onLoad: function() {
        // mta
        mta.Page.init()
        // 初始化动画变量
        var animation = wx.createAnimation({
            duration: 500,
            transformOrigin: "50% 50%",
            timingFunction: 'ease',
        })
        this.animation = animation;
        // 默认联动显示北京
        var id = address.provinces[0].id
        this.setData({
            provinces: address.provinces,
            citys: address.citys[id],
            areas: address.areas[address.citys[id][0].id],
        });
    },
    // 页面每次加载都执行
    onShow: function() {
        var that = this;
        that.getData();
    },
    // 点击所在地区弹出选择框
    selectDistrict: function(e) {
        var that = this
        if (that.data.addressMenuIsShow) {
            return
        }
        that.startAddressAnimation(true)
    },
    // 执行动画
    startAddressAnimation: function(isShow) {
        var that = this
        if (isShow) {
            that.animation.translateY(0 + 'vh').step()
        } else {
            that.animation.translateY(40 + 'vh').step()
        }
        that.setData({
            animationAddressMenu: that.animation.export(),
            addressMenuIsShow: isShow,
        })
    },
    // 点击地区选择取消按钮
    cityCancel: function(e) {
        this.startAddressAnimation(false)
    },
    // 点击地区选择确定按钮
    citySure: function(e) {
        var that = this
        var city = that.data.city
        var value = that.data.value
        that.startAddressAnimation(false)
        // 将选择的城市信息显示到输入框
        if (that.data.state == 2) { //添加地址
            var areaInfo = that.data.provinces[value[0]].name + that.data.citys[value[1]].name + that.data.areas[value[2]].name
            that.setData({
                addInfo: areaInfo,
                pCode: that.data.provinces[value[0]].id,
                cCode: that.data.citys[value[1]].id,
                aCode: that.data.areas[value[2]].id
            })
        } else if (that.data.state == 1) { //编辑地址
            var areaInfo = that.data.provinces[value[0]].name + ',' + that.data.citys[value[1]].name + ',' + that.data.areas[value[2]].name
            that.setData({
                editInfo: areaInfo,
                pCode: that.data.provinces[value[0]].id,
                cCode: that.data.citys[value[1]].id,
                aCode: that.data.areas[value[2]].id
            })
        }
    },
    hideCitySelected: function(e) {
        this.startAddressAnimation(false)
    },
    // 处理省市县联动逻辑
    cityChange: function(e) {
        var value = e.detail.value
        var provinces = this.data.provinces
        var citys = this.data.citys
        var areas = this.data.areas
        var provinceNum = value[0]
        var cityNum = value[1]
        var countyNum = value[2]
        if (this.data.value[0] != provinceNum) {
            var id = provinces[provinceNum].id
            this.setData({
                value: [provinceNum, 0, 0],
                citys: address.citys[id],
                areas: address.areas[address.citys[id][0].id],
            })
        } else if (this.data.value[1] != cityNum) {
            var id = citys[cityNum].id
            this.setData({
                value: [provinceNum, cityNum, 0],
                areas: address.areas[citys[cityNum].id],
            })
        } else {
            this.setData({
                value: [provinceNum, cityNum, countyNum]
            })
        }
    },
})