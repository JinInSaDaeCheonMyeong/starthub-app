import {Response} from "../util/response.type";

export interface BMCType {
    "id": number,
    "title": string,
    "keyPartners": string,
    "keyActivities": string,
    "keyResources": string,
    "valueProposition": string,
    "customerRelationships": string,
    "channels": string,
    "customerSegments": string,
    "costStructure": string,
    "revenueStreams": string,
    "isCompleted": boolean,
    "imageUrl": string,
    "createdAt": string,
    "updatedAt": string,
}

export interface GetBMCsResponse extends Response{
    data : BMCType[];
}

export enum SelectBMCValue {
    keyPartners = "keyPartners",
    keyActivities = "keyActivities",
    keyResources = "keyResources",
    valueProposition = "valueProposition",
    customerRelationships = "customerRelationships",
    channels = "channels",
    customerSegments = "customerSegments",
    costStructure = "costStructure",
    revenueStreams = "revenueStreams",
}

export interface GetBMCResponse extends Response {
    data : BMCType;
}