// pages/personsal-display/index.js
import {userStore} from "../../store/index"

Page({

    /**
     * 页面的初始数据
     */
    data: {
        title: 0,
        historySongs: [],
        likeAlbums: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        const {title} = options;
        // console.log(title);
        if (title === "0") {
            this.setData({"title": "历史记录"})
        } else if (title === "1") {
            this.setData({"title": "收藏歌单"})
        }
        
        userStore.onState("historySongs", res => {
            this.setData({"historySongs": res})
        })
        
        userStore.onState("likeAlbums", res => {
            this.setData({"likeAlbums": res})
        })
    
    },
})