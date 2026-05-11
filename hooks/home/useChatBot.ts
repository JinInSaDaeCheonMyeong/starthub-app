import { useState, useCallback, useRef, useEffect } from "react";
import { Alert, AppState, AppStateStatus } from "react-native";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import { pick, types, isErrorWithCode, errorCodes } from "@react-native-documents/picker";
import { ChatSession, ChatMessage } from "../../type/chatbot/chatbot.type";
import { Message, QuestionType, SelectedFile } from "../../type/chatbot/chat.type";
import { getSessions, createSession, getSessionDetail, sendMessageStream } from "../../api/chatbot";
import { ShowToast, ToastType } from "../../util/ShowToast";

const ALLOWED_MIME_TYPES = [
    'image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp',
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

const ALLOWED_EXTENSIONS = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'pdf', 'docx'];
const questionTypePrefix: Record<QuestionType, string> = {
    [QuestionType.NOTICE]: '[[[[공고위주질문입니다]]]]',
    [QuestionType.LAW]: '[[[[법률위주질문입니다]]]]',
    [QuestionType.IDEA]: '[[[[아이디어위주질문입니다]]]]',
};

function isFileAllowed(fileName: string, mimeType?: string): boolean {
    if (mimeType && ALLOWED_MIME_TYPES.includes(mimeType)) return true;
    const ext = fileName.split('.').pop()?.toLowerCase();
    return ext ? ALLOWED_EXTENSIONS.includes(ext) : false;
}

function parseStoredMessage(content: string, isBot: boolean): Pick<Message, "text" | "questionType"> {
    if (isBot) {
        return { text: content };
    }

    const matchedType = Object.values(QuestionType).find((type) => (
        content.startsWith(questionTypePrefix[type])
    ));

    if (!matchedType) {
        return { text: content };
    }

    return {
        text: content.replace(questionTypePrefix[matchedType], "").trimStart(),
        questionType: matchedType,
    };
}

function mapStoredMessages(messages: ChatMessage[]): Message[] {
    return messages.map((msg) => {
        const isBot = msg.role === "ASSISTANT";
        const parsedMessage = parseStoredMessage(msg.content, isBot);

        return {
            id: msg.id.toString(),
            text: parsedMessage.text,
            isBot,
            questionType: parsedMessage.questionType,
        };
    });
}

export default function useChatBot() {
    const [sessions, setSessions] = useState<ChatSession[]>([]);
    const [currentSessionId, setCurrentSessionId] = useState<number | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [selectedQuestionType, setSelectedQuestionType] = useState<QuestionType | null>(null);
    const [selectedFiles, setSelectedFiles] = useState<SelectedFile[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isStreaming, setIsStreaming] = useState(false);
    const streamCancelRef = useRef<(() => void) | null>(null);
    const currentSessionIdRef = useRef<number | null>(null);
    const isStreamingRef = useRef(false);
    const shouldSyncOnActiveRef = useRef(false);
    const suppressStreamErrorRef = useRef(false);
    const appStateRef = useRef<AppStateStatus>(AppState.currentState);
    const messageIdRef = useRef(0);
    const nextId = () => String(++messageIdRef.current);

    useEffect(() => {
        currentSessionIdRef.current = currentSessionId;
    }, [currentSessionId]);

    useEffect(() => {
        isStreamingRef.current = isStreaming;
    }, [isStreaming]);

    useEffect(() => {
        return () => {
            streamCancelRef.current?.();
        };
    }, []);

    const fetchSessions = useCallback(async () => {
        try {
            const res = await getSessions();
            setSessions(res.data);
        } catch {
            // 세션 목록 로딩 실패 시 무시
        }
    }, []);

    const syncCurrentSession = useCallback(async () => {
        const sessionId = currentSessionIdRef.current;
        if (!sessionId) return;

        try {
            const res = await getSessionDetail(sessionId);
            const detail = res.data;
            setCurrentSessionId(detail.id);
            setMessages(mapStoredMessages(detail.messages));
            await fetchSessions();
        } catch {
            ShowToast('', '세션을 다시 불러올 수 없습니다', ToastType.ERROR);
        }
    }, [fetchSessions]);

    useEffect(() => {
        const subscription = AppState.addEventListener('change', (nextAppState) => {
            const previousAppState = appStateRef.current;
            appStateRef.current = nextAppState;

            if (nextAppState !== 'active' && isStreamingRef.current) {
                shouldSyncOnActiveRef.current = true;
                suppressStreamErrorRef.current = true;
                return;
            }

            if (
                nextAppState === 'active' &&
                previousAppState !== 'active' &&
                shouldSyncOnActiveRef.current
            ) {
                shouldSyncOnActiveRef.current = false;
                streamCancelRef.current = null;
                setIsStreaming(false);
                setTimeout(() => {
                    syncCurrentSession();
                    suppressStreamErrorRef.current = false;
                }, 500);
            }
        });

        return () => subscription.remove();
    }, [syncCurrentSession]);

    const loadSession = useCallback(async (sessionId: number) => {
        streamCancelRef.current?.();
        streamCancelRef.current = null;
        setIsStreaming(false);
        try {
            setIsLoading(true);
            const res = await getSessionDetail(sessionId);
            const detail = res.data;
            setCurrentSessionId(detail.id);
            setMessages(mapStoredMessages(detail.messages));
        } catch {
            ShowToast('', '세션을 불러올 수 없습니다', ToastType.ERROR);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const startNewSession = useCallback(() => {
        streamCancelRef.current?.();
        streamCancelRef.current = null;
        setIsStreaming(false);
        setCurrentSessionId(null);
        setMessages([]);
        setSelectedQuestionType(null);
        setSelectedFiles([]);
        setInput("");
    }, []);

    const addFile = useCallback((uri: string, fileName: string, type: string) => {
        if (!isFileAllowed(fileName, type)) {
            Alert.alert(
                '지원하지 않는 파일 형식',
                'PDF, DOCX, 이미지(PNG, JPG, GIF, WEBP)만 첨부할 수 있습니다.',
            );
            return;
        }
        setSelectedFiles(prev => [
            ...prev,
            { id: Date.now(), fileName, uri, type },
        ]);
    }, []);

    const removeFile = useCallback((fileId: number) => {
        setSelectedFiles(prev => prev.filter(f => f.id !== fileId));
    }, []);

    const handlePickCamera = useCallback(() => {
        launchCamera({ mediaType: 'photo', quality: 0.8 }, (res) => {
            if (res.didCancel) return;
            if (res.errorCode) {
                ShowToast('', '카메라를 사용할 수 없습니다', ToastType.ERROR);
                return;
            }
            const asset = res.assets?.[0];
            if (asset?.uri) {
                addFile(asset.uri, asset.fileName ?? `photo_${Date.now()}.jpg`, asset.type ?? 'image/jpeg');
            }
        });
    }, [addFile]);

    const handlePickGallery = useCallback(() => {
        launchImageLibrary({ mediaType: 'photo', quality: 0.8, selectionLimit: 5 }, (res) => {
            if (res.didCancel) return;
            if (res.errorCode) {
                ShowToast('', '갤러리를 사용할 수 없습니다', ToastType.ERROR);
                return;
            }
            res.assets?.forEach(asset => {
                if (asset.uri) {
                    addFile(asset.uri, asset.fileName ?? `image_${Date.now()}.jpg`, asset.type ?? 'image/jpeg');
                }
            });
        });
    }, [addFile]);

    const handlePickDocument = useCallback(async () => {
        try {
            const results = await pick({
                type: [types.pdf, types.docx, types.images],
                allowMultiSelection: true,
            });
            results.forEach(file => {
                if (file.uri) {
                    addFile(file.uri, file.name ?? `file_${Date.now()}`, file.type ?? 'application/octet-stream');
                }
            });
        } catch (err) {
            if (isErrorWithCode(err) && err.code !== errorCodes.IN_PROGRESS && err.code !== errorCodes.OPERATION_CANCELED) {
                ShowToast('', '파일 선택 중 오류가 발생했습니다', ToastType.ERROR);
            }
        }
    }, [addFile]);

    const handleSendMessage = useCallback(async () => {
        const trimmed = input.trim();
        if (!trimmed || isStreaming) return;

        const prefix = selectedQuestionType ? questionTypePrefix[selectedQuestionType] + ' ' : '';
        const messageToSend = prefix + trimmed;

        let sessionId = currentSessionId;
        if (!sessionId) {
            try {
                const res = await createSession({ title: trimmed.slice(0, 30) });
                sessionId = res.data.id;
                if (!sessionId) {
                    ShowToast('', '세션 생성에 실패했습니다', ToastType.ERROR);
                    return;
                }
                setCurrentSessionId(sessionId);
            } catch {
                ShowToast('', '세션 생성에 실패했습니다', ToastType.ERROR);
                return;
            }
        }

        const userMessageId = nextId();
        const botMessageId = nextId();
        const userMessage: Message = {
            id: userMessageId,
            text: trimmed,
            isBot: false,
            questionType: selectedQuestionType,
            attachments: selectedFiles,
        };
        setMessages(prev => [...prev, userMessage]);
        setInput("");
        setSelectedQuestionType(null);
        setIsStreaming(true);

        try {
            const files = selectedFiles.length > 0
                ? selectedFiles.map(f => ({ uri: f.uri, name: f.fileName, type: f.type }))
                : undefined;
            setMessages(prev => [...prev, { id: botMessageId, text: '', isBot: true }]);

            const { cancel } = sendMessageStream(
                sessionId,
                messageToSend,
                (chunk) => {
                    setMessages(prev =>
                        prev.map(msg =>
                            msg.id === botMessageId
                                ? { ...msg, text: msg.text + chunk }
                                : msg
                        )
                    );
                },
                () => {
                    streamCancelRef.current = null;
                    setIsStreaming(false);
                    suppressStreamErrorRef.current = false;
                    setSelectedFiles([]);
                    fetchSessions();
                },
                () => {
                    streamCancelRef.current = null;
                    setIsStreaming(false);
                    if (
                        suppressStreamErrorRef.current ||
                        shouldSyncOnActiveRef.current ||
                        appStateRef.current !== 'active'
                    ) {
                        return;
                    }
                    ShowToast('', '메시지 전송에 실패했습니다', ToastType.ERROR);
                },
                files,
            );
            streamCancelRef.current = cancel;
        } catch {
            ShowToast('', '메시지 전송 중 오류가 발생했습니다', ToastType.ERROR);
            setIsStreaming(false);
        }
    }, [input, isStreaming, currentSessionId, selectedFiles, selectedQuestionType, fetchSessions]);

    return {
        sessions,
        currentSessionId,
        messages,
        input,
        setInput,
        selectedQuestionType,
        setSelectedQuestionType,
        selectedFiles,
        setSelectedFiles,
        isLoading,
        isStreaming,
        fetchSessions,
        loadSession,
        startNewSession,
        handleSendMessage,
        handlePickCamera,
        handlePickGallery,
        handlePickDocument,
        removeFile,
    };
}
