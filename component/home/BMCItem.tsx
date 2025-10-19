import { DimensionValue, Image, ImageSourcePropType, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import GlassView from "../GlassView";
import { Colors } from "../../constants/Color";
import { Fonts } from "../../constants/Fonts";
import { useState } from "react";

type BMCItemProps = {
    width?: DimensionValue
    height?: DimensionValue
    title: string
    subText?: string
    imageSource?: ImageSourcePropType
    onPress : () => void
    isHorizontal ?: boolean
    isCompetitor?: boolean
}

export default function BMCItem({
    width = 'auto',
    height = 200,
    title,
    imageSource,
    subText,
    onPress,
    isHorizontal = false,
    isCompetitor = false
}: BMCItemProps) {
    const defaultImage = require("../../assets/images/bmc-thumbnail-exam.png");
    const contentHeight = height ? height : undefined;
    const [imageError, setImageError] = useState<boolean>(!imageSource);

    return (
        <TouchableOpacity
            activeOpacity={0.4}
            style={{ width }}
            onPress={onPress}
        >
            <GlassView 
                containerStyle={[styles.glassContainer, {height : contentHeight}]}
                blurPercent={0.6}
            >
                <View style={{ position: 'relative', height : contentHeight }}>
                    <Image
                        source={
                            imageError || !imageSource
                                ? defaultImage
                                : imageSource
                        }
                        resizeMode="contain"
                        defaultSource={defaultImage}
                        style={{ width: '100%', height : contentHeight, padding : 8}}
                        onError={() => setImageError(true)}
                    />
                    {imageError && (
                        <View style={styles.dummyOverlay}>
                            <Text style={styles.dummyText}>이미지가 없습니다</Text>
                        </View>
                    )}
                </View>
            </GlassView>
            <View style={styles.textContainer}>
                <Text style={styles.titleText} numberOfLines={isHorizontal ? 1 : undefined}>
                    {title}
                    {isCompetitor && <Text style={{fontSize : 14, fontFamily : Fonts.reqular, color : Colors.gray2}}> · 경쟁사 분석</Text>}
                </Text>
                {subText && (
                    <Text style={styles.subText}>{subText}</Text>
                )}
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    glassContainer: {
        borderRadius: 0,
        borderTopStartRadius: 8,
        borderTopEndRadius: 8,
        alignContent: 'center',
        justifyContent: 'center',
    },
    dummyOverlay: {
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(255,255,255,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    dummyText: {
        color: Colors.gray2,
        fontSize: 14,
        fontFamily: Fonts.medium,
    },
    textContainer: {
        backgroundColor: Colors.white1,
        paddingVertical: 16,
        paddingHorizontal: 12,
        gap: 6,
        borderBottomStartRadius: 8,
        borderBottomEndRadius: 8,
    },
    titleText: {
        color: Colors.black2,
        fontSize: 16,
        fontFamily: Fonts.medium,
    },
    subText: {
        color: Colors.gray2,
        fontSize: 14,
        fontFamily: Fonts.reqular,
    },
});
