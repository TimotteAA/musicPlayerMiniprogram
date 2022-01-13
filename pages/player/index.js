// pages/player/index.js

import {getSongDetail} from "../../service/song"

Page({

    /**
     * 页面的初始数据
     */
    data: {
        id: null,
        currentSong: {},
        currentPage: 0,
        contentHeight: 0,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        const {id} = options;
        this.setData({id});

        this.getPageData();

        // 计算轮播图高度
        const screenHeight = getApp().globalData.screenHeight;
        const statusBarHeight = getApp().globalData.statusBarHeight;
        const contentHeight = screenHeight - 44 - statusBarHeight;
        this.setData({contentHeight })

        // 页面内部的歌曲播放，注意这个歌曲是局部变量
        // const audioContext = wx.createInnerAudioContext();
        // audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`;
        // audioContext.play();
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    getPageData() {
        getSongDetail(this.data.id).then(res => {
            this.setData({currentSong: res.songs[0]})
        })
    },

    // 时间处理
    handleSwiperChange(e) {
        const currentPage = e.detail.current;
        this.setData({currentPage})
    },

    handleClick() {
        wx.navigateBack({
            delta: 1,
        })
    }
})