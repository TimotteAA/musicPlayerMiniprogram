const BASE_URL1 = "http://123.207.32.32:9001"
const BASE_URL = "http://139.196.224.17:9000"
class NetworkRequest {
    request(url, method, params, header = {}) {
        return new Promise((resolve, reject) => {
            wx.request({
              url: url.startsWith("/top/list") || url.startsWith("/playlist/detail/dynamic") ? BASE_URL1 + url : BASE_URL + url,
              method,
              header: header,
              data: params,
              success: (res) => {
                  resolve(res.data);
              },
              fail: (err) => {
                  reject(err)
              }
            })
        })
    }

    get(url, params, header) {
        return this.request(url, "GET", params, {
            cookie: wx.getStorageSync('cookie') ? wx.getStorageSync('cookie') : "",
            token: wx.getStorageSync('token') ? wx.getStorageSync('token') : "",
        })
    }

    async get(url, params, header) {
        const res = await this.request(url, "GET", params, {
            cookie: wx.getStorageSync('cookie') ? wx.getStorageSync('cookie') : "",
            token: wx.getStorageSync('token') ? wx.getStorageSync('token') : "",
        })
        if (res.msg === "需要登录") {
            console.log(111);
            wx.removeStorageSync('token')
            wx.removeStorageSync('userInfo')
            wx.removeStorageSync('cookie')
        }
        return Promise.resolve(res);
    }

    post(url, params, header) {
        return this.request(url, "POST", params, header)
    }
}

const request = new NetworkRequest()
export default request;