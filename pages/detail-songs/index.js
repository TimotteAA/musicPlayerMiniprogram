// pages/detail-songs/index.js

import rankingStore from "../../store/ranking-store"
import {getSongsDetail,  likeAlubm} from "../../service/music"
import {getLikeAlbums} from "../../service/user"

import {getSongDetail} from "../../service/song"

// import {getImageHeight} from "../../utils/query-rect"
import {    
    audioContext,
    playerStore,
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
        userInfo: {},
        // t=1收藏，此时歌单未收藏；t = 2取消收藏，此时歌单已收藏
        ordered: false,
        trackIds: [],
        tracks: [],
        hasLike: false,

        // 下拉加载用的便宜
        offset: 10,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: async function (options) {
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
                if (this.data.userInfo.userId) {
                    this.getUserLike(this.data.userInfo.userId, res.playlist.id)
                }
            //    this.setData({ordered: res.playlist.ordered})
               this.setData({tracks: res.playlist.tracks})
               this.setData({trackIds: res.playlist.trackIds})

            })
        }
        
        if (wx.getStorageSync('userInfo')) {
            const userInfo = JSON.parse(wx.getStorageSync('userInfo'));
            if (userInfo.userId) {
                this.setData({isLogin: true, userInfo})
            }
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
        for (let song of this.data.tracks) {
            // console.log(song.name)
            playerStore.dispatch("addSongIntoSongsListAction", song.id)
        } 
    },
    // 收藏歌单：哪个字段不确定是代表了收藏的，故去已有收藏列表中比较，可能会延时渲染
    handleLike() {
        likeAlubm(1, this.data.songsInfo.id).then(res => {
            wx.showToast({
                title: '已收藏',
                icon: "success"
            })
            // getSongsDetail(this.data.songsInfo.id).then(res => {
            //     // 网易云接口限制，不登录仅返回10条数据
            //    this.setData({songsInfo: res.playlist})
            //     // if (this.data.userInfo.userId) {
            //     //     this.getUserLike(this.data.userInfo.userId, res.playlist.id)
            //     // }
            //    this.setData({ordered: res.playlist.ordered})
            // //    this.setData({tracks: res.playlist.tracks})
            // //    this.setData({trackIds: res.playlist.trackIds})
            // })
            this.getUserLike(this.data.userInfo.userId, this.data.songsInfo.id);
        }, (err) => {
            wx.showToast({
                title: '已收藏',
                icon: "success"
            })
            // getSongsDetail(this.data.songsInfo.id).then(res => {
            //     // 网易云接口限制，不登录仅返回10条数据
            //    this.setData({songsInfo: res.playlist})
            //     // if (this.data.userInfo.userId) {
            //     //     this.getUserLike(this.data.userInfo.userId, res.playlist.id)
            //     // }
            //    this.setData({ordered: res.playlist.ordered})
            // //    this.setData({tracks: res.playlist.tracks})
            // //    this.setData({trackIds: res.playlist.trackIds})
            // })
            this.getUserLike(this.data.userInfo.userId, this.data.songsInfo.id);
        })
    },

    // 更新已收藏歌单，判断当前歌单是否已收藏
    getUserLike: async function(userId, currentId) {
        const res = await getLikeAlbums(userId);
        this.setData({likeAlbums: res.playlist});
        const playlist = res.playlist;
        // for (let item of playlist) {
        //     console.log(item.id)
        // }
        
        let idx;
        // let idx = playlist.includes(item => item.id == currentId)
        for (let item of playlist) {
            if (item.id === currentId) {
                idx = true;
                break;
            }
        }
        if (idx) {
            this.setData({hasLike: true})
        }
    },

    onReachBottom() {
        if (this.data.tracks.length + this.data.offset > this.data.trackIds.length) return;

        // const newTracks = [];
        const startIdx = this.data.tracks.length;
        // console.log(startIdx);
        for (let i = startIdx; i <= startIdx + this.data.offset; i++) {
            const item = this.data.trackIds[i];
            // console.log(item);
            getSongDetail(item.id).then(res => {
                this.setData({tracks: [...this.data.tracks, res.songs[0]]})
            });
        }
    },

    handlePlayAll() {
        playerStore.setState("songsList", [...this.data.tracks]);
        playerStore.setState("playingSongIdx", 0);
        const id = this.data.tracks[0].id;
        playerStore.dispatch('playMusicWithSongIdAction', {id, type: 0});
    }
})