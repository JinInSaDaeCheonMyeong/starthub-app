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

type ProfileScreenProps = StackScreenProps<SystemStackParamList, 'Profile'>

export default function ProfileScreen({navigation} : ProfileScreenProps){
    const DEFAULT_DATA = "내용을 불러올 수 없습니다";
    const genderMap = new Map<string, string>([['MALE', "남"], ["FEMALE", "여"]])
    const startupStatusMap = new Map<string, string>([
        ['EARLY_STAGE', '예비창업'], 
        ['PRE_STARTUP', '초기창업']
    ])
    const [loading, setLoading] = useState(true);
    const [profileData, setProfileData] = useState<GetMeResponse["data"]>({
        id : -1, 
        username : DEFAULT_DATA,
        birth : DEFAULT_DATA,
        gender : DEFAULT_DATA,
        email : DEFAULT_DATA,
        startupStatus : StartupStatus.EARLY_STAGE,
        companyName : DEFAULT_DATA,
        companyDescription : DEFAULT_DATA,
        numberOfEmployees : -1,
        companyWebsite : DEFAULT_DATA,
        startupLocation : DEFAULT_DATA,
        annualRevenue : -1,
        startupFields : []
    })
    
    const profileList = [
        {label : '이름', data : profileData.username},
        {label : '성별', data : genderMap.get(profileData.gender) ?? DEFAULT_DATA},
        {label : '생년월일', data : 
            profileData.birth && !isNaN(Date.parse(profileData.birth)) 
                ? new Date(profileData.birth).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' }) 
                : DEFAULT_DATA
        },
        { label: "창업 형태", data: startupStatusMap.get(profileData.startupStatus) ?? DEFAULT_DATA }
    ] 

    const earlyStarupList = [
        { label: "기업명", data: profileData?.companyName?.trim() === "" ? DEFAULT_DATA : profileData?.companyName ?? DEFAULT_DATA },
        { label: "기업 소개", data: profileData?.companyDescription?.trim() === "" ? DEFAULT_DATA : profileData?.companyDescription ?? DEFAULT_DATA },
        { label: "기업 인원", data: profileData?.numberOfEmployees != null ? `${profileData.numberOfEmployees}명` : DEFAULT_DATA },
        { label: "기업 사이트", data: profileData?.companyWebsite?.trim() === "" ? DEFAULT_DATA : profileData?.companyWebsite ?? DEFAULT_DATA },
        { label: "연매출액", data: profileData?.annualRevenue != null ? `${profileData.annualRevenue}원` : DEFAULT_DATA },
        { label: "창업위치", data: profileData?.startupLocation?.trim() === "" ? DEFAULT_DATA : profileData?.startupLocation ?? DEFAULT_DATA },
    ];

    const preStarupList = [
        { label: "창업위치", data: profileData?.startupLocation?.trim() === "" ? DEFAULT_DATA : profileData?.startupLocation ?? DEFAULT_DATA },
    ]

    const getProfileData = async () => {
        try {
            const profileData = (await getMe()).data;
            console.log(JSON.stringify(profileData))
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
                console.log(profileData.companyWebsite)
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
                    onTouchEnd={()=>{navigation.navigate('EditProfile', {...profileData})}}
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
                                index === 3 && profileData.companyWebsite?.trim() !== "" && profileData.companyWebsite !== DEFAULT_DATA ? (
                                    <Text 
                                    onPress={async () => {
                                        const canOpen = await Linking.canOpenURL(data);
                                        if (canOpen) Linking.openURL(data);
                                        else ShowToast("오류 발생", "찾을 수 없는 사이트입니다", ToastType.ERROR);
                                    }} 
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