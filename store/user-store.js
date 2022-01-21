import {HYEventStore} from "hy-event-store"


const userStore = new HYEventStore(
    {
        state: {
            likeAlbums: [],
            historySongs: [],    
        },
        actions: {
            addLikeAlbumsAction(ctx, likeAlbums) {
                ctx.likeAlbums = likeAlbums;
            },
            addhistorySongsAction(ctx, historySongs) {
                ctx.historySongs = historySongs
            }
        }
    }
)

export {
    userStore
}