import StartHubAxios from "../lib/StartHubAxios";
import axios from "axios";
import { getAccToken } from "../util/token";
import { API_URL } from "../util/apiUrl";
import {
    CreateSessionRequest,
    CreateSessionResponse,
    DeleteSessionResponse,
    GetSessionDetailResponse,
    GetSessionsResponse,
    UpdateSessionResponse,
    UpdateSessionTitleRequest,
} from "../type/chatbot/chatbot.type";

export const getSessions = async (): Promise<GetSessionsResponse> =>
    (await StartHubAxios.get('/chatbot/sessions')).data;

export const createSession = async (data: CreateSessionRequest): Promise<CreateSessionResponse> =>
    (await StartHubAxios.post('/chatbot/sessions', data)).data;

export const getSessionDetail = async (sessionId: number): Promise<GetSessionDetailResponse> =>
    (await StartHubAxios.get(`/chatbot/sessions/${sessionId}`)).data;

export const deleteSession = async (sessionId: number): Promise<DeleteSessionResponse> =>
    (await StartHubAxios.delete(`/chatbot/sessions/${sessionId}`)).data;

export const updateSessionTitle = async (sessionId: number, data: UpdateSessionTitleRequest): Promise<UpdateSessionResponse> =>
    (await StartHubAxios.patch(`/chatbot/sessions/${sessionId}`, data)).data;

/**
 * SSE 스트리밍 메시지 전송 - axios 사용
 * onDownloadProgress로 청크 단위 SSE 응답 처리
 */
export const sendMessageStream = (
    sessionId: number,
    message: string,
    onChunk: (text: string) => void,
    onDone: () => void,
    onError: (error: string) => void,
    files?: { uri: string; name: string; type: string }[],
): { cancel: () => void } => {
    const controller = new AbortController();

    const formData = new FormData();
    formData.append('message', message);

    if (files && files.length > 0) {
        files.forEach((file) => {
            formData.append('files', {
                uri: file.uri,
                name: file.name,
                type: file.type,
            } as any);
        });
    }

    let lastIndex = 0;

    (async () => {
        try {
            const token = await getAccToken();
            if (!token) {
                onError('인증이 필요합니다');
                return;
            }

            await axios.post(
                `${API_URL}chatbot/sessions/${sessionId}/messages/stream`,
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'text/event-stream',
                        'Content-Type': 'multipart/form-data',
                    },
                    responseType: 'text',
                    signal: controller.signal,
                    onDownloadProgress: (progressEvent) => {
                        const responseText = progressEvent.event?.target?.responseText ?? '';
                        const newData = responseText.substring(lastIndex);
                        lastIndex = responseText.length;

                        const lines = newData.split('\n');
                        for (const line of lines) {
                            if (line.startsWith('data:')) {
                                const raw = line.slice(5).trim();
                                if (raw === '[DONE]') continue;
                                try {
                                    const parsed = JSON.parse(raw);
                                    if (parsed.type === 'CONTENT_DELTA' && parsed.text) {
                                        onChunk(parsed.text);
                                    }
                                } catch {
                                    // JSON 파싱 실패 시 무시
                                }
                            }
                        }
                    },
                },
            );
            onDone();
        } catch (error) {
            if (!axios.isCancel(error)) {
                onError('메시지 전송에 실패했습니다');
            }
        }
    })();

    return { cancel: () => controller.abort() };
};
