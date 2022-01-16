// pages/player/index.js

import {getSongDetail, getSongLyric} from "../../service/song"
import {audioContext, playerStore} from "../../store/index"
import {parseLyric, getCurrentLyric} from "../../utils/parse-lyric"

const PLAY_MODES = ["order", "repeat", "random"]

// audioContext.onPlay(() => {
//     console.log(audioContext.src);
// })

// audioContext.onPause(() => {
//     console.log(audioContext.src);
// })

// audioContext.onSeeked(() => {
//     console.log(`onSeeked`, audioContext.currentTime)
// })

// audioContext.onSeeking(() => {
//     console.log(`onSeeking`, audioContext.currentTime)
// })

Page({

    /**
     * 页面的初始数据
     */
    data: {
        currentPage: 0,
        contentHeight: 0,
        isShown: true,
        // 下为歌曲播放时所需的数据
        
        lyrics: [],
        duration: 0,


        id: null,
        isSliderChanging : false,

        // 别的页面也有播放器？
        currentPlayTime: 0,
        sliderValue: 0,
        currentLyricIdx: 0,

        scrollTop: 0,

        playMode: 0,
        playModeName: "order",

        // 
        isPlaying: false,

        // 跳转类型
        type: 0,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        const {id, type} = options;
        // console.log(type);
        this.setData({id, type});

        // 发送网络请求
        // this.getPageData();
        this.setUpPlayerStore();

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

        // // 首页也可以播放，改变播放、播放别的歌
        // audioContext.stop();
        // // 实际播放器的实例，先下载、再编解码
        // audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`;
        // audioContext.autoplay = true;
        
        // // 快进后也能继续播放
        // audioContext.onCanplay(() => {
        //     audioContext.play();
        // })

        // // 监听时间更新，求进度条值、歌词
        // audioContext.onTimeUpdate(() => {
        //     // 修改当前时间与进度条位置
        //     const currentTime = audioContext.currentTime
        //     const currentSliderValue = currentTime *1000 / this.data.duration * 100;
        //     // 拿到的是秒，总时间是毫秒数
            
        //     if (!this.data.isSliderChanging) {
        //         // 用户没有拖拉
        //         this.setData({currentPlayTime: currentTime * 1000})
        //         this.setData({sliderValue: currentSliderValue})
        //     }
        //     // currentTime的单位是秒
        //     const idx = getCurrentLyric(currentTime *1000, this.data.lyrics)
        //     // console.log(currentLyricIdx)
        //     // 防止重复打印，只有新的值与已有歌词不一样，才设置
        //     if (idx !== this.data.currentLyricIdx) {
        //         this.setData({currentLyricIdx: idx})
        //         // console.log(idx);
        //         this.setData({scrollTop: idx - 1 >= 0 ? (idx - 1) * 41 : 0})
        //     } 
        // })
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

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

    // 拖动滑块结束后，设定新的播放器时间
    handleSliderChange(event) {
        console.log(111);
        // 1. 获取进度条位置
        const value = event.detail.value;
       
        console.log(value);

        // 2. 设置新的播放器时间
        const time = this.data.duration * value / 100;
        // 先暂停播放
        audioContext.pause(); 
        // audioContext.seek(time / 1000);
        audioContext.seek(time / 1000);
        audioContext.play();
        // audioContext.onSeeked(() => {
        //     audioContext.play();
        // })
        this.setData({sliderValue: value, isSliderChanging: false})
    },

    handleSliderChanging(event) {
        const value = event.detail.value;
        // 让时间虽滑动位置播放
        const currentTime = value * this.data.duration / 100;
        // 不让自动改变滑块值
        this.setData({isSliderChanging: true,
            currentPlayTime: currentTime,
        })

        // 这里不能设置滑块值，因为渲染是异步的，可能会出现鬼畜的移动
        // sliderValue: value
    },

    handleModeBtnClick() {
        // 改变playMode
        const prevMode = this.data.playMode;
        const nextMode = (prevMode + 1) % 3;
        
        // 改变store
        playerStore.setState("playMode", nextMode)
    },

    handleIsPlayingClick() {
        // 改变页面的isPlaying
        // playerStore.setState("isPlaying", !this.data.isPlaying)

        playerStore.dispatch("changeAudioContextState");
    },

    // 监听store的变化
    setUpPlayerStore() {
        playerStore.onStates(['currentSong', 'duration', 'lyrics'], (res) => {
            // 监听到改变的res是对象
            const {currentSong, duration, lyrics} = res;
            // 谁变穿谁过来
            if (currentSong) {
                this.setData({currentSong})
            }
            if (duration) {
                this.setData({duration});
            }
            if (lyrics) {
                this.setData({lyrics})
            }
        })

        // 监听currentTime、currentLyricIndex的变化
        // 从store里取，放到页面自己的data里
        playerStore.onStates(['currentPlayTime', 'currentLyricIdx'], (res) => {
            const {currentPlayTime, currentLyricIdx: idx} = res;
            console.log(currentPlayTime)
            if (currentPlayTime && !this.data.isSliderChanging) {
                // 1、currentTime的变化
                // currentTime的变化，修改滑块的位置
                // console.log(currentPlayTime);
                const currentSliderValue = currentPlayTime / this.data.duration * 100;
                console.log(currentPlayTime)
                this.setData({currentPlayTime: currentPlayTime})
                this.setData({sliderValue: currentSliderValue})
            }

            if (idx) {
                // 2. currentLyricIndex的变化
                if (idx !== this.data.currentLyricIdx) {
                this.setData({currentLyricIdx: idx})
                // console.log(idx);
                this.setData({scrollTop: idx - 1 >= 0 ? (idx - 1) * 41 : 0})
                } 
            }
        })

        // 监听模式的改变
        playerStore.onState("playMode", (res) => {
            this.setData({playMode: res, playModeName: PLAY_MODES[res]})
        })

        // 监听暂停、播放的改变
        playerStore.onState("isPlaying", res => {
            this.setData({isPlaying: res})
        })
    }
})