// pages/detail-songs/index.js

import rankingStore from "../../store/ranking-store"
import {getSongsDetail} from "../../service/music"
// import {getImageHeight} from "../../utils/query-rect"
import {    
    audioContext,
    playerStore
} from "../../store/player-store"

Page({

    /**
     * 页面的初始数据
     */
    data: {
        rankingInfo: {},
        rankingName: null,
        songsInfo: {},
        tracks: [],
        imageHeight: 0,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        const {rankingName, id, type} = options;
        // console.log(rankingName, id, type)
        if (type === "ranking") {
                this.setData({rankingName})
                rankingStore.onState(rankingName, (res) =>{
                this.setData({tracks: res.tracks});
                this.setData({rankingInfo: res})
            })
        } else if (type === "menu") {
            getSongsDetail(id).then(res => {
                // 网易云接口限制，不登录仅返回10条数据
               this.setData({songsInfo: res.playlist})
               this.setData({tracks: res.playlist.tracks})
            })
        }
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function (res) {
        if (this.data.rankingName) {
            rankingStore.offState(this.data.rankingName, (res) =>{
                this.setData({rankName: null});
                this.setData({tracks:[]});
                this.setData({rankingInfo: {}})
            })
        }
    },

    // 事件监听函数
    handleImageLoad() {
        const query = wx.createSelectorQuery()
        // 绑定感兴趣的组件
        query.select('.bg-image').boundingClientRect()
        // 相对于视口的滚动位置
        // query.selectViewport().scrollOffset()
        query.exec((res) => {
            const rect = res[0];
            console.log(rect.height);
            this.setData({imageHeight: rect.height})
        })
    },

    handleItemClick(e) {
        const {index} = e.currentTarget.dataset;
        console.log(index);
        playerStore.setState("songsList", this.data.tracks);
        playerStore.setState("playingSongIdx", index)
    }
})