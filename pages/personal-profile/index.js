// pages/personal-profile/index.js
import {logIn, getHistorySongs, getLikeAlbums} from "../../service/user"

Page({

    /**
     * 页面的初始数据
     */
    data: {
        phone: "",
        password: "",
        isLogin: false,
        userInfo: {},
        historySongs: [],
        likeAlbums: [],
        hasMore: true,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        const userInfo = JSON.parse(wx.getStorageSync('userInfo'));
        if (userInfo.userId) {
            this.setData({isLogin: true, userInfo})
            getHistorySongs(userInfo.userId).then(res => {
                this.setData({historySongs: res.allData})
            })
            getLikeAlbums(userInfo.userId).then(res => {
                this.setData({likeAlbums: res.playlist, hasMore: res.more})
            })
        }
    },


    // 事件处理
    handlePasswordChange(e) {
        const password = e.detail.value;
        this.setData({password})
    },

    handlePhoneChange(e) {
        const phone = e.detail.value;
        this.setData({phone})
    },

    handleSubmit(e) {
        // 登录前的前端校验
        const {phone, password} = this.data;
        if (!phone) {
            wx.showToast({
                title: "手机号为空！",
                icon: "error"
            })
            return;
        }
        // 手机号11位
        let phoneReg = /^1(3|4|5|6|7|8|9)\d{9}$/;
        if (!phoneReg.test(phone)) {
            wx.showToast({
                title: "手机号格式不对",
                icon: "error"
            })
            return;
        }

        if (!password) {
            wx.showToast({
                title: "密码不能为空！",
                icon: "error"
            })
            return;
        }

        logIn(phone, password).then(res => {
            if (res.code === 502) {
                // 密码错误
                wx.showToast({
                    title: res.message,
                    icon: "error"
                })
            } else if (res.code === 501) {
                // 账号不存在
                wx.showToast({
                    title: res.message,
                    icon: "error"
                })
            } else if (res.code === 200) {
                // 登陆成功
                wx.setStorageSync('userInfo', JSON.stringify(res.profile));
                wx.setStorageSync("cookie", res.cookie)
                wx.setStorageSync("token", res.token)
                this.setData({password: "", phone: ""})
            } else {
                wx.showToast({
                    title: "登陆失败",
                    icon: "error"
                })
            }
        })
        
    },

    // 查看更多播放记录的回调
    handleHistoryClick() {
        console.log(111)
    },

    // 查看更多收藏歌单的额回调
    handleAlbumClick() {
        console.log(222);
    }
})