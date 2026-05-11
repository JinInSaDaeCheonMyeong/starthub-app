import { ReactNode, useRef } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { FlashList, FlashListRef } from "@shopify/flash-list";
import { Colors } from "../../../constants/Color";
import { Fonts } from "../../../constants/Fonts";
import { QuestionType, SelectedFile } from "../../../type/chatbot/chat.type";
import PlusIcon from "../../../assets/icons/chat/plus.svg";
import XMarkIcon from "../../../assets/icons/chat/xmark.svg";
import FileIcon from "../../../assets/icons/chat/clip.svg";
import ListEmptyState from "../../ListEmptyState";

type SelectedQuestionConfig = {
    icon: ReactNode;
    text: string;
} | null;

type ChatInputBarProps = {
    input: string;
    setInput: (value: string) => void;
    selectedConfig: SelectedQuestionConfig;
    selectedFiles: SelectedFile[];
    isStreaming: boolean;
    onOpenBottomSheet: () => void;
    onSendMessage: () => void;
    setSelectedQuestionType: (value: QuestionType | null) => void;
    removeFile: (fileId: number) => void;
};

const MIN_INPUT_HEIGHT = 40;
const MIN_CONTEXT_INPUT_HEIGHT = 80;
const MAX_INPUT_HEIGHT = 140;
const INPUT_VERTICAL_PADDING = 11;
const CONTEXT_TOP_PADDING = 40;
const CONTEXT_BOTTOM_PADDING = 11;

export default function ChatInputBar({
    input,
    setInput,
    selectedConfig,
    selectedFiles,
    isStreaming,
    onOpenBottomSheet,
    onSendMessage,
    setSelectedQuestionType,
    removeFile,
}: ChatInputBarProps) {
    const tagListRef = useRef<FlashListRef<any>>(null);
    const hasInputContext = selectedConfig !== null || selectedFiles.length > 0;

    return (
        <View style={styles.inputRow}>
            <TouchableOpacity style={styles.plusButton} onPress={onOpenBottomSheet}>
                <PlusIcon />
            </TouchableOpacity>

            <View style={styles.inputWrapper}>
                <TextInput
                    value={input}
                    onChangeText={setInput}
                    multiline
                    scrollEnabled
                    style={[
                        styles.textInputBase,
                        hasInputContext ? styles.textInputSelect : styles.textInputNotSelect,
                    ]}
                    placeholder="무엇이든 부탁하세요"
                    textAlignVertical="top"
                />

                {input.trim().length > 0 && !isStreaming && (
                    <TouchableOpacity
                        onPress={onSendMessage}
                        style={styles.sendButton}
                    >
                        <Text style={styles.sendButtonText}>↑</Text>
                    </TouchableOpacity>
                )}

                {hasInputContext && (
                    <View style={styles.tagListContainer}>
                        <FlashList
                            style={styles.tagList}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            ref={tagListRef}
                            contentContainerStyle={styles.tagListContent}
                            data={selectedFiles}
                            keyExtractor={(item) => item.id.toString()}
                            ListEmptyComponent={
                                selectedConfig ? null : (
                                    <ListEmptyState
                                        message="첨부 항목이 없습니다."
                                        style={styles.tagEmptyState}
                                        textStyle={styles.tagEmptyText}
                                    />
                                )
                            }
                            ListHeaderComponent={() =>
                                selectedConfig ? (
                                    <TouchableOpacity
                                        style={styles.tagChip}
                                        onPress={() => setSelectedQuestionType(null)}
                                    >
                                        {selectedConfig.icon}
                                        <Text style={styles.tagChipText}>{selectedConfig.text}</Text>
                                        <XMarkIcon height={14} />
                                    </TouchableOpacity>
                                ) : null
                            }
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.tagChip}
                                    onPress={() => removeFile(item.id)}
                                >
                                    <FileIcon width={12} height={12} />
                                    <Text style={[styles.tagChipText, styles.fileNameText]} numberOfLines={1}>
                                        {item.fileName}
                                    </Text>
                                    <XMarkIcon height={14} />
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    inputRow: {
        flexDirection: "row",
        alignItems: "flex-end",
        paddingHorizontal: 15,
        paddingVertical: 8,
    },
    plusButton: {
        width: 40,
        height: 40,
        backgroundColor: Colors.white1,
        borderColor: Colors.gray3,
        borderWidth: 1,
        borderRadius: 200,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 10,
    },
    inputWrapper: {
        flex: 1,
        position: "relative",
    },
    textInputBase: {
        borderWidth: 1,
        backgroundColor: Colors.white1,
        borderColor: Colors.gray3,
        paddingHorizontal: 14,
        paddingRight: 45,
        fontFamily: Fonts.reqular,
        fontSize: 14,
        color: Colors.black1,
        lineHeight: 20,
        maxHeight: MAX_INPUT_HEIGHT,
    },
    textInputNotSelect: {
        minHeight: MIN_INPUT_HEIGHT,
        borderRadius: 20,
        paddingTop: INPUT_VERTICAL_PADDING,
        paddingBottom: INPUT_VERTICAL_PADDING,
    },
    textInputSelect: {
        minHeight: MIN_CONTEXT_INPUT_HEIGHT,
        borderRadius: 15,
        paddingTop: CONTEXT_TOP_PADDING,
        paddingBottom: CONTEXT_BOTTOM_PADDING,
    },
    sendButton: {
        position: "absolute",
        right: 5,
        bottom: 7,
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: "#4A7DFF",
        alignItems: "center",
        justifyContent: "center",
    },
    sendButtonText: {
        color: "white",
        fontSize: 12,
    },
    tagListContainer: {
        backgroundColor: Colors.black1,
        top: 13,
        left: 1,
        height: 26,
        width: "91%",
        position: "absolute",
    },
    tagList: {
        height: 26,
        backgroundColor: Colors.white1,
    },
    tagListContent: {
        paddingHorizontal: 16,
    },
    tagEmptyState: {
        minHeight: 26,
        minWidth: 120,
    },
    tagEmptyText: {
        fontSize: 12,
    },
    tagChip: {
        height: 26,
        borderRadius: 20,
        backgroundColor: "#DFE9FF",
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 6,
        paddingVertical: 6,
        marginRight: 6,
    },
    tagChipText: {
        fontSize: 12,
        fontFamily: Fonts.semiBold,
        color: "#12398F",
        marginEnd: 6,
    },
    fileNameText: {
        maxWidth: 100,
    },
});
