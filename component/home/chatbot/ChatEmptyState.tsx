import { useRef } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { FlashList, FlashListRef } from "@shopify/flash-list";
import { Fonts } from "../../../constants/Fonts";
import { Colors } from "../../../constants/Color";
import { QuestionType, questionTypeBlockItems } from "../../../type/chatbot/chat.type";
import LeafIcon from "../../../assets/icons/chat/leaf.svg";
import ListEmptyState from "../../ListEmptyState";

type ChatEmptyStateProps = {
    username?: string;
    selectedQuestionType: QuestionType | null;
    setSelectedQuestionType: (value: QuestionType | null) => void;
};

export default function ChatEmptyState({
    username,
    selectedQuestionType,
    setSelectedQuestionType,
}: ChatEmptyStateProps) {
    const questionTypeListRef = useRef<FlashListRef<any>>(null);

    return (
        <View style={styles.container}>
            <LeafIcon height={52} width={60} style={styles.leafIcon} />
            <Text style={styles.title}>
                {username}님!{"\n"}
                무엇을 도와드릴까요?
            </Text>
            {selectedQuestionType === null && (
                <FlashList
                    ref={questionTypeListRef}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    data={questionTypeBlockItems}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={
                        <ListEmptyState
                            message="선택 가능한 질문 항목이 없습니다."
                            style={styles.questionEmptyState}
                            textStyle={styles.questionEmptyText}
                        />
                    }
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => setSelectedQuestionType(item.value)}>
                            <View style={styles.questionTypeBlock}>
                                <View style={styles.iconWrapper}>{item.icon}</View>
                                <View>
                                    <Text style={styles.questionTypeTitle}>{item.title} 물어보기</Text>
                                    <Text style={styles.questionTypeExample}>ex. {item.example}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    )}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "flex-end",
    },
    leafIcon: {
        marginBottom: 5,
        paddingStart: 88,
    },
    title: {
        fontSize: 32,
        fontFamily: Fonts.reqular,
        marginBottom: 20,
        paddingHorizontal: 16,
    },
    listContent: {
        padding: 16,
    },
    questionEmptyState: {
        minHeight: 60,
    },
    questionEmptyText: {
        fontSize: 14,
    },
    questionTypeBlock: {
        height: 60,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#DDE7FD",
        flexDirection: "row",
        borderRadius: 20,
        paddingHorizontal: 13,
        paddingVertical: 14,
        marginRight: 10,
    },
    iconWrapper: {
        paddingRight: 10,
    },
    questionTypeTitle: {
        fontFamily: Fonts.semiBold,
        fontSize: 14,
        color: "#12398F",
    },
    questionTypeExample: {
        fontFamily: Fonts.reqular,
        fontSize: 11,
        color: Colors.black1,
    },
});
