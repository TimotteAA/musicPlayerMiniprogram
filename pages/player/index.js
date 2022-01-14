// pages/player/index.js

import {getSongDetail, getSongLyric} from "../../service/song"
import {audioContext} from "../../store/index"
import {parseLyric, getCurrentLyric} from "../../utils/parse-lyric"

Page({

    /**
     * 页面的初始数据
     */
    data: {
        id: null,
        currentSong: {},
        currentPage: 0,
        contentHeight: 0,
        isShown: true,
        duration: 0,
        currentPlayTime: 0,
        sliderValue: 0,
        isSliderChanging : false,
        lyrics: [],
        currentLyricIdx: 0,
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
        const deviceRatio = getApp().globalData.deviceRatio;
        this.setData({contentHeight })
        this.setData({isShown: deviceRatio >= 2})


        // 页面内部的歌曲播放，注意这个歌曲是局部变量
        // 音乐应该是全局的？
        // 下面是创建了一个播放器
        // const audioContext = wx.createInnerAudioContext();

        // 使用全局的audioContext，停止之前的播放;
        audioContext.stop();
        // 实际播放器的实例，先下载、再编解码
        audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`;
        audioContext.autoplay = true;
        
        // 快进后也能继续播放
        audioContext.onCanplay(() => {
            audioContext.play();
        })

        // 监听时间更新
        audioContext.onTimeUpdate(() => {
            // 修改当前时间与进度条位置
            const currentTime = audioContext.currentTime
            const currentSliderValue = currentTime *1000 / this.data.duration * 100;
            // 拿到的是秒，总时间是毫秒数
            3
            if (!this.data.isSliderChanging) {
                // 用户没有拖拉
                this.setData({currentPlayTime: currentTime * 1000})
                this.setData({sliderValue: currentSliderValue})
            }
            // currentTime的单位是秒
            const idx = getCurrentLyric(currentTime *1000, this.data.lyrics)
            // console.log(currentLyricIdx)
            // 防止重复打印，只有新的值与已有歌词不一样，才设置
            if (idx !== this.data.currentLyricIdx) {
                this.setData({currentLyricIdx: idx})
                // console.log(idx);
            } 
        })
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    getPageData() {
        getSongDetail(this.data.id).then(res => {
            this.setData({currentSong: res.songs[0], duration: res.songs[0].dt})
        })
        getSongLyric(this.data.id).then(res => {
            const lyricString = res.lrc.lyric
            const lyrics = parseLyric(lyricString);
            this.setData({lyrics})
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
    },

    handleSliderChange(event) {
        // 1. 获取进度条位置
        const value = event.detail.value;
       
        // console.log(value);

        // 2. 设置新的播放器时间
        const time = this.data.duration * value / 100;
        // 先暂停播放
        audioContext.pause();
        audioContext.seek(time / 1000);

        this.setData({sliderValue: value, isSliderChanging: false})
    },

    handleSliderChanging(event) {
        const value = event.detail.value;
        // 让时间虽滑动位置播放
        const currentTime = value * this.data.duration / 100;
        // 不让自动改变滑块值
        this.setData({isSliderChanging: true,
            currentPlayTime: currentTime,
            sliderValue: value
        })

    }
})