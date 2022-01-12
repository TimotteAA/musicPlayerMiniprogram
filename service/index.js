const BASE_URL1 = "http://123.207.32.32:9001"
const BASE_URL = "http://139.196.224.17:9000"
class NetworkRequest {
    request(url, method, params) {
        return new Promise((resolve, reject) => {
            wx.request({
              url: url.startsWith("/top/list") || url.startsWith("/playlist/detail/dynamic") ? BASE_URL1 + url : BASE_URL + url,
              method,
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

    get(url, params) {
        return this.request(url, "GET", params)
    }

    post(url, params) {
        return this.request(url, "POST", params)
    }
}

const request = new NetworkRequest()
export default request;