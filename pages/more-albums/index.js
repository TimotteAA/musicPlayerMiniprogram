// pages/more-albums/index.js
import {getSongsList} from "../../service/music"

Page({

    /**
     * 页面的初始数据
     */
    data: {
        type: 0,
        // 华语
        chineseSongs: [],
        // 流行
        popularSongs: [],
        // 摇滚
        rockSongs: [],
        // 轻音乐
        lightSongs: [],
        // 电子
        electronicSongs: [],

        // 日本歌曲
        japneseSongs: [],
        hasMore: true
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        const {type} = options;
        this.setData({type})

        this.getPageData();
    },
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        if (!this.data.hasMore) return;

        getSongsList("日语", 10, this.data.japneseSongs.length).then(res => {
            this.setData({hasMore: res.more})
            this.setData({japneseSongs: [...this.data.japneseSongs, ...res.playlists]})
        })
    },

    getPageData() {
        if (this.data.type === "0") {
            getSongsList("华语").then(res => {
                this.setData({chineseSongs: res.playlists})
            })
            getSongsList("流行").then(res => {
                this.setData({popularSongs: res.playlists})
            })
            getSongsList("摇滚").then(res => {
                this.setData({rockSongs: res.playlists})
            })
            getSongsList("轻音乐").then(res => {
                this.setData({lightSongs: res.playlists})
            })
            getSongsList("电子").then(res => {
                this.setData({electronicSongs: res.playlists})
            })
        } else {
            getSongsList("日语", 10).then(res => {
                this.setData({hasMore: res.more})
                this.setData({japneseSongs: res.playlists})
            })
        }
    },

    // 事件监听
    handleMenuItemClick(e) {
        console.log(111);
        const  {item} = e.currentTarget.dataset;
        wx.navigateTo({
          url: `/pages/detail-songs/index?id=${item.id}&type=menu`,
        })
    },
})