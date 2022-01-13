// pages/detail-search/index.js
import {
    getSearchHot,
    getSearchSuggest,
    getSearchResult
} from "../../service/search"

import {LRUCache} from "../../utils/lruCache"

import { debounce } from "../../utils/debounce"

const cache = new LRUCache(20);
// const getSuggests = debounce(getSearchSuggest, 3000, (res) => {
//     console.log(res);
//     return res;
// })

Page({

    /**
     * 页面的初始数据
     */
    data: {
        hotKeywords: [],
        searchSuggest: [],
        searchValue: "",
        suggestNodes: [],
        resultSongs: [],
        historySearch: [],
        hasMore: true,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getPageData();
    },

    onReachBottom() {
        if (this.data.hasMore) {
            getSearchResult(this.data.searchValue, {
                offset: this.data.resultSongs.length
            }).then(res => {
                this.setData({hasMore: res.result.hasMore});
                this.setData({resultSongs: [...this.data.resultSongs, 
                    ...res.result.songs
                ]})
            })
        }
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    // 获取页面数据
    getPageData() {
        getSearchHot().then(res => {
            this.setData({hotKeywords: res.result.hots})
        })
    },

    // 事件处理
    // 搜索項改變的事件處理
    handleChange(e) {
        const searchValue = e.detail;
        this.setData({searchValue: searchValue})
        if (!searchValue.length) {
            // 空字符串，清空原来的关键字
            this.setData({searchValue: ""})
            this.setData({searchSuggest: []})
            this.setData({resultSongs: []})
            // 防抖取消？
            return;
        }

        // 得到搜索建议
        getSearchSuggest(searchValue)
        .then(res => {
            if (!this.data.searchValue.length) return;
            // 獲取搜索關鍵字
            const suggests = res.result.allMatch;
            if (!suggests) return;
            this.setData({searchSuggest: suggests})

            // 對可以keyword做轉換
            const keywords = suggests.map(item => item.keyword);
            // console.log(keywords)
            const suggestNodes = [];
            for (const keyword of keywords) {
                // 找與searchValue匹配的部分
                const nodes = [];
                if (keyword.toLowerCase().startsWith(searchValue)) {
                    const key1 = keyword.slice(0, searchValue.length);
                    const key2 = keyword.slice(searchValue.length);

                    const node1 = {
                        name: "span",
                        attrs: {
                            style: "color: red; font-size: 11px;",
                        },
                        children: [
                            {
                                type: "text",
                                text: key1
                            }
                        ]
                    }
                    nodes.push(node1);
                    const node2 = {
                        name: "span",
                        attrs: {
                            style: "color: black; font-size: 11px;",
                        },
                        children: [
                            {
                                type: "text",
                                text: key2
                            }
                        ]
                    }
                    nodes.push(node2);
                } else {
                    const node3 = {
                        name: "span",
                        attrs: {style: "color: black; font-size: 11px;"},
                        children: [
                            {
                                type: "text",
                                text: keyword
                            }
                        ]
                    }
                    console.log(keyword);
                    nodes.push(node3)
                }                             
                suggestNodes.push(nodes);
            }
            this.setData({suggestNodes})
        })
    },

    handleSearch() {
        // 保持之前的searchValue
        const searchValue = this.data.searchValue;
        cache.setItem(searchValue);
        
        // console.log(this.data.historySearch)
        // this.historySeach.setItem(searchValue);
        getSearchResult(searchValue).then(res => {
            this.setData({resultSongs: res.result.songs})
            const keys = cache.getItems();
            keys.reverse();
            this.setData({historySearch: keys});
        })
    },

    handleItemClick(e) {
        // 獲取到點擊的關鍵字
        // const {index, list} = e.currentTarget.dataset;
        // const keyword = list[index].keyword;
        // console.log(keyword);
        // 設置到searchValue中
        const { keyword } = e.currentTarget.dataset;
        console.log(e.currentTarget.dataset)
        this.setData({searchValue: keyword});

        // 發送網絡請求
        this.handleSearch()
    },

    handleHotItemClick(e) {

        const {item} = e.currentTarget.dataset;
        this.setData({searchValue: item});

        this.handleSearch();
    }
})