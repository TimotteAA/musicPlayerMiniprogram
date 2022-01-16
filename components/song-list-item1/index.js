// components/song-list-item/index.js

import {playerStore} from "../../store/index"

Component({
    /**
     * 组件的属性列表
     */
    properties: {
        item: {
            type: Object,
            value: {}
        }
    },

    /**
     * 组件的初始数据
     */
    data: {

    },

    /**
     * 组件的方法列表
     */
    methods: {
        handleItemNavigate(e) {
            const {id} = e.currentTarget.dataset;
            // 页面跳转
            wx.navigateTo({
              url: `/pages/player/index?id=${id}&type=0`,
            })
            // 点击歌曲，发起store里的网络请求，从而让播放页面监听数据的变化
            playerStore.dispatch('playMusicWithSongIdAction', {id, type: 0});
        }
    }
})
