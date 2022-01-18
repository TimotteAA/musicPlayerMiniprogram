// pages/video-detail/index.js
import {getMvDetail, getMvUrl, getRelatedMvs} from "../../service/video"

Page({

    /**
     * 页面的初始数据
     */
    data: {
        mvDetail: {},
        mvUrl: {},
        relatedMvs: [],
        topHeight: 0,
        headerHeight: 0,
        wrapperHeight: 0,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: async function (options) {
        const {id} = options;
        try {
            // 多次网络请求，Promise.all
            const [res, mv, relatedMvs] = await Promise.all([getMvDetail(`/video/detail?id=${id}`), 
            getMvUrl(`/video/url?id=${id}`), 
            getRelatedMvs(`/related/allvideo?id=${id}`)]);
            // console.log(res, mv, relatedMvs)
            this.setData({mvDetail: res.data});
            this.setData({mvUrl: mv.urls[0].url});
            this.setData({relatedMvs: relatedMvs.data})
        } catch (err) {
            console.log(err);
        }

        this.getHeight(".video-top").then(res => {
            this.setData({topHeight: res})
        });
        this.getHeight(".related-header").then(res => {
            this.setData({headerHeight: res})
        })
        this.getHeight(".wrapper").then(res => {
            this.setData({wrapperHeight: res})
        })
    },

    getHeight(selector) {
        return new Promise((resovle, reject) => {
            let height = 0;
            const query = wx.createSelectorQuery()
            // 绑定感兴趣的组件
            query.select(selector).boundingClientRect()
            // 相对于视口的滚动位置
            // query.selectViewport().scrollOffset()
            query.exec((res) => {
                const rect = res[0];
                height = rect.height;
                resovle(height);
            })
        })
    },

    handleVideoItemClick(event) {
        const id = event.currentTarget.dataset.item.vid;
        // console.log(id);
        wx.navigateTo({
          url: `/pages/video-detail/index?id=${id}`,
        })
    },
})