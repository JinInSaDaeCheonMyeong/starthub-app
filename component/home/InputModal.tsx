import {
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableWithoutFeedback,
    View,
    Modal,
    TouchableOpacity,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useEffect } from "react";
import { Fonts } from "../../constants/Fonts";
import { Colors } from "../../constants/Color";

type InputModalProps = {
    isModalVisible: boolean;
    setIsModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
    isKeyboardVisible: boolean;
    setIsKeyboardVisible: React.Dispatch<React.SetStateAction<boolean>>;
    password: string;
    setPassword: React.Dispatch<React.SetStateAction<string>>;
    modalTitle: string;
    isLocal: boolean;
    purpose: "Delete" | "SignOut";
    handleCloseModal: () => void;
    handleDeleteUser: () => Promise<void>;
    handleSignOut: () => Promise<void>;
};

export default function InputModal({
    isModalVisible,
    setIsModalVisible,
    isKeyboardVisible,
    setIsKeyboardVisible,
    password,
    setPassword,
    modalTitle,
    isLocal,
    purpose,
    handleCloseModal,
    handleDeleteUser,
    handleSignOut,
}: InputModalProps) {
    const insets = useSafeAreaInsets();

    useEffect(() => {
        const showSub = Keyboard.addListener("keyboardDidShow", () =>
            setIsKeyboardVisible(true)
        );
        const hideSub = Keyboard.addListener("keyboardDidHide", () =>
            setIsKeyboardVisible(false)
        );
    
        return () => {
            showSub.remove();
            hideSub.remove();
        };
    }, []);

    return (
        <Modal
            transparent
            visible={isModalVisible}
            animationType="fade"
            onRequestClose={() => setIsModalVisible(false)}
        >
            <TouchableWithoutFeedback
                onPress={() => {
                    if (isKeyboardVisible) Keyboard.dismiss();
                    else setIsModalVisible(false);
                }}
            >
            <KeyboardAvoidingView
                style={styles.modalOverlay}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={-insets.top}
            >
                <View style={styles.modalContent}>
                <View style={{ gap: 8 }}>
                    <Text style={styles.modalTitle}>{modalTitle}</Text>
                    {purpose === "Delete" && isLocal && (
                    <TextInput
                        style={styles.textInput}
                        secureTextEntry
                        autoCapitalize="none"
                        value={password}
                        onChangeText={setPassword}
                        placeholder="비밀번호를 입력해주세요"
                        placeholderTextColor={Colors.gray3}
                    />
                    )}
                </View>
                <View style={styles.modalButtons}>
                    <TouchableOpacity
                        style={styles.modalButton}
                        onPress={handleCloseModal}
                    >
                    <Text style={styles.cancelButton}>아니오</Text>
                    </TouchableOpacity>
                    <View style={styles.modalDivider} />
                    <TouchableOpacity
                        style={styles.modalButton}
                        onPress={async () => {
                            switch (purpose) {
                            case "Delete":
                                await handleDeleteUser();
                                return;
                            case "SignOut":
                                await handleSignOut();
                                return;
                            }
                        }}
                    >
                        <Text style={styles.confirmButton}>예</Text>
                    </TouchableOpacity>
                </View>
                </View>
            </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContent: {
        backgroundColor: Colors.white1,
        borderRadius: 12,
        width: "80%",
        overflow: "hidden",
        paddingTop: 24,
        gap: 20,
    },
    modalTitle: {
        fontSize: 16,
        fontFamily: Fonts.semiBold,
        textAlign: "center",
        color: Colors.error,
    },
    textInput: {
        fontSize: 16,
        fontFamily: Fonts.medium,
        color: Colors.black2,
        textAlign: "center",
        marginHorizontal: 16,
    },
    modalButtons: {
        flexDirection: "row",
        borderTopWidth: 1,
        borderTopColor: Colors.gray3,
    },
    modalButton: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 16,
    },
    modalDivider: {
        width: 1,
        backgroundColor: Colors.gray3,
    },
    cancelButton: {
        fontSize: 14,
        color: Colors.gray2,
        fontFamily: Fonts.semiBold,
    },
    confirmButton: {
        fontSize: 14,
        color: Colors.info,
        fontFamily: Fonts.semiBold,
    },
});