// components/bottom-player/index.js
import {audioContext, playerStore} from "../../store/index"

const PLAY_MODES = ["order", "repeat", "random"]
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        currentSong: {
            type: Object,
            value: {}
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        playMode: 0,
        playModeName: "order",

        // 
        isPlaying: true
    },

    /** 
     * 组件的生命周期
     */
    lifetimes: {
        created() {
            this.setUpPlayerStore();
        }
    },

    /**
     * 组件的方法列表
     */
    methods: {
        setUpPlayerStore() {    
            // 监听暂停、播放的改变
            playerStore.onState("isPlaying", res => {
                this.setData({isPlaying: res})
            })
        },
    
        handleIsPlayingClick() {
            playerStore.dispatch("changeAudioContextState", !this.data.isPlaying);
        },

        handleImageClick(e) {
            const {id} = e.currentTarget.dataset;
            wx.navigateTo({
              url: '/pages/player/index?id=' + id,
            })
            // 点击歌曲，发起store里的网络请求，从而让播放页面监听数据的变化
            playerStore.dispatch('playMusicWithSongIdAction', {id});
        },
            // 若是单曲循环，则下一首还是当前这首
        handlePrevBtnClick() {
            playerStore.dispatch("changePrevPlayingSong")
        },

        handleNextBtnClick() {
            playerStore.dispatch("changeNextPlayingSong");
        }
    }
})
