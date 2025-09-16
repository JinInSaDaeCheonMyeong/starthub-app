import { NoticeItemType } from "../type/notice/notice.type";
import { NoticeCategory } from "./NoticeCategory";

export const NoticeItemList : NoticeItemType[] = [
    {
        id : 1,
        category : NoticeCategory.BUSINESS,
        title : "string1string1string1string1string1string1string1string1string1string1",
        startTime : new Date(),
        endTime : new Date(),
        location : "전국",
        years : ["10","20"],
        target : "청소년",
        entre : "1년 이내",
        webLink : "https://naver.com"
    },
    {
        id : 2,
        category : NoticeCategory.BUSINESS,
        title : "string2",
        startTime : new Date(),
        endTime : new Date(),
        location : "대구",
        years : ["10","20","30"],
        target : "청소년, 대학",
        entre : "1년 이내",
        webLink : "https://naver.com"
    },
    {
        id : 3,
        category : NoticeCategory.BUSINESS,
        title : "string3",
        startTime : new Date(),
        endTime : new Date(),
        location : "전국",
        years : ["10","20","30","40"],
        target : "청소년",
        entre : "1년 이내",
        webLink : "https://naver.com"
    },
    {
        id : 4,
        category : NoticeCategory.BUSINESS,
        title : "string4",
        startTime : new Date(),
        endTime : new Date(),
        location : "전국",
        years : ["10","20","30","40"],
        target : "청소년",
        entre : "1년 이내",
        webLink : "https://naver.com"
    }
]