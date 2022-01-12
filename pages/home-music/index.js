// pages/home-music/index.js
import {getBanners, getSongsList} from "../../service/music"
import {getImageHeight} from "../../utils/query-rect"
import {throttle} from "../../utils/throttle"
import {rankingStore} from "../../store/index"
import {MAPPING_IDX_TO_RANKING_NAME} from "../../utils/constants"

const getData = function(res) {
    return res;
}

const getImageComponentHeight = throttle(getImageHeight, 1500, getData)

Page({
    /**
     * 页面的初始数据
     */
    data: {
        banners: [],
        swiperHeight: 60,
        recommendSongs: {},
        recommendSongsList: [],
        hotSongsList: [],
        rankings: {},
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getPageData();
        
        // 获取页面间的共享数据
        rankingStore.dispatch("getRankingListAction");
        rankingStore.onState("hotRanking", (res) => {
            if (res.tracks) {
                const recommendSongs = res.tracks.slice(0, 6);
               this.setData({recommendSongs: recommendSongs})
           } else {
                return;
           }
        });
        rankingStore.onState("newRanking", this.handleStoreStateChange(0))
        rankingStore.onState("originRanking", this.handleStoreStateChange(2))
        rankingStore.onState("fastRanking", this.handleStoreStateChange(3))
    },
    
    // 發送網絡請求，获取页面数据
    getPageData() {
        getBanners().then(res => {
            this.setData({banners: res.banners})
        }),
        getSongsList().then(res => {
            this.setData({recommendSongsList: res.playlists})
        }),
        getSongsList("全部").then(res => {
            this.setData({hotSongsList: res.playlists})
        })
    },


                      
    // 事件处理
    // 處理搜索
    handleSearchClick() {
        wx.navigateTo({
          url: '/pages/detail-search/index',
        })
    }
    ,
    // 获取的是图片的原始高度
    handleImageLoaded(event) {
        getImageComponentHeight('.swiper-img').then(height => {
            this.setData({swiperHeight: height})
        })
    },
    // 推荐歌曲更多的点击
    handleMoreClick() {
        this.navigateToSongsDetailPage("hotRanking");
    },

    handleRankingClick(event) {
        const {idx} = event.currentTarget.dataset;
        if (idx === "新歌榜") {
            this.navigateToSongsDetailPage("newRanking");
        } else if (idx === "原创榜") {
            this.navigateToSongsDetailPage("originRanking");
        } else if (idx === "飙升榜") {
            this.navigateToSongsDetailPage("fastRanking");
        }
    },

    navigateToSongsDetailPage(name) {
        wx.navigateTo({
            url: `/pages/detail-songs/index?rankingName=${name}&type=ranking`,
        })
    },
    
    // 從store裏拿state
    handleStoreStateChange(idx) {
        // 第一次res为空
        let _this = this;
        return function(res) {
            if (!res.tracks) return;
            // 淺拷貝
            let tracks = [...res.tracks].slice(0, 3);
            let id = res.id;
            let coverImgUrl = res.coverImgUrl;
            let name = res.name;
            let playCount = res.playCount;
            let tmp = {tracks, id, coverImgUrl, name, playCount}
            let key = MAPPING_IDX_TO_RANKING_NAME.get(idx);
            let t = {};
            t[key] = tmp;
            let _t = {..._this.data.rankings, ...t};
            _this.setData({rankings: _t})
        } 
    }
})