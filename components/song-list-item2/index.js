// components/song-list-item2/index.js

import {playerStore} from "../../store/index"
import {isAvailable} from "../../service/music"
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        index: {
            type: Number,
            value: 0,
        },
        item:{
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
        async handleItemNavigate(e) {
            const {id} = e.currentTarget.dataset;
            try {
                const res = await isAvailable(id)
                if (!res.success) {
                    wx.showToast({
                        title: "暂无版权！",
                        icon: "error"
                    })
                    return;
                }
            } catch (err) {
                console.log(err.message)
            }
            
            wx.navigateTo({
              url: `/pages/player/index?id=${id}`,
            })
            // console.log(id);
            playerStore.dispatch('playMusicWithSongIdAction', {id, type: 0});
        }
    }
})
