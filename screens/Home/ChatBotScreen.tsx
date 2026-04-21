import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ImageBackground,
    KeyboardAvoidingView,
    Platform,
    TextInput,
    ActivityIndicator,
    Keyboard,
    Linking,
} from "react-native";
import { useCallback, useMemo, useRef } from "react";
import { Colors } from "../../constants/Color";
import { Fonts } from "../../constants/Fonts";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation/RootStack";
import { DefaultImage } from "../../constants/AppImages";
import { Drawer } from "react-native-drawer-layout";
import { FlashList, FlashListRef } from "@shopify/flash-list";
import { Markdown } from "react-native-remark";
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from "@gorhom/bottom-sheet";

import SubHeaderBar from "../../component/home/SubHeaderBar";
import ChatBotSideBar from "../../component/home/ChatBotSideBar";
import InputModal from "../../component/home/InputModal";
import StartupStatus from "../../constants/StartupStatus";

import useChatBot from "../../hooks/home/useChatBot";
import useSideBar from "../../hooks/home/useSideBar";
import { questionTypeBlockItems, questionTypeConfig, Message } from "../../type/chatbot/chat.type";
import { getNotice } from "../../api/notice";
import { parseReceptionPeriod } from "../../util/DateFormat";
import { getBMC } from "../../api/bmc";
import { getCompetitors } from "../../api/competitor";
import { ShowToast, ToastType } from "../../util/ShowToast";

import MenuIcon from "../../assets/icons/header/menu.svg";
import PlusIcon from "../../assets/icons/chat/plus.svg";
import LeafIcon from "../../assets/icons/chat/leaf.svg";
import XMarkIcon from "../../assets/icons/chat/xmark.svg";
import CameraIcon from "../../assets/icons/chat/camera.svg";
import GalleryIcon from "../../assets/icons/chat/picture.svg";
import FileIcon from "../../assets/icons/chat/clip.svg";

const backgroundImage = DefaultImage.background;

// [[ANNOUNCEMENT:id:title:url]], [[SCHEDULE:id:title:T:url]], [[ANALYSIS:id:title]], [[BMC:id:title]] 토큰 파싱
// 공백/줄바꿈이 섞인 응답도 파싱되도록 허용
const CHATBOT_TOKEN_REGEX = /\[\[\s*(ANNOUNCEMENT|SCHEDULE|ANALYSIS|BMC)\s*:\s*(\d+)\s*:\s*([\s\S]*?)\]\]/g;

function parseTokenPayload(payload: string): { title: string; url?: string } {
    const markerMatch = payload.match(/[\s\n]+(?:T|URL)\s*:\s*(https?:\/\/[\s\S]+)$/i);
    if (markerMatch) {
        return {
            title: payload.slice(0, markerMatch.index).replace(/\s+/g, ' ').trim(),
            url: markerMatch[1].replace(/\s+/g, ''),
        };
    }

    const urlStartIndex = payload.search(/:\s*https?:\/\//i);
    if (urlStartIndex >= 0) {
        return {
            title: payload.slice(0, urlStartIndex).replace(/\s+/g, ' ').trim(),
            url: payload.slice(urlStartIndex + 1).replace(/\s+/g, ''),
        };
    }

    return { title: payload.replace(/\s+/g, ' ').trim() };
}

type TextSegment = { type: 'text'; content: string };
type TokenSegment = {
    type: 'token';
    tokenType: 'announcement' | 'analysis' | 'bmc';
    id: number;
    title: string;
    url?: string;
};
type MessageSegment = TextSegment | TokenSegment;

function parseMessageSegments(text: string): MessageSegment[] {
    const segments: MessageSegment[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;
    const regex = new RegExp(CHATBOT_TOKEN_REGEX.source, 'g');
    while ((match = regex.exec(text)) !== null) {
        if (match.index > lastIndex) {
            segments.push({ type: 'text', content: text.slice(lastIndex, match.index) });
        }
        const rawType = match[1];
        const id = parseInt(match[2], 10);
        const payload = match[3];
        if (rawType === 'ANNOUNCEMENT' || rawType === 'SCHEDULE') {
            const { title, url } = parseTokenPayload(payload);
            segments.push({
                type: 'token',
                tokenType: 'announcement',
                id,
                title,
                url,
            });
        } else if (rawType === 'ANALYSIS') {
            segments.push({ type: 'token', tokenType: 'analysis', id, title: payload.replace(/\s+/g, ' ').trim() });
        } else {
            segments.push({ type: 'token', tokenType: 'bmc', id, title: payload.replace(/\s+/g, ' ').trim() });
        }
        lastIndex = match.index + match[0].length;
    }
    if (lastIndex < text.length) {
        segments.push({ type: 'text', content: text.slice(lastIndex) });
    }
    return segments;
}

function ChatTokenCard({
    title,
    label,
    onPress,
}: {
    title: string;
    label: string;
    onPress: () => void;
}) {
    return (
        <TouchableOpacity style={announcementCardStyles.card} onPress={onPress} activeOpacity={0.75}>
            <View style={announcementCardStyles.badge}>
                <Text style={announcementCardStyles.badgeText}>{label}</Text>
            </View>
            <Text style={announcementCardStyles.title} numberOfLines={2}>{title}</Text>
            <Text style={announcementCardStyles.link}>자세히 보기 →</Text>
        </TouchableOpacity>
    );
}

const announcementCardStyles = StyleSheet.create({
    card: {
        marginTop: 6,
        backgroundColor: '#EDF2FF',
        borderRadius: 10,
        padding: 10,
        borderLeftWidth: 2,
        borderLeftColor: '#4A7DFF',
    },
    badge: {
        alignSelf: 'flex-start',
        backgroundColor: '#4A7DFF',
        borderRadius: 5,
        paddingHorizontal: 5,
        paddingVertical: 1,
        marginBottom: 4,
    },
    badgeText: {
        color: '#fff',
        fontSize: 9,
        fontWeight: '600',
    },
    title: {
        fontSize: 12,
        fontWeight: '600',
        color: '#1a1a1a',
        marginBottom: 4,
    },
    link: {
        fontSize: 11,
        color: '#4A7DFF',
    },
});

export type ChatBotScreenProps = StackScreenProps<RootStackParamList, "ChatBot">;

export default function ChatBotScreen({ navigation }: ChatBotScreenProps) {
    const insets = useSafeAreaInsets();

    const sidebar = useSideBar(navigation);
    const chat = useChatBot();

    const messagesListRef = useRef<FlashListRef<any>>(null);
    const questionTypeListRef = useRef<FlashListRef<any>>(null);
    const tagListRef = useRef<FlashListRef<any>>(null);
    const bottomSheetRef = useRef<BottomSheet>(null);

    const handleAnnouncementPress = useCallback(async (id: number, url?: string) => {
        try {
            const res = await getNotice(id);
            const raw = res.data;
            const { startDate, endDate } = parseReceptionPeriod(raw.receptionPeriod);
            navigation.navigate('InNotice', { Notice: { ...raw, startDate, endDate } });
        } catch {
            if (url) {
                try {
                    const canOpen = await Linking.canOpenURL(url);
                    if (canOpen) {
                        await Linking.openURL(url);
                        return;
                    }
                } catch {}
            }
            ShowToast('', '공고를 불러올 수 없습니다', ToastType.ERROR);
        }
    }, [navigation]);

    const snapPoints = useMemo(() => ['25%'], []);

    const handleOpenBottomSheet = useCallback(() => {
        Keyboard.dismiss();
        bottomSheetRef.current?.expand();
    }, []);

    const renderBackdrop = useCallback(
        (props: any) => (
            <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />
        ),
        []
    );

    const selectedConfig =
        chat.selectedQuestionType !== null
            ? questionTypeConfig[chat.selectedQuestionType]
            : null;

    const handleBMCPress = useCallback(async (id: number) => {
        try {
            const res = await getBMC(id);
            navigation.navigate('InBMC', { BMC: res.data });
        } catch {
            ShowToast('', 'BMC를 불러올 수 없습니다', ToastType.ERROR);
        }
    }, [navigation]);

    const handleAnalysisPress = useCallback(async (id: number) => {
        try {
            const competitors = (await getCompetitors()).data;
            const target = competitors.find((value) => value.bmcId === id);
            if (!target) {
                ShowToast('', '경쟁사 분석 결과를 찾을 수 없습니다', ToastType.ERROR);
                return;
            }
            const bmc = (await getBMC(id)).data;
            (navigation as any).navigate('Competitor', {
                screen: 'Result',
                params: {
                    bmcId: id,
                    image: { uri: bmc.imageUrl, cache: 'force-cache' },
                    data: target,
                },
            });
        } catch {
            ShowToast('', '경쟁사 분석 결과를 불러올 수 없습니다', ToastType.ERROR);
        }
    }, [navigation]);

    useFocusEffect(
        useCallback(() => {
            sidebar.fetchProfile();
            chat.fetchSessions();
        }, [])
    );

    const drawerStartupStatus =
        sidebar.profileData?.startupStatus === StartupStatus.EARLY_STAGE
            ? StartupStatus.EARLY_STAGE
            : StartupStatus.PRE_STARTUP;

    return (
            <ImageBackground source={backgroundImage} style={{ flex: 1 }}>
                <View style={{ paddingTop: insets.top, paddingBottom: insets.bottom, flex: 1 }}>
                    <Drawer
                        open={sidebar.drawerOpen}
                        onClose={() => sidebar.setDrawerOpen(false)}
                        onOpen={() => sidebar.setDrawerOpen(true)}
                        renderDrawerContent={() => (
                            <ChatBotSideBar
                                username={sidebar.profileData?.username ?? '찾을 수 없는 유저'}
                                startupStatus={drawerStartupStatus}
                                navigation={navigation}
                                sessions={chat.sessions}
                                onXmarkPress={() => sidebar.setDrawerOpen(false)}
                                handleDeleteUser={() => sidebar.handleOpenModal('Delete')}
                                handleSignOut={() => sidebar.handleOpenModal('SignOut')}
                                onNewChat={chat.startNewSession}
                                onSelectSession={chat.loadSession}
                            />
                        )}
                        drawerPosition="left"
                        drawerType="front"
                        drawerStyle={{ width: 303, backgroundColor: "white" }}
                        overlayStyle={{ backgroundColor: "rgba(0,0,0,0.5)" }}
                        swipeEnabled={true}
                        swipeEdgeWidth={50}
                    >
                        <SubHeaderBar
                            title="Hub AI 챗봇"
                            leftIcon={
                                <TouchableOpacity onPress={() => sidebar.setDrawerOpen(true)} hitSlop={16}>
                                    <MenuIcon width={24} height={24} color={Colors.gray1} />
                                </TouchableOpacity>
                            }
                            subIcon={
                                <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={16}>
                                    <Text style={styles.closeButton}>✕</Text>
                                </TouchableOpacity>
                            }
                        />

                    <View style={styles.container}>
                        <KeyboardAvoidingView
                            style={{ flex: 1 }}
                            behavior={Platform.OS === "ios" ? "padding" : undefined}
                            keyboardVerticalOffset={insets.top + 70}
                        >
                            {chat.messages.length === 0 ? (
                                <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                                    <LeafIcon height={52} width={60} style={{ marginBottom: 5, paddingStart: 88 }} />
                                    <Text style={{ fontSize: 32, fontFamily: Fonts.reqular, marginBottom: 20, paddingHorizontal: 16 }}>
                                        {sidebar.profileData?.username}님!{'\n'}
                                        무엇을 도와드릴까요?
                                    </Text>
                                    {chat.selectedQuestionType === null && (
                                        <FlashList
                                            ref={questionTypeListRef}
                                            horizontal
                                            showsHorizontalScrollIndicator={false}
                                            data={questionTypeBlockItems}
                                            keyExtractor={(item) => item.id.toString()}
                                            contentContainerStyle={{ padding: 16 }}
                                            renderItem={({ item }) => (
                                                <TouchableOpacity onPress={() => chat.setSelectedQuestionType(item.value)}>
                                                    <View style={styles.questionTypeBlock}>
                                                        <View style={{ paddingRight: 10 }}>{item.icon}</View>
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
                            ) : (
                                <FlashList
                                    ref={messagesListRef}
                                    style={{ flex: 1 }}
                                    data={chat.messages}
                                    keyExtractor={(item) => item.id}
                                    contentContainerStyle={{ padding: 16 }}
                                    onContentSizeChange={() => messagesListRef.current?.scrollToEnd({ animated: true })}
                                    renderItem={({ item }: { item: Message }) => (
                                        <View style={{ alignItems: item.isBot ? 'flex-start' : 'flex-end' }}>
                                            {!item.isBot && item.questionType && questionTypeConfig[item.questionType] && (
                                                <View style={styles.questionTypeBadge}>
                                                    {questionTypeConfig[item.questionType].icon}
                                                    <Text style={styles.questionTypeBadgeText}>
                                                        {questionTypeConfig[item.questionType].text}
                                                    </Text>
                                                </View>
                                            )}
                                            <View style={[styles.messageBubble, item.isBot ? styles.botBubble : styles.userBubble]}>
                                                {item.isBot && item.text === '' && chat.isStreaming ? (
                                                    <ActivityIndicator size="small" color={Colors.primary} />
                                                ) : item.isBot ? (
                                                    <>
                                                        {parseMessageSegments(item.text).map((seg, idx) =>
                                                            seg.type === 'token' ? (
                                                                <ChatTokenCard
                                                                    key={idx}
                                                                    title={seg.title}
                                                                    label={
                                                                        seg.tokenType === 'announcement'
                                                                            ? '공고'
                                                                            : seg.tokenType === 'analysis'
                                                                                ? '경쟁사 분석'
                                                                                : 'BMC'
                                                                    }
                                                                    onPress={() => {
                                                                        if (seg.tokenType === 'announcement') {
                                                                            handleAnnouncementPress(seg.id, seg.url);
                                                                            return;
                                                                        }
                                                                        if (seg.tokenType === 'analysis') {
                                                                            handleAnalysisPress(seg.id);
                                                                            return;
                                                                        }
                                                                        handleBMCPress(seg.id);
                                                                    }}
                                                                />
                                                            ) : seg.content.trim() ? (
                                                                <Markdown key={idx} markdown={seg.content} />
                                                            ) : null
                                                        )}
                                                    </>
                                                ) : (
                                                    <Text>{item.text}</Text>
                                                )}
                                            </View>
                                        </View>
                                    )}
                                />
                            )}

                            {/* 입력 영역 */}
                            <View style={styles.inputRow}>
                                <TouchableOpacity style={styles.plusButton} onPress={handleOpenBottomSheet}>
                                    <PlusIcon />
                                </TouchableOpacity>

                                <View style={{ flex: 1, position: "relative" }}>
                                    <TextInput
                                        value={chat.input}
                                        onChangeText={chat.setInput}
                                        style={[
                                            selectedConfig == null && chat.selectedFiles.length === 0
                                                ? styles.textInputNotSelect
                                                : styles.textInputSelect
                                        ]}
                                        placeholder="무엇이든 부탁하세요"
                                    />

                                    {chat.input.trim().length > 0 && !chat.isStreaming && (
                                        <TouchableOpacity
                                            onPress={chat.handleSendMessage}
                                            style={[styles.sendButton, { marginTop: selectedConfig ? 40 : 0 }]}
                                        >
                                            <Text style={{ color: "white", fontSize: 12 }}>↑</Text>
                                        </TouchableOpacity>
                                    )}

                                    {(selectedConfig || chat.selectedFiles.length > 0) && (
                                        <View style={styles.tagListContainer}>
                                            <FlashList
                                                style={{ height: 26, backgroundColor: Colors.white1 }}
                                                horizontal
                                                showsHorizontalScrollIndicator={false}
                                                ref={tagListRef}
                                                contentContainerStyle={{ paddingHorizontal: 16 }}
                                                data={chat.selectedFiles}
                                                keyExtractor={(item) => item.id.toString()}
                                                ListHeaderComponent={() =>
                                                    selectedConfig ? (
                                                        <TouchableOpacity style={styles.tagChip} onPress={() => chat.setSelectedQuestionType(null)}>
                                                            {selectedConfig.icon}
                                                            <Text style={styles.tagChipText}>{selectedConfig.text}</Text>
                                                            <XMarkIcon height={14} />
                                                        </TouchableOpacity>
                                                    ) : null
                                                }
                                                renderItem={({ item }) => (
                                                    <TouchableOpacity
                                                        style={styles.tagChip}
                                                        onPress={() => chat.removeFile(item.id)}
                                                    >
                                                        <FileIcon width={12} height={12} />
                                                        <Text style={[styles.tagChipText, { maxWidth: 100 }]} numberOfLines={1}>{item.fileName}</Text>
                                                        <XMarkIcon height={14} />
                                                    </TouchableOpacity>
                                                )}
                                            />
                                        </View>
                                    )}
                                </View>
                            </View>
                        </KeyboardAvoidingView>
                    </View>
                    </Drawer>

                    <InputModal
                        isLocal={sidebar.isLocal}
                        isModalVisible={sidebar.isModalVisible}
                        isKeyboardVisible={sidebar.isKeyboardVisible}
                        setIsKeyboardVisible={sidebar.setIsKeyboardVisible}
                        setIsModalVisible={sidebar.setIsModalVisible}
                        password={sidebar.password}
                        setPassword={sidebar.setPassword}
                        modalTitle={sidebar.modalTitle}
                        purpose={sidebar.purpose}
                        handleCloseModal={sidebar.handleCloseModal}
                        handleDeleteUser={sidebar.handleDeleteUser}
                        handleSignOut={sidebar.handleSignOut}
                    />

                    <BottomSheet
                        ref={bottomSheetRef}
                        index={-1}
                        snapPoints={snapPoints}
                        enablePanDownToClose
                        backdropComponent={renderBackdrop}
                        keyboardBehavior="interactive"
                        keyboardBlurBehavior="restore"
                        backgroundStyle={{ borderTopLeftRadius: 20, borderTopRightRadius: 20 }}
                        handleIndicatorStyle={{ backgroundColor: Colors.gray3, width: 40 }}
                    >
                        <BottomSheetView style={styles.bottomSheetContent}>
                            <Text style={styles.bottomSheetTitle}>Hub AI</Text>
                            <View style={styles.bottomSheetOptions}>
                                <TouchableOpacity
                                    style={styles.bottomSheetOption}
                                    onPress={() => {
                                        bottomSheetRef.current?.close();
                                        chat.handlePickCamera();
                                    }}
                                >
                                    <View style={styles.bottomSheetIconWrapper}>
                                        <CameraIcon width={24} height={24} />
                                    </View>
                                    <Text style={styles.bottomSheetOptionText}>카메라</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.bottomSheetOption}
                                    onPress={() => {
                                        bottomSheetRef.current?.close();
                                    chat.handlePickGallery();
                                }}
                            >
                                <View style={styles.bottomSheetIconWrapper}>
                                    <GalleryIcon width={24} height={24} />
                                </View>
                                <Text style={styles.bottomSheetOptionText}>갤러리</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.bottomSheetOption}
                                onPress={() => {
                                    bottomSheetRef.current?.close();
                                    chat.handlePickDocument();
                                }}
                            >
                                <View style={styles.bottomSheetIconWrapper}>
                                    <FileIcon width={24} height={24} />
                                </View>
                                <Text style={styles.bottomSheetOptionText}>파일</Text>
                            </TouchableOpacity>
                        </View>
                    </BottomSheetView>
                </BottomSheet>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    closeButton: {
        fontSize: 24,
        color: Colors.gray1,
        fontWeight: '300',
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
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#DDE7FD',
        borderRadius: 12,
        paddingHorizontal: 8,
        paddingVertical: 4,
        marginBottom: 4,
        gap: 4,
    },
    questionTypeBadgeText: {
        fontSize: 11,
        fontFamily: Fonts.semiBold,
        color: '#12398F',
    },
    inputRow: {
        flexDirection: "row",
        alignItems: 'flex-end',
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
    textInputNotSelect: {
        height: 40,
        borderWidth: 1,
        backgroundColor: Colors.white1,
        borderColor: Colors.gray3,
        borderRadius: 200,
        paddingLeft: 14,
        paddingRight: 45,
    },
    textInputSelect: {
        height: 80,
        borderWidth: 1,
        backgroundColor: Colors.white1,
        borderColor: Colors.gray3,
        borderRadius: 15,
        paddingLeft: 14,
        paddingRight: 45,
        paddingTop: 40,
        textAlignVertical: "top",
    },
    sendButton: {
        position: "absolute",
        right: 5,
        top: 5,
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: "#4A7DFF",
        alignItems: "center",
        justifyContent: "center",
    },
    tagListContainer: {
        backgroundColor: Colors.black1,
        top: 13,
        left: 1,
        height: 26,
        width: '91%',
        position: 'absolute',
    },
    tagChip: {
        height: 26,
        borderRadius: 20,
        backgroundColor: '#DFE9FF',
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 6,
        paddingVertical: 6,
        marginRight: 6,
    },
    tagChipText: {
        fontSize: 12,
        fontFamily: Fonts.semiBold,
        color: '#12398F',
        marginEnd: 6,
    },
    questionTypeBlock: {
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#DDE7FD',
        flexDirection: 'row',
        borderRadius: 20,
        paddingHorizontal: 13,
        paddingVertical: 14,
        marginRight: 10,
    },
    questionTypeTitle: {
        fontFamily: Fonts.semiBold,
        fontSize: 14,
        color: '#12398F',
    },
    questionTypeExample: {
        fontFamily: Fonts.reqular,
        fontSize: 11,
    },
    bottomSheetContent: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    bottomSheetTitle: {
        fontSize: 16,
        fontFamily: Fonts.semiBold,
        color: Colors.black1,
        marginBottom: 16,
    },
    bottomSheetOptions: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 24,
    },
    bottomSheetOption: {
        alignItems: 'center',
        width: '30%',
        gap: 8,
    },
    bottomSheetIconWrapper: {
        width: '100%',
        height: '80%',
        borderRadius: 16,
        backgroundColor: '#F2F4F7',
        alignItems: 'center',
        justifyContent: 'center',
    },
    bottomSheetOptionText: {
        fontSize: 12,
        fontFamily: Fonts.reqular,
        color: Colors.gray1,
    },
});
