import request from "./index"

export function getBanners() {
    return request.get("/banner?type=2");
}

// 獲取榜單數據
export function getRanking(idx) {
    return request.get("/top/list?idx=" + idx);
    // return request.get("http://123.207.32.32:9001/playlist/detail?id=" + idx)
}

export function getSongsList(cat="日语", limit=6, offset=0) {
    return request.get(`/top/playlist?cat=${cat}&limit=${limit}&offset=${offset}`)
}

export function getSongsDetail(id) {
    return request.get(`/playlist/detail/dynamic?id=${id}`)
}