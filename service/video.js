import request from "./index"

export function getTopMvs(url, params) {
    return request.get(url, params)
}

/**
 * 获取歌曲详情
 * @param {url}url，组合了id的url
 */
export function getMvDetail(url) {
    return request.get(url);
}

/**
 * 获取歌曲url
 * @param {url} url，组合了id的url
 */
export function getMvUrl(url) {
    return request.get(url);
}

/**
 * 获取相近歌曲
 * @param {url} url，组合了id的url
 */
export function getRelatedMvs(url) {
    return request.get(url);
}