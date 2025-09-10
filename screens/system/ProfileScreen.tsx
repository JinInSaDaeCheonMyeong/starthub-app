import { StackScreenProps } from "@react-navigation/stack";
import { SystemStackParamList } from "../../navigation/SystemStack";
import { Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
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
import StartupType from "../../constants/StartupType";

type ProfileScreenProps = StackScreenProps<SystemStackParamList, 'Profile'>

export default function ProfileScreen({navigation} : ProfileScreenProps){
    const DEFAULT_DATA = "내용을 불러올 수 없습니다";
    const genderMap = new Map<string, string>([['MALE', "남"], ["FEMALE", "여"]])
    const startupTypeMap = new Map<StartupType, string>([
        [StartupType.EARLY_STARTUP, "초기 창업"],
        [StartupType.PRE_STARTUP, "예비 창업"]
    ]);
    const [loading, setLoading] = useState(true);
    const [profileData, setProfileData] = useState<GetMeResponse["data"]>({
        id : -1, 
        username : DEFAULT_DATA,
        birth : DEFAULT_DATA,
        gender : DEFAULT_DATA,
        startupType : StartupType.PRE_STARTUP,
        preStartup : {}
    })
    
    const profileList = [
        {label : '이름', data : profileData.username},
        {label : '성별', data : genderMap.get(profileData.gender) ?? DEFAULT_DATA},
        {label : '생년월일', data : 
            profileData.birth && !isNaN(Date.parse(profileData.birth)) 
                ? new Date(profileData.birth).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' }) 
                : DEFAULT_DATA
        },
        { label: "창업 형태", data: startupTypeMap.get(profileData.startupType) ?? DEFAULT_DATA }
    ]    

    // 창업형태가 초기 창업이라면
    const earlyStarupList = [
        {label : '기업명', data : profileData.earlyStartup?.companyName ?? DEFAULT_DATA},
        {label : '기업 소개', data : profileData.earlyStartup?.companyIntro ?? DEFAULT_DATA},
        {label : '기업 인원', data : `${profileData.earlyStartup?.personNumber ?? 0}명`},
        {label : '기업 사이트', data : profileData.earlyStartup?.companySite ?? DEFAULT_DATA},
        {label : '연매출액', data : `${profileData.earlyStartup?.getMoneyYear ?? 0}원`},
        {label : '창업위치', data : profileData.earlyStartup?.companyLocation ?? DEFAULT_DATA},
    ]

    // 창업형태가 예비 창업이라면
    const preStarupList = [
        {label : '창업위치', data : profileData.preStartup?.companyLocation ?? DEFAULT_DATA},
    ]

    const getProfileData = async () => {
        try {
            const profileData = (await getMe()).data;
            profileData.startupType = StartupType.EARLY_STARTUP; //확인용
            switch(profileData.startupType){
                case StartupType.EARLY_STARTUP: 
                    profileData.earlyStartup = {
                        companyName : '더미데이터',
                        personNumber : 0,
                        getMoneyYear : 0,
                    }
                    profileData.preStartup = undefined
                    break;
                case StartupType.PRE_STARTUP:
                    profileData.preStartup = {}
                    break;
            }
            setProfileData(profileData)
        } catch (error: unknown) {
            if (isAxiosError(error)) {
                const response = error.response;
                if (!response) {
                    ShowToast("오류 발생", "네트워크 오류가 발생했습니다", ToastType.ERROR);
                    navigation.goBack()
                    return; 
                }
                const errorData = response.data as ErrorResponse;
                ShowToast("오류 발생", errorData.message, ToastType.ERROR);
                navigation.goBack();
                return;
            }
            ShowToast("오류 발생", "알 수 없는 오류가 발생했습니다", ToastType.ERROR);
            navigation.goBack();
        }
    }

    useFocusEffect(
        useCallback(() => {
            const fetchData = async () => {
                setLoading(true);
                await getProfileData();
                setLoading(false);
            };
            fetchData();
        }, [])
    );

    return (
        <View style={styles.mainContainer}>
            <View style={styles.header}>
                <BackButton
                    width={24}
                    height={24}
                    color={Colors.black2}
                    onClick={() => {navigation.goBack()}}
                />
                <Text style={styles.headerTitle}>프로필</Text>
                <EditIcon 
                    style={styles.headerRight} 
                    width={24}
                    height={24}
                    hitSlop={16}
                    onTouchEnd={()=>{navigation.navigate('EditProfile', profileData)}}
                />
            </View>
            <ScrollView 
                style={styles.scorllContainer}
                contentContainerStyle={{gap : 24, paddingBottom : 16}}
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
                {profileData.startupType === StartupType.EARLY_STARTUP ?
                    earlyStarupList.map(({label, data}, index) => (
                        <View style={styles.labelContainer} key={index}>
                            <Text style={styles.labelText}>{label}</Text>
                            <View style={styles.dataContainer}>
                                <Text onPress={() => {index === 3 && Linking.openURL(data)}} style={[styles.dataText, index === 3 && {color : Colors.info, textDecorationLine : "underline"}]}>{data}</Text>
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
        flex : 1
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