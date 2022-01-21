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
        },
        showRight: {
            type: Boolean,
            value: true,
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
        },

        handleMoreClick(e) {
            const {title} = e.currentTarget.dataset;
            let type;
            // 从热门歌单跳转，还是从推荐歌单跳转
            if (title === "热门歌单") {
                type = 0;
            } else {
                type = 1;
            }
            wx.navigateTo({
              url: `/pages/more-albums/index?type=${type}`,
            })
        }
    }
})
