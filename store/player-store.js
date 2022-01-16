import {parseLyric, getCurrentLyric} from "../utils/parse-lyric"
import {getSongDetail, getSongLyric} from "../service/song"
import {HYEventStore} from "hy-event-store"

// 维护歌曲列表，点击歌曲列表后，传入id给播放页
const audioContext = wx.createInnerAudioContext()

const playerStore = new HYEventStore(
    {
        state: {
            currentSong: {},
            duration: 0,
            lyrics: [],
            id: null,
            currentPlayTime: 0,
            currentLyricIdx: 0,

            // 记录播放模式：0是顺序、1是单曲循环、2是随机播放
            playMode: 0,

            // 歌词播放与暂停
            isPlaying: false,

            // 播放列表
        },
        actions: {
            // 请求歌曲数据，播放
            playMusicWithSongIdAction(ctx, {id: id}) {
                // 1. 发送网络请求
                getSongDetail(id).then(res => {
                    ctx.id = id;
                    ctx.currentSong = res.songs[0];
                    ctx.duration = res.songs[0].dt
                })
                getSongLyric(id).then(res => {
                    const lyricString = res.lrc.lyric
                    const lyrics = parseLyric(lyricString);
                    ctx.lyrics = lyrics;
                })

                // 2. 播放歌曲，在别的页面也能切换歌曲，dispatch这个方法就行了
                audioContext.stop();
                // 实际播放器的实例，先下载、再编解码
                audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`;
                audioContext.autoplay = true;
                ctx.isPlaying = true;

                // 3. 监听歌曲时间的播放
                this.dispatch("setupAudioContextUpdate")
            },

            setupAudioContextUpdate(ctx) {
                // // 快进后也能继续播放
                audioContext.onCanplay(() => {
                    audioContext.play();
                })

                // 监听时间更新，求进度条值、歌词
                audioContext.onTimeUpdate(() => {
                    // 修改当前时间与进度条位置
                    const currentTime = audioContext.currentTime
                    ctx.currentPlayTime = currentTime * 1000;
                    // currentTime的单位是秒
                    const idx = getCurrentLyric(currentTime * 1000, ctx.lyrics)
                    // console.log(currentLyricIdx)
                    // 防止重复打印，只有新的值与已有歌词不一样，才设置
                    ctx.currentLyricIdx = idx
                })
            },

            changeAudioContextState(ctx) {
                ctx.isPlaying = !ctx.isPlaying;
                if (ctx.isPlaying) {
                    // 播放，
                    audioContext.play()
                } else {
                    // 暂停
                    audioContext.pause()
                }
            }
        } 
    }
)

export {
    audioContext,
    playerStore
}