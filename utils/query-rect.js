export function getImageHeight (selector) {
    return new Promise((resolve, reject) => {
        // 如何获取组件的高度
        const query = wx.createSelectorQuery()
        // 绑定感兴趣的组件
        query.select('.swiper-img').boundingClientRect()
        // 相对于视口的滚动位置
        // query.selectViewport().scrollOffset()
        query.exec((res) => {
            const rect = res[0];
           resolve(rect.height);
        })
    }) 
}