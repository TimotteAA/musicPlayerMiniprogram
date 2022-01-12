// components/song-list-item/index.js
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
            wx.navigateTo({
              url: '/pages/player/index?id=' + id,
            })
        }
    }
})
