import React from "react";
import { StyleSheet, TouchableOpacity, View, Platform } from "react-native";
import { Colors } from "../constants/Color";
import TitleLogo from "../assets/logos/starthub-title-logo.svg";
import LogoIcon from "../assets/logos/starthub-logo.svg";
import MenuIcon from "../assets/icons/header/menu.svg";
import { BlurView } from "@react-native-community/blur";
import GlassView from "./GlassView";

type HeaderBarProps = {
    onClickMenu: () => void;
};

export default function HeaderBar({ onClickMenu }: HeaderBarProps) {
    return (
        <GlassView 
            containerStyle={{
                borderRadius : 0,
                borderWidth : 0,
                backgroundColor: Platform.OS === 'android' 
                    ? 'rgba(255, 255, 255, 0.1)' 
                    : 'transparent',
            }}
            blurPercent={0.6}
        >
            <View style={styles.headerContainer}>
                <View style={styles.logoSection}>
                    <LogoIcon width={29} height={29} fill='none' color='none'/>
                    <TitleLogo width={104} height={29} fill='none' color='none' />
                </View>
                <View style={styles.iconContainer}>
                    <TouchableOpacity onPress={onClickMenu}>
                    <MenuIcon width={28} height={28} color={Colors.gray1} fill="none"/>
                    </TouchableOpacity>
                </View>
            </View>
        </GlassView>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical : 20
    },
    logoSection: {
        flexDirection: "row",
        gap: 10,
        alignItems: "center",
    },
    iconContainer: {
        flexDirection: "row",
        gap: 16,
    },
});
