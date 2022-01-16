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
            // 监听模式的改变
            playerStore.onState("playMode", (res) => {
                this.setData({playMode: res, playModeName: PLAY_MODES[res]})
            })
    
            // 监听暂停、播放的改变
            playerStore.onState("isPlaying", res => {
                this.setData({isPlaying: res})
            })
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

        handleImageClick(e) {
            // console.log(e);
            const {id} = e.currentTarget.dataset;
            // 页面跳转
            console.log(id);
            wx.navigateTo({
              url: '/pages/player/index?id=' + id,
            })
            // 点击歌曲，发起store里的网络请求，从而让播放页面监听数据的变化
            playerStore.dispatch('playMusicWithSongIdAction', {id});
        }
    }
})
