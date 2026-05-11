import {
    ImageBackground,
    Keyboard,
    KeyboardAvoidingView,
    Linking,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useCallback, useMemo, useRef } from "react";
import { Colors } from "../../constants/Color";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/RootStack";
import { DefaultImage } from "../../constants/AppImages";
import { Drawer } from "react-native-drawer-layout";
import BottomSheet from "@gorhom/bottom-sheet";

import SubHeaderBar from "../../component/home/SubHeaderBar";
import ChatBotSideBar from "../../component/home/ChatBotSideBar";
import InputModal from "../../component/home/InputModal";
import StartupStatus from "../../constants/StartupStatus";
import ChatAttachmentSheet from "../../component/home/chatbot/ChatAttachmentSheet";
import ChatEmptyState from "../../component/home/chatbot/ChatEmptyState";
import ChatInputBar from "../../component/home/chatbot/ChatInputBar";
import ChatMessageList from "../../component/home/chatbot/ChatMessageList";

import useChatBot from "../../hooks/home/useChatBot";
import useSideBar from "../../hooks/home/useSideBar";
import { questionTypeConfig } from "../../type/chatbot/chat.type";
import { getNotice } from "../../api/notice";
import { parseReceptionPeriod } from "../../util/DateFormat";
import { getBMC } from "../../api/bmc";
import { getCompetitors } from "../../api/competitor";
import { ShowToast, ToastType } from "../../util/ShowToast";

import MenuIcon from "../../assets/icons/header/menu.svg";

const backgroundImage = DefaultImage.background;

export type ChatBotScreenProps = NativeStackScreenProps<RootStackParamList, "ChatBot">;

export default function ChatBotScreen({ navigation }: ChatBotScreenProps) {
    const insets = useSafeAreaInsets();
    const sidebar = useSideBar(navigation);
    const chat = useChatBot();
    const bottomSheetRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ["25%"], []);

    const selectedConfig =
        chat.selectedQuestionType !== null
            ? questionTypeConfig[chat.selectedQuestionType]
            : null;

    const drawerStartupStatus =
        sidebar.profileData?.startupStatus === StartupStatus.EARLY_STAGE
            ? StartupStatus.EARLY_STAGE
            : StartupStatus.PRE_STARTUP;

    const handleAnnouncementPress = useCallback(async (id: number, url?: string) => {
        try {
            const res = await getNotice(id);
            const raw = res.data;
            const { startDate, endDate } = parseReceptionPeriod(raw.receptionPeriod);
            navigation.navigate("InNotice", { Notice: { ...raw, startDate, endDate } });
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
            ShowToast("", "공고를 불러올 수 없습니다", ToastType.ERROR);
        }
    }, [navigation]);

    const handleBMCPress = useCallback(async (id: number) => {
        try {
            const res = await getBMC(id);
            navigation.navigate("InBMC", { BMC: res.data });
        } catch {
            ShowToast("", "BMC를 불러올 수 없습니다", ToastType.ERROR);
        }
    }, [navigation]);

    const handleAnalysisPress = useCallback(async (id: number) => {
        try {
            const competitors = (await getCompetitors()).data;
            const target = competitors.find((value) => value.bmcId === id);
            if (!target) {
                ShowToast("", "경쟁사 분석 결과를 찾을 수 없습니다", ToastType.ERROR);
                return;
            }
            const bmc = (await getBMC(id)).data;
            (navigation as any).navigate("Competitor", {
                screen: "Result",
                params: {
                    bmcId: id,
                    image: { uri: bmc.imageUrl, cache: "force-cache" },
                    data: target,
                },
            });
        } catch {
            ShowToast("", "경쟁사 분석 결과를 불러올 수 없습니다", ToastType.ERROR);
        }
    }, [navigation]);

    const handleOpenBottomSheet = useCallback(() => {
        Keyboard.dismiss();
        bottomSheetRef.current?.expand();
    }, []);

    useFocusEffect(
        useCallback(() => {
            sidebar.fetchProfile();
            chat.fetchSessions();
        }, [chat.fetchSessions, sidebar.fetchProfile])
    );

    return (
        <ImageBackground source={backgroundImage} style={styles.background}>
            <View style={[styles.safeArea, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
                <Drawer
                    open={sidebar.drawerOpen}
                    onClose={() => sidebar.setDrawerOpen(false)}
                    onOpen={() => sidebar.setDrawerOpen(true)}
                    renderDrawerContent={() => (
                        <ChatBotSideBar
                            username={sidebar.profileData?.username ?? "찾을 수 없는 유저"}
                            startupStatus={drawerStartupStatus}
                            navigation={navigation}
                            sessions={chat.sessions}
                            onXmarkPress={() => sidebar.setDrawerOpen(false)}
                            handleSignOut={() => sidebar.handleOpenModal("SignOut")}
                            onNewChat={chat.startNewSession}
                            onSelectSession={chat.loadSession}
                        />
                    )}
                    drawerPosition="left"
                    drawerType="front"
                    drawerStyle={styles.drawer}
                    overlayStyle={styles.drawerOverlay}
                    swipeEnabled
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
                            style={styles.container}
                            behavior={Platform.OS === "ios" ? "padding" : undefined}
                            keyboardVerticalOffset={insets.top + 70}
                        >
                            {chat.messages.length === 0 ? (
                                <ChatEmptyState
                                    username={sidebar.profileData?.username}
                                    selectedQuestionType={chat.selectedQuestionType}
                                    setSelectedQuestionType={chat.setSelectedQuestionType}
                                />
                            ) : (
                                <ChatMessageList
                                    messages={chat.messages}
                                    isStreaming={chat.isStreaming}
                                    onAnnouncementPress={handleAnnouncementPress}
                                    onAnalysisPress={handleAnalysisPress}
                                    onBMCPress={handleBMCPress}
                                />
                            )}

                            <ChatInputBar
                                input={chat.input}
                                setInput={chat.setInput}
                                selectedConfig={selectedConfig}
                                selectedFiles={chat.selectedFiles}
                                isStreaming={chat.isStreaming}
                                onOpenBottomSheet={handleOpenBottomSheet}
                                onSendMessage={chat.handleSendMessage}
                                setSelectedQuestionType={chat.setSelectedQuestionType}
                                removeFile={chat.removeFile}
                            />
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

                <ChatAttachmentSheet
                    bottomSheetRef={bottomSheetRef}
                    snapPoints={snapPoints}
                    onPickCamera={chat.handlePickCamera}
                    onPickGallery={chat.handlePickGallery}
                    onPickDocument={chat.handlePickDocument}
                />
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
    },
    container: {
        flex: 1,
    },
    drawer: {
        width: 303,
        backgroundColor: "white",
    },
    drawerOverlay: {
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    closeButton: {
        fontSize: 24,
        color: Colors.gray1,
        fontWeight: "300",
    },
});
