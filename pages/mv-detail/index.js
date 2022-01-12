// pages/video-detail/index.js
import {getMvDetail, getMvUrl, getRelatedMvs} from "../../service/video"

Page({

    /**
     * 页面的初始数据
     */
    data: {
        mvDetail: null,
        mvUrl: "",
        relatedMvs: [],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: async function (options) {
        const {id} = options;
        try {
            // 多次网络请求，Promise.all
            const [res, mv, relatedMvs] = await Promise.all([getMvDetail(`/mv/detail?mvid=${id}`), 
            getMvUrl(`/mv/url?id=${id}`), 
            getRelatedMvs(`/related/allvideo?id=${id}`)]);
            this.setData({mvDetail: res.data});
            this.setData({mvUrl: mv.data.url});
            this.setData({relatedMvs: relatedMvs.data})
        } catch (err) {
            console.log(err);
        }
    },
    // 点击视频的回调，跳转到視頻详情页
    handleVideoItemClick(event) {
        
        const id = event.currentTarget.dataset.item.vid;
        // console.log(id);
        wx.navigateTo({
          url: `/pages/video-detail/index?id=${id}`,
        })
    }
})