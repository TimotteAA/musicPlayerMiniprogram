// app.js
import {getCode} from "./service/login"

App({
  onLaunch() {
    const info = wx.getSystemInfoSync();
    // console.log(info);
    const screenHeight = info.screenHeight;
    const screenWidth = info.screenWidth;
    const deviceRatio = screenHeight / screenWidth;
    this.globalData.statusBarHeight = info.statusBarHeight;
    this.globalData.screenHeight = screenHeight;
    this.globalData.deviceRatio = deviceRatio;

    // // 判断有无token
    // const token = wx.getStorageSync('TOKEN');
    // if (token) return;

    // // 小程序加载完成就进行登录
    // this.loginAction()
  },

  async loginAction() {
      // 获取code
      const code = await getCode()
      
      // 将code发送给服务器

      const token = result.token;
      wx.setStorage("TOKEN", token)
  },

  globalData: {
    statusBarHeight: 0,
    screenHeight: 0,
    deviceRatio: 0,
  }


})
