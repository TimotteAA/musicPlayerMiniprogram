import request from "./index"

export function logIn(phone, password) {
    return request.get("/login/cellphone", {
        phone: phone,
        password: password
    })
}

export function getHistorySongs(uid) {
    return request.get("/user/record", {
        uid
    })
}

export function getLikeAlbums(uid) {
    return request.get("/user/playlist", {
        uid
    })
}