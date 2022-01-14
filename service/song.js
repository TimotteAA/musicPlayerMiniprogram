import request from "./index";

export function getSongDetail(id) {
    return request.get("/song/detail", {
        ids: id
    })
}

export function getSongLyric(id) {
    return request.get("/lyric", {id})
}