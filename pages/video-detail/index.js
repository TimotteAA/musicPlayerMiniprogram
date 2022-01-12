// pages/video-detail/index.js
import {getMvDetail, getMvUrl, getRelatedMvs} from "../../service/video"

Page({

    /**
     * 页面的初始数据
     */
    data: {
        mvDetail: {},
        mvUrl: {},
        relatedMvs: []
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
    },
    handleVideoItemClick(event) {
        const id = event.currentTarget.dataset.item.vid;
        // console.log(id);
        wx.navigateTo({
          url: `/pages/video-detail/index?id=${id}`,
        })
    }
})