var app = getApp();
var mta = require('../../utils/mta_analysis.js')
Page({
    data: {
        static: app.globalData.statics,
        url: app.globalData.url,
        text: '',
        list: [],
        alpha: '',
        windowHeight: ''
    },
    onLoad(options) {
        // mta
        mta.Page.init()
        try {
            var res = wx.getSystemInfoSync()
            this.pixelRatio = res.pixelRatio;
            // this.apHeight = 32 / this.pixelRatio;
            // this.offsetTop = 160 / this.pixelRatio;
            this.apHeight = 16;
            this.offsetTop = 80;
            this.setData({ windowHeight: res.windowHeight + 'px' })
        } catch (e) {

        };
        this.getList();
    },
    getList: function () {
        var that = this;
        wx.request({
            url: that.data.url + '/api/captcha/sms/code',
            data: {},
            method: 'GET',
            success: function (res) {
                var lists = [
                    { alphabet: 'Top', datas: ['asome', 'aentries', 'are here'] },
                    { datas: [{ abstract: "CN", code: '86', en: "China", id: "217", sn: '中国', sort: 1 }] },
                    {
                        alphabet: 'A', datas: []
                    },
                    {
                        alphabet: 'B', datas: []
                    },
                    {
                        alphabet: 'C', datas: []
                    },
                    {
                        alphabet: 'D', datas: []
                    },
                    {
                        alphabet: 'E', datas: []
                    },
                    {
                        alphabet: 'F', datas: []
                    },
                    {
                        alphabet: 'G', datas: []
                    },
                    {
                        alphabet: 'H', datas: []
                    },
                    {
                        alphabet: 'I', datas: []
                    },
                    {
                        alphabet: 'J', datas: []
                    },
                    {
                        alphabet: 'K', datas: []
                    },
                    {
                        alphabet: 'L', datas: []
                    },
                    {
                        alphabet: 'M', datas: []
                    },
                    {
                        alphabet: 'N', datas: []
                    },
                    {
                        alphabet: 'O', datas: []
                    },
                    {
                        alphabet: 'P', datas: []
                    },
                    {
                        alphabet: 'Q', datas: []
                    },
                    {
                        alphabet: 'R', datas: []
                    },
                    {
                        alphabet: 'S', datas: []
                    },
                    {
                        alphabet: 'T', datas: []
                    },
                    {
                        alphabet: 'U', datas: []
                    },
                    {
                        alphabet: 'V', datas: []
                    },
                    {
                        alphabet: 'W', datas: []
                    },
                    {
                        alphabet: 'X', datas: []
                    },
                    {
                        alphabet: 'Y', datas: []
                    },
                    {
                        alphabet: 'Z', datas: []
                    },
                ];
                var list = res.data.data;
                for (var i in list) {
                    if (list[i].abstract.charAt(0) == 'A') {
                        lists[2].datas.push(list[i])
                    }
                    if (list[i].abstract.charAt(0) == 'B') {
                        lists[3].datas.push(list[i])
                    }
                    if (list[i].abstract.charAt(0) == 'C') {
                        lists[4].datas.push(list[i])
                    }
                    if (list[i].abstract.charAt(0) == 'D') {
                        lists[5].datas.push(list[i])
                    }
                    if (list[i].abstract.charAt(0) == 'E') {
                        lists[6].datas.push(list[i])
                    }
                    if (list[i].abstract.charAt(0) == 'F') {
                        lists[7].datas.push(list[i])
                    }
                    if (list[i].abstract.charAt(0) == 'G') {
                        lists[8].datas.push(list[i])
                    }
                    if (list[i].abstract.charAt(0) == 'H') {
                        lists[9].datas.push(list[i])
                    }
                    if (list[i].abstract.charAt(0) == 'I') {
                        lists[10].datas.push(list[i])
                    }
                    if (list[i].abstract.charAt(0) == 'J') {
                        lists[11].datas.push(list[i])
                    }
                    if (list[i].abstract.charAt(0) == 'K') {
                        lists[12].datas.push(list[i])
                    }
                    if (list[i].abstract.charAt(0) == 'L') {
                        lists[13].datas.push(list[i])
                    }
                    if (list[i].abstract.charAt(0) == 'M') {
                        lists[14].datas.push(list[i])
                    }
                    if (list[i].abstract.charAt(0) == 'N') {
                        lists[15].datas.push(list[i])
                    }
                    if (list[i].abstract.charAt(0) == 'O') {
                        lists[16].datas.push(list[i])
                    }
                    if (list[i].abstract.charAt(0) == 'P') {
                        lists[17].datas.push(list[i])
                    }
                    if (list[i].abstract.charAt(0) == 'Q') {
                        lists[18].datas.push(list[i])
                    }
                    if (list[i].abstract.charAt(0) == 'R') {
                        lists[19].datas.push(list[i])
                    }
                    if (list[i].abstract.charAt(0) == 'S') {
                        lists[20].datas.push(list[i])
                    }
                    if (list[i].abstract.charAt(0) == 'T') {
                        lists[21].datas.push(list[i])
                    }
                    if (list[i].abstract.charAt(0) == 'U') {
                        lists[22].datas.push(list[i])
                    }
                    if (list[i].abstract.charAt(0) == 'V') {
                        lists[23].datas.push(list[i])
                    }
                    if (list[i].abstract.charAt(0) == 'W') {
                        lists[24].datas.push(list[i])
                    }
                    if (list[i].abstract.charAt(0) == 'X') {
                        lists[25].datas.push(list[i])
                    }
                    if (list[i].abstract.charAt(0) == 'Y') {
                        lists[26].datas.push(list[i])
                    }
                    if (list[i].abstract.charAt(0) == 'Z') {
                        lists[27].datas.push(list[i])
                    }
                }
                that.setData({
                    list: lists
                })
            },
            fail: function (e) {
                console.log(e)
            }
        })
    },
    input: function (e) {
        this.setData({
            text: e.detail.value
        })
    },
    search: function () {
        var that = this
        var text = that.data.text;
        if(text != ''){
            wx.request({
                url: that.data.url + '/api/captcha/sms/code?sn=' + text,
                data: {},
                method: 'GET',
                success: function (res) {
                    var lists = [
                        { alphabet: 'Top', datas: ['asome', 'aentries', 'are here'] },
                        { datas: [] },
                    ];
                    var list = res.data.data;
                    for (var i in list) {
                        lists[1].datas.push(list[i])
                    }
                    that.setData({
                        list: lists
                    })
                },
                fail: function (e) {

                }
            })
        }else{
            this.getList();
        }
    },
    handlerAlphaTap(e) {
        let { ap } = e.target.dataset;
        this.setData({ alpha: ap });
    },
    handlerMove(e) {
        let { list } = this.data;
        let moveY = e.touches[0].clientY;
        let rY = moveY - this.offsetTop;
        if (rY >= 0) {
            let index = Math.ceil((rY - this.apHeight) / this.apHeight);
            if (0 <= index < list.length) {
                let nonwAp = list[index];
                nonwAp && this.setData({ alpha: nonwAp.alphabet });
            }
        }
    },
    prefix(e) {
        var prefix = e.currentTarget.dataset.num;
        app.globalData.num = prefix;
        var sort = e.currentTarget.dataset.sort;
        app.globalData.sort = sort;
        wx.navigateTo({
            url: '/pages/binding/binding'
        })
    },
    onShow: function () {

    },
    onReady: function () {

    }
})