import request from "./index"

export function getSearchHot() {
    return request.get("/search/hot")
}

export function getSearchSuggest(keywords) {
    return request.get(`/search/suggest`, {
        type: "mobile",
        keywords: keywords
    })
}

export function getSearchResult(value) {
    // console.log(value);
    return request.get(`/search`, {keywords: value})
}