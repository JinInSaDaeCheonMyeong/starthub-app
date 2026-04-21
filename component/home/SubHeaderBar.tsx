import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { LinearGradient } from 'expo-linear-gradient'; // <- 추가
import EditIcon from "../../assets/icons/header/edit.svg";
import BackButton from "../BackButton";
import { Colors } from "../../constants/Color";
import { Fonts } from "../../constants/Fonts";

type SubHeaderBarProps = {
    title : string,
    handleBackPress ?: () => void
    subIcon ?: "None" | "Profile" | "EditProfile" | React.ReactNode
    handleSubPress ?: () => void
    leftIcon ?: React.ReactNode
}

export default function SubHeaderBar({
    title,
    handleBackPress = () => {},
    subIcon = "None",
    handleSubPress = () => {},
    leftIcon
} : SubHeaderBarProps) {
    const renderIcon = () => {
        switch(subIcon){
            case "None":
                return <View style={styles.emptyView}/>
            case "Profile":
                return (
                    <TouchableOpacity onPress={handleSubPress} hitSlop={16}>
                        <EditIcon width={20} height={20} color={Colors.black2}/>
                    </TouchableOpacity>
                )
            case "EditProfile":
                return (
                    <>
                        <View style={styles.emptyView}/>
                        <TouchableOpacity style={{
                                position : "absolute",
                                right : 16,
                            }} 
                            onPress={handleSubPress} 
                            hitSlop={16}
                        >
                            <Text style={styles.clearText}>
                                완료
                            </Text>
                        </TouchableOpacity>
                    </>
                )
            default:
                return (
                    <>
                    <View style={styles.emptyView}/>
                    <TouchableOpacity 
                        style={{
                            position : "absolute",
                            right : 16,
                        }} 
                        onPress={handleSubPress} 
                        hitSlop={16}
                    >
                        {subIcon}
                    </TouchableOpacity>
                    </>
                )
        }
    }
    return (
        <LinearGradient
            colors={['rgba(255, 255, 255, 0.6)', 'rgba(255, 255, 255, 0)']} // <- 원하는 색상 그라데이션
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.headerContainer}
        >
            {leftIcon ? leftIcon : (
                <BackButton
                    width={20}
                    height={20}
                    color={Colors.black2}
                    onClick={handleBackPress}
                />
            )}
            <Text style={styles.title}>{title}</Text>
            {renderIcon()}
        </LinearGradient>
    )
}

const styles = StyleSheet.create({
    headerContainer : {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical : 24,
        position : 'relative'
    },
    title: {
        fontFamily: Fonts.semiBold,
        fontSize: 16,
        color: Colors.black2,
    },
    emptyView : {
        width : 20,
        height : 20
    },
    clearText : {
        color : Colors.primary,
        fontFamily : Fonts.medium,
        fontSize  : 16
    }
})
