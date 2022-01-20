export function getCode() {
    return new Promise((resolve, reject) => {
        wx.login({
            timeout: 1000,
            success: res => {
              // 获取code
              const code = res.code;
              resolve(code);
            },
            fail: err => {
              reject(err)
            }
          })
    }) 
}

class Login {
  constructor(BASE_URL) {
    this.BASE_URL = BASE_URL
  }

    request(url, method, params) {
        return new Promise((resovle, reject) => {
          wx.login({
            url: this.BASE_URL + url,
            method: method,
            data: params
          })
        })
    }

    codeToToken(code) {
      return this.request(url, "POST", {code});
    }
}