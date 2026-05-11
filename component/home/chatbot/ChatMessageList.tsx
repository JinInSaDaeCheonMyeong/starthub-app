import { useEffect, useRef } from "react";
import { NativeScrollEvent, NativeSyntheticEvent, StyleSheet, Text, View } from "react-native";
import { FlashList, FlashListRef } from "@shopify/flash-list";
import Markdown from "react-native-markdown-display";
import { Colors } from "../../../constants/Color";
import { Fonts } from "../../../constants/Fonts";
import { Message, questionTypeConfig } from "../../../type/chatbot/chat.type";
import { parseMessageSegments } from "../../../util/chatbotMessageParser";
import ChatTokenCard from "./ChatTokenCard";
import ListEmptyState from "../../ListEmptyState";
import AITypingIndicator from "./AITypingIndicator";
import FileIcon from "../../../assets/icons/chat/clip.svg";

type ChatMessageListProps = {
    messages: Message[];
    isStreaming: boolean;
    onAnnouncementPress: (id: number, url?: string) => void;
    onAnalysisPress: (id: number) => void;
    onBMCPress: (id: number) => void;
};

function getTokenLabel(tokenType: "announcement" | "analysis" | "bmc") {
    if (tokenType === "announcement") return "공고";
    if (tokenType === "analysis") return "경쟁사 분석";
    return "BMC";
}

function getAttachmentLabel(type: string) {
    return type.startsWith("image/") ? "이미지" : "파일";
}

const AUTO_SCROLL_THRESHOLD = 12;

export default function ChatMessageList({
    messages,
    isStreaming,
    onAnnouncementPress,
    onAnalysisPress,
    onBMCPress,
}: ChatMessageListProps) {
    const messagesListRef = useRef<FlashListRef<any>>(null);
    const isNearBottomRef = useRef(true);
    const previousMessageCountRef = useRef(messages.length);

    const scrollToEnd = (animated = true) => {
        requestAnimationFrame(() => {
            messagesListRef.current?.scrollToEnd({ animated });
        });
    };

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
        const distanceFromBottom = contentSize.height - (contentOffset.y + layoutMeasurement.height);
        isNearBottomRef.current = distanceFromBottom <= AUTO_SCROLL_THRESHOLD;
    };

    useEffect(() => {
        if (messages.length > previousMessageCountRef.current && isNearBottomRef.current) {
            scrollToEnd();
        }
        previousMessageCountRef.current = messages.length;
    }, [messages.length]);

    return (
        <FlashList
            ref={messagesListRef}
            style={styles.list}
            data={messages}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            onContentSizeChange={() => {
                if (isNearBottomRef.current) {
                    scrollToEnd();
                }
            }}
            ListEmptyComponent={
                <ListEmptyState
                    message="채팅 항목이 없습니다."
                    style={styles.emptyState}
                />
            }
            renderItem={({ item }: { item: Message }) => (
                <View style={{ alignItems: item.isBot ? "flex-start" : "flex-end" }}>
                    {!item.isBot && item.questionType && questionTypeConfig[item.questionType] && (
                        <View style={styles.questionTypeBadge}>
                            {questionTypeConfig[item.questionType].icon}
                            <Text style={styles.questionTypeBadgeText}>
                                {questionTypeConfig[item.questionType].text}
                            </Text>
                        </View>
                    )}
                    <View style={[styles.messageBubble, item.isBot ? styles.botBubble : styles.userBubble]}>
                        {item.isBot && item.text === "" && isStreaming ? (
                            <AITypingIndicator />
                        ) : item.isBot ? (
                            parseMessageSegments(item.text).map((seg, idx) =>
                                seg.type === "token" ? (
                                    <ChatTokenCard
                                        key={idx}
                                        title={seg.title}
                                        label={getTokenLabel(seg.tokenType)}
                                        onPress={() => {
                                            if (seg.tokenType === "announcement") {
                                                onAnnouncementPress(seg.id, seg.url);
                                                return;
                                            }
                                            if (seg.tokenType === "analysis") {
                                                onAnalysisPress(seg.id);
                                                return;
                                            }
                                            onBMCPress(seg.id);
                                        }}
                                    />
                                ) : seg.content.trim() ? (
                                    <Markdown key={idx} style={markdownStyles}>{seg.content}</Markdown>
                                ) : null
                            )
                        ) : (
                            <>
                                {item.attachments && item.attachments.length > 0 && (
                                    <View style={styles.attachmentTagList}>
                                        {item.attachments.map((file) => (
                                            <View key={file.id} style={styles.attachmentTag}>
                                                <FileIcon width={12} height={12} color="#12398F" />
                                                <Text style={styles.attachmentTagText} numberOfLines={1}>
                                                    {`${getAttachmentLabel(file.type)} · ${file.fileName}`}
                                                </Text>
                                            </View>
                                        ))}
                                    </View>
                                )}
                                <Text>{item.text}</Text>
                            </>
                        )}
                    </View>
                </View>
            )}
        />
    );
}

const styles = StyleSheet.create({
    list: {
        flex: 1,
    },
    listContent: {
        padding: 16,
    },
    emptyState: {
        minHeight: 240,
    },
    messageBubble: {
        maxWidth: "90%",
        padding: 12,
        borderRadius: 20,
        marginVertical: 6,
    },
    botBubble: {
        alignSelf: "flex-start",
    },
    userBubble: {
        alignSelf: "flex-end",
        backgroundColor: "#C0D4FD",
    },
    questionTypeBadge: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#DDE7FD",
        borderRadius: 12,
        paddingHorizontal: 8,
        paddingVertical: 4,
        marginBottom: 4,
        gap: 4,
    },
    questionTypeBadgeText: {
        fontSize: 11,
        fontFamily: Fonts.semiBold,
        color: "#12398F",
    },
    attachmentTagList: {
        gap: 6,
        marginBottom: 8,
    },
    attachmentTag: {
        maxWidth: 220,
        alignSelf: "flex-end",
        borderRadius: 20,
        backgroundColor: "#DFE9FF",
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 8,
        paddingVertical: 6,
        gap: 6,
    },
    attachmentTagText: {
        flexShrink: 1,
        fontSize: 12,
        fontFamily: Fonts.semiBold,
        color: "#12398F",
    },
});

const markdownStyles = StyleSheet.create({
    body: {
        color: Colors.black1,
        fontFamily: Fonts.reqular,
        fontSize: 14,
        lineHeight: 21,
    },
    heading1: {
        color: Colors.black1,
        fontFamily: Fonts.bold,
        fontSize: 20,
        lineHeight: 28,
        marginTop: 14,
        marginBottom: 10,
    },
    heading2: {
        color: Colors.black1,
        fontFamily: Fonts.semiBold,
        fontSize: 18,
        lineHeight: 25,
        marginTop: 12,
        marginBottom: 8,
    },
    heading3: {
        color: Colors.black1,
        fontFamily: Fonts.semiBold,
        fontSize: 16,
        lineHeight: 23,
        marginTop: 10,
        marginBottom: 6,
    },
    paragraph: {
        marginTop: 0,
        marginBottom: 8,
        lineHeight: 21,
    },
    bullet_list: {
        marginTop: 2,
        marginBottom: 10,
    },
    ordered_list: {
        marginTop: 2,
        marginBottom: 10,
    },
    list_item: {
        marginBottom: 5,
    },
    code_inline: {
        backgroundColor: Colors.white2,
        borderRadius: 4,
        paddingHorizontal: 4,
        paddingVertical: 2,
        fontFamily: Fonts.medium,
    },
    fence: {
        backgroundColor: Colors.white2,
        borderRadius: 8,
        padding: 10,
        marginTop: 6,
        marginBottom: 10,
    },
});
