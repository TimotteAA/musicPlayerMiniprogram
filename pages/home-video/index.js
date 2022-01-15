// pages/home-video/index.js

import {getTopMvs} from "../../service/video"

Page({

    /**
     * 页面的初始数据
     */
    data: {
        topMvs: [],
        hasMore: true,
    },

    /**
     * 生命周期函数--监听页面加载
     * 每次加载
     */
    onLoad: async function (options) {
        try {
            const res = await getTopMvs("/top/mv", {limit: 10, offset: 0});
            this.setData({topMvs: res.data})
        } catch (err) {
            console.log(err);
        }
    },

    // 上拉刷新的生命周期
    onPullDownRefresh: async function() {
        // 请求到最新的10条，覆盖原来的
        // 同时hasMore也设置成true
        try {
            // 展示加载动画
            wx.showNavigationBarLoading()
   
            const res = await getTopMvs("/top/mv", {limit: 10, offset: 0});
            this.setData({topMvs: res.data})
            this.setData({hasMore: true})
            wx.hideNavigationBarLoading()
            wx.stopPullDownRefresh()
        } catch (err) {
            console.log(err);
        }
    },

    // 到达底部的生命周期
    onReachBottom: async function() {
        console.log(111);
        // 用已有数量作为偏移offset
        // 后端API有限制: hasMore为false时，就没了
        // console.log(111);
        if (!this.data.hasMore) return;
        try {
            // wx.startPullDownRefresh(); //相当于用户主动触发下拉刷新
            // 疯狂递归触发自己
            const res = await getTopMvs("/top/mv", 
            {limit: 10, 
             offset: this.data.topMvs.length});
            //  console.log(res);
             this.setData({hasMore: res.hasMore});
             this.setData({topMvs: [...this.data.topMvs, ...res.data]});
           
        } catch (err) {
            console.log(err)
        }
    },

    // 上为页面的生命周期，下面自己定义的回调

    // 点击视频的回调，跳转到详情页
    handleVideoItemClick(event) {
        const id = event.currentTarget.dataset.item.id;
        wx.navigateTo({
          url: `/pages/mv-detail/index?id=${id}`,
        })
    }
})