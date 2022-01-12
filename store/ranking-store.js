import {HYEventStore} from "hy-event-store";
import {getRanking} from "../service/music"
import {MAPPING_IDX_TO_RANKING_NAME} from "../utils/constants"

const rankingStore = new HYEventStore({
    state: {
        hotRanking: {}, // 熱門榜
        newRanking: {}, // 新歌榜
        originRanking: {}, // 原創榜
        fastRanking: {} // 飆升榜
    },
    actions: {
        getRankingListAction(ctx) {
            // 一個action裏進行多個網絡請求
            for (let i = 0; i <= 3; i++) {
                getRanking(i).then(res => {
                    // console.log(res);
                    ctx[MAPPING_IDX_TO_RANKING_NAME.get(i)] = res.playlist;
                })
            }
        }
    }
})

export default rankingStore;