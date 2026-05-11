import { RefObject, useCallback } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from "@gorhom/bottom-sheet";
import { Colors } from "../../../constants/Color";
import { Fonts } from "../../../constants/Fonts";
import CameraIcon from "../../../assets/icons/chat/camera.svg";
import GalleryIcon from "../../../assets/icons/chat/picture.svg";
import FileIcon from "../../../assets/icons/chat/clip.svg";

type ChatAttachmentSheetProps = {
    bottomSheetRef: RefObject<BottomSheet | null>;
    snapPoints: string[];
    onPickCamera: () => void;
    onPickGallery: () => void;
    onPickDocument: () => void;
};

export default function ChatAttachmentSheet({
    bottomSheetRef,
    snapPoints,
    onPickCamera,
    onPickGallery,
    onPickDocument,
}: ChatAttachmentSheetProps) {
    const renderBackdrop = useCallback(
        (props: any) => (
            <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />
        ),
        []
    );

    const handlePress = (callback: () => void) => {
        bottomSheetRef.current?.close();
        callback();
    };

    return (
        <BottomSheet
            ref={bottomSheetRef}
            index={-1}
            snapPoints={snapPoints}
            enablePanDownToClose
            backdropComponent={renderBackdrop}
            keyboardBehavior="interactive"
            keyboardBlurBehavior="restore"
            backgroundStyle={styles.background}
            handleIndicatorStyle={styles.handleIndicator}
        >
            <BottomSheetView style={styles.content}>
                <Text style={styles.title}>Hub AI</Text>
                <View style={styles.options}>
                    <TouchableOpacity
                        style={styles.option}
                        onPress={() => handlePress(onPickCamera)}
                    >
                        <View style={styles.iconWrapper}>
                            <CameraIcon width={24} height={24} />
                        </View>
                        <Text style={styles.optionText}>카메라</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.option}
                        onPress={() => handlePress(onPickGallery)}
                    >
                        <View style={styles.iconWrapper}>
                            <GalleryIcon width={24} height={24} />
                        </View>
                        <Text style={styles.optionText}>갤러리</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.option}
                        onPress={() => handlePress(onPickDocument)}
                    >
                        <View style={styles.iconWrapper}>
                            <FileIcon width={24} height={24} />
                        </View>
                        <Text style={styles.optionText}>파일</Text>
                    </TouchableOpacity>
                </View>
            </BottomSheetView>
        </BottomSheet>
    );
}

const styles = StyleSheet.create({
    background: {
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    handleIndicator: {
        backgroundColor: Colors.gray3,
        width: 40,
    },
    content: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    title: {
        fontSize: 16,
        fontFamily: Fonts.semiBold,
        color: Colors.black1,
        marginBottom: 16,
    },
    options: {
        flexDirection: "row",
        justifyContent: "center",
        gap: 24,
    },
    option: {
        alignItems: "center",
        width: "30%",
        gap: 8,
    },
    iconWrapper: {
        width: "100%",
        height: "80%",
        borderRadius: 16,
        backgroundColor: "#F2F4F7",
        alignItems: "center",
        justifyContent: "center",
    },
    optionText: {
        fontSize: 12,
        fontFamily: Fonts.reqular,
        color: Colors.gray1,
    },
});
