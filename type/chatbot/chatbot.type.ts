export interface ChatSession {
    id: number;
    title: string;
    messageCount: number;
    hasDocuments: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface ChatMessage {
    id: number;
    role: "USER" | "ASSISTANT";
    content: string;
    createdAt: string;
}

export interface ChatDocument {
    id: number;
    fileName: string;
    fileUrl: string;
    fileType: string;
    isImage: boolean;
    createdAt: string;
}

export interface ChatSessionDetail {
    id: number;
    title: string;
    messages: ChatMessage[];
    documents: ChatDocument[];
    createdAt: string;
    updatedAt: string;
}

export interface GetSessionsResponse {
    data: ChatSession[];
    status: string;
    message: string;
    statusCode: number;
}

export interface CreateSessionRequest {
    title: string;
}

export interface UpdateSessionTitleRequest {
    title: string;
}

export interface GetSessionDetailResponse {
    data: ChatSessionDetail;
    status: string;
    message: string;
    statusCode: number;
}

export interface UpdateSessionResponse {
    data: ChatSession;
    status: string;
    message: string;
    statusCode: number;
}

export interface CreateSessionResponse {
    data: ChatSession;
    status: string;
    message: string;
    statusCode: number;
}

export interface DeleteSessionResponse {
    status: string;
    message: string;
    statusCode: number;
}
