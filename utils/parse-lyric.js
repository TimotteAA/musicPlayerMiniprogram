const reg = /\[(\d*):(\d*)\.(\d*)\]/;

export function parseLyric(lyricString) {
    // 将每行放到一个对象里
    const res = [];

    const lyricLines = lyricString.split("\n");
    for (let line of lyricLines ) {
        // 对象一个key为时间，另一个为歌词
        const result = line.match(reg);
        // 获取时间
        // let time;
        if (result) {
            const minute = result[1] * 60 * 1000;
            const second = result[2] * 1000;
            const ms = result[3].length === 2 ? result[3] * 10 : result[3] * 1;
            const time = minute + second + ms;   
            // 获取歌词文本
            const text = line.replace(result[0], ""); 
            const obj = {time, text};
            // console.log(result);
            res.push(obj)
        }
    }
    // console.log(res);
    return res;
}

// 第一个比currentTime大的，前一个是当前歌词
export function getCurrentLyric(currentTime, lyrics) {
    let idx = 1;
    for (let i = 0; i < lyrics.length; i++) {
        let item = lyrics[i];
        if (item.time > currentTime) {
            idx = i;
            break;
        }
    }
    return idx >= 1 ? idx - 1 : 0;
}