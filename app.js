// app.js
App({
  onLaunch() {
    const info = wx.getSystemInfoSync();
    console.log(info);
    const screenHeight = info.screenHeight;
    console.log(screenHeight)
    this.globalData.statusBarHeight = info.statusBarHeight;
    this.globalData.screenHeight = screenHeight;
  },
  globalData: {
    statusBarHeight: 0,
    screenHeight: 0,
  }
})
