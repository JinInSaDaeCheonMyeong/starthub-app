import { Response } from "../util/response.type"

export interface RecruitsItemType {
    id: number;
    title: string;
    companyName: string;
    endDate: string;
    viewCount: number;
    isClosed: boolean;
    createdAt: string;
}

export interface GetRecruitsListResponse extends Response {
    data: {
        totalElements: number;
        totalPages: number;
        pageable: {
        paged: boolean;
        pageNumber: number;
        pageSize: number;
        offset: number;
        sort: {
            sorted: boolean;
            empty: boolean;
            unsorted: boolean;
        };
        unpaged: boolean;
        };
        size: number;
        content: RecruitsItemType[];
        number: number;
        sort: {
        sorted: boolean;
        empty: boolean;
        unsorted: boolean;
        };
        numberOfElements: number;
        first: boolean;
        last: boolean;
        empty: boolean;
    };
}

export interface GetDetailRecruitResponse extends Response {
    data: {
        id: number;
        title: string;
        content: string;
        writerId: number;
        writerNickname: string;
        companyId: number;
        companyName: string;
        startDate: string; 
        endDate: string; 
        desiredCareer: string;
        workType: string;
        jobType: string;
        requiredPeople: number;
        viewCount: number;
        isClosed: boolean;
        techStack: string[];
        createdAt: string; 
        updatedAt: string; 
    };
}
