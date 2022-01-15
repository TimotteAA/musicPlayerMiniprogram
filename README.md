# Bug
1. 视频页，视频会滚动随着页面一起滚动
  - 视频不采用绝对布局，而是直接正常的放在最顶部，下面的视频使用scroll-view进行滚动，并动态设置高度。
2. 真机中歌曲拖拉无法播放 
  - audioContext.seek调用后，再调用audioContext.play()，似乎解决了
3. home-video在部分机型上无法触发onReachBottom回调
  - 解决方法是在最外层的容器上添加在高度：105vw，只要比100vw大应该都可以
