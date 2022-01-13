import request from "./index";

export function getSongDetail(id) {
    return request.get("/song/detail", {
        ids: id
    })
}