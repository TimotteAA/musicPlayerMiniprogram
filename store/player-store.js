import {parseLyric, getCurrentLyric} from "../utils/parse-lyric"
import {getSongDetail, getSongLyric} from "../service/song"
import {HYEventStore} from "hy-event-store"

// 维护歌曲列表，点击歌曲列表后，传入id给播放页
const audioContext = wx.createInnerAudioContext()

const playerStore = new HYEventStore(
    {
        state: {
            isFirstPlaying: true,

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

            // 当前播放歌曲在列表中的索引
            playingSongIdx: 0,
            songsList: [],
        },
        actions: {
            // 请求歌曲数据，播放
            playMusicWithSongIdAction(ctx, {id: id, type, isSameSong}) {
                // 点进当前正在播放的歌曲页面，直接返回
                // console.log(isSameSong);

                if (!isSameSong && Number(id) === Number(ctx.currentSong.id)) {
                    return;
                }
                
                
                if (type === 0 || isSameSong) {
                    // 清空之前歌曲的数据
                    ctx.currentSong = {};
                    ctx.duration = 0;
                    ctx.lyrics = [];
                    ctx.isPlaying = true;
                    ctx.currentPlayTime = 0;
                    ctx.getCurrentLyricIdx = 0;
    

                    // 1. 发送网络请求
                    // console.log(type);
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

                    if (ctx.isFirstPlaying) {
                        // 只监听一次   
                        // 3. 监听歌曲时间的播放
                        this.dispatch("setupAudioContextUpdate")
                        ctx.isFirstPlaying = !ctx.isFirstPlaying;
                    }
                    
                }

            },

            // audioContext的监听
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

                // 监听歌曲播放完成
                audioContext.onEnded(() => {
                    this.dispatch("changeNextPlayingSong")
                })
            },

            changeAudioContextState(ctx, isPlaying) {
                ctx.isPlaying = isPlaying;
                if (ctx.isPlaying) {
                    // 播放，
                    audioContext.play()
                } else {
                    // 暂停
                    audioContext.pause()
                }
            },

            // 切换下一首歌
            changeNextPlayingSong(ctx) {
                // 1.当前索引
                const currentSongIdx = ctx.playingSongIdx;
                // console.log(currentSongIdx)
                // 2. 单曲模式，下一首仍是这首歌
                // 3. 随机播放，随机下一首
                let nextIndex;
                switch (ctx.playMode) {
                    case 0: {
                        // 顺序播放
                        if (currentSongIdx === ctx.songsList.length - 1) {
                            nextIndex = 0;
                        } else {
                            nextIndex = currentSongIdx + 1;
                        }
                        break;
                    }
                    case 1: {
                        // 单曲循环
                        nextIndex = currentSongIdx;
                        break;
                    }
                    case 2: {
                        // 随机播放
                        nextIndex = Math.floor(Math.random() * ctx.songsList.length)
                        break;
                    }
                }

                // 3. 下一首歌曲的信息
                let nextSong = ctx.songsList[nextIndex];
                ctx.playingSongIdx = nextIndex;
                if (!nextSong) {
                    nextSong = ctx.currentSong;
                }
                this.dispatch("playMusicWithSongIdAction", {id: nextSong.id, type: 0, 
                isSameSong: currentSongIdx == nextIndex})
            },

            // // 切换上一首歌
            changePrevPlayingSong(ctx) {
                // 1.当前索引
                const currentSongIdx = ctx.playingSongIdx;
                // console.log(currentSongIdx)
                // 2. 单曲模式，下一首仍是这首歌
                // 3. 随机播放，随机下一首
                let nextIndex;
                switch (ctx.playMode) { 
                    case 0: {
                        // 顺序播放
                        if (currentSongIdx === 0) {
                            nextIndex = ctx.songsList.length - 1;
                        } else {
                            nextIndex = currentSongIdx - 1;
                        }
                        break;
                    }
                    case 1: {
                        // 单曲循环
                        nextIndex = currentSongIdx;
                        break;
                    }
                    case 2: {
                        // 随机播放
                        nextIndex = Math.floor(Math.random() * ctx.songsList.length)
                        break;
                    }
                }

                // 3. 下一首歌曲的信息
                let nextSong = ctx.songsList[nextIndex];
                ctx.playingSongIdx = nextIndex;
                if (!nextSong) {
                    nextSong = ctx.currentSong;
                }
                this.dispatch("playMusicWithSongIdAction", {id: nextSong.id, type: 0})
            }
        } 
    }
)

export {
    audioContext,
    playerStore
}