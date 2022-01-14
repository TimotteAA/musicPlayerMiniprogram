// app.js
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
  },
  globalData: {
    statusBarHeight: 0,
    screenHeight: 0,
    deviceRatio: 0,
  }
})
