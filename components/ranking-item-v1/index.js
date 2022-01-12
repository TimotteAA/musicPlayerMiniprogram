// components/ranking-item-v1/index.js
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
        height: 0
    },

    /**
     * 组件的方法列表
     */
    methods: {
        handleImageLoaded() {
            const query = wx.createSelectorQuery()
            query.select('.ranking-item-img').boundingClientRect()
            query.exec(function(res){
                console.log(res);
            })
        }
    },

})
