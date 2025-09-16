import { StackScreenProps } from "@react-navigation/stack";
import { SystemStackParamList } from "../../navigation/SystemStack";
import { Linking, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import BackButton from "../../component/BackButton";
import EditIcon from "../../assets/icons/header/edit.svg"
import { Colors } from "../../constants/Color";
import { Fonts } from "../../constants/Fonts";
import { GetMeResponse } from "../../type/user/user.type";
import { useFocusEffect } from "@react-navigation/native"
import { useCallback, useState } from "react";
import { getMe } from "../../api/user";
import { isAxiosError } from "axios";
import { ShowToast, ToastType } from "../../util/ShowToast";
import { ErrorResponse } from "../../type/util/response.type"
import StartupStatus from "../../constants/StartupStatus";
import useProfileScreen from "../../hooks/system/useProfileScreen";

export type ProfileScreenProps = StackScreenProps<SystemStackParamList, 'Profile'>

export default function ProfileScreen(props : ProfileScreenProps){
    const {
        form : {
            profileData
        },
        ui : {
            profileList,
            earlyStarupList,
            preStarupList,
            isWebLink
        },
        action : {
            goBack,
            goEditProfile,
            goWeb
        }
    } = useProfileScreen(props)
    return (
        <View style={styles.mainContainer}>
            <View style={styles.header}>
                <BackButton
                    width={24}
                    height={24}
                    color={Colors.black2}
                    onClick={() => {goBack()}}
                />
                <Text style={styles.headerTitle}>프로필</Text>
                <EditIcon 
                    style={styles.headerRight} 
                    width={24}
                    height={24}
                    hitSlop={16}
                    onTouchEnd={()=>{goEditProfile()}}
                />
            </View>
            <ScrollView 
                style={styles.scorllContainer}
                contentContainerStyle={{
                    gap : 24, 
                    paddingBottom : Platform.select({ios : 16, android : 32})
                }}
                showsVerticalScrollIndicator={false}
            >
                {profileList.map(({label, data}, index) => (
                    <View style={styles.labelContainer} key={index}>
                        <Text style={styles.labelText}>{label}</Text>
                        <View style={styles.dataContainer}>
                            <Text style={styles.dataText}>{data}</Text>
                        </View>
                    </View>
                ))}
                <View style={styles.line}/>
                {profileData.startupStatus === StartupStatus.EARLY_STAGE ?
                    earlyStarupList.map(({label, data}, index) => (
                        <View style={styles.labelContainer} key={index}>
                            <Text style={styles.labelText}>{label}</Text>
                            <View style={styles.dataContainer}>
                            {
                                isWebLink(index) ? (
                                    <Text 
                                    onPress={() => {goWeb(data)}} 
                                    style={[styles.dataText, { color : Colors.info, textDecorationLine : "underline" }]}
                                    >
                                    {data}
                                    </Text>
                                ) : (
                                    <Text style={styles.dataText}>{data}</Text>
                                )
                            }
                            </View>
                        </View>
                    )) : 
                    preStarupList.map(({label, data}, index) => (
                        <View style={styles.labelContainer} key={index}>
                            <Text style={styles.labelText}>{label}</Text>
                            <View style={styles.dataContainer}>
                                <Text style={styles.dataText}>{data}</Text>
                            </View>
                        </View>
                    ))
                }
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20,
    },
    headerTitle: {
        fontFamily: 'Pretendard-Bold',
        fontSize: 18,
        color: Colors.gray1,
    },
    headerRight: {
        width: 24,
        height: 24,
        color : Colors.black2
    },
    mainContainer : {
        flex : 1,
    },
    scorllContainer : {
        paddingHorizontal : 16,
        paddingTop : 16,
        paddingBottom : 32,
        flex : 1
    },
    labelContainer : {
        width : "100%",
        gap : 12
    },
    line : {
        width : "100%",
        borderBottomWidth : 2,
        borderColor : Colors.white2
    },
    dataContainer : {
        width : "100%",
        padding : 16,
        borderRadius : 8,
        backgroundColor : Colors.white2
    },
    labelText : {
        fontSize : 16,
        fontFamily : Fonts.bold,
        color : Colors.black2
    },
    dataText : {
        fontSize : 14,
        fontFamily : Fonts.medium,
        color : Colors.black2
    }
})