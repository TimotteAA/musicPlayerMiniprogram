// components/song-menu-area/index.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        hotSongsList: {
            type: Array,
            value: [],
        },
        title: {
            type: String,
            value: "熱門歌單"
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
        handleMenuItemClick(e) {
            const  {item} = e.currentTarget.dataset;
            wx.navigateTo({
              url: `/pages/detail-songs/index?id=${item.id}&type=menu`,
            })
        }
    }
})
