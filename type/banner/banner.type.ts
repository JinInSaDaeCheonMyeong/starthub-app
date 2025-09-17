import { NoticeType } from "../notice/notice.type"

export interface BannerType {
    item : NoticeType
    index : number
    maxIndex : number,
    height : number
}