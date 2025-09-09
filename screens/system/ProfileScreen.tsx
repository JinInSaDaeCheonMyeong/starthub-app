import { StackScreenProps } from "@react-navigation/stack";
import { SystemStackParamList } from "../../navigation/SystemStack";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from "react-native";
import BackButton from "../../component/BackButton";
import EditIcon from "../../assets/icons/header/edit.svg"
import { Colors } from "../../constants/Color";
import { Shadow } from "react-native-shadow-2";
import { Fonts } from "../../constants/Fonts";
import { GetMeResponse } from "../../type/user/user.type";
import { useFocusEffect } from "@react-navigation/native"
import { useCallback, useState } from "react";
import { getMe } from "../../api/user";
import { isAxiosError } from "axios";
import { ShowToast, ToastType } from "../../util/ShowToast";
import { ErrorResponse } from "../../type/util/response.type";

type ProfileScreenProps = StackScreenProps<SystemStackParamList, 'Profile'>

export default function ProfileScreen({navigation} : ProfileScreenProps){
    const DEFAULT_DATA = "내용을 불러올 수 없습니다";
    const {width} = useWindowDimensions();
    const genderMap = new Map<string, string>([['MALE', "남"], ["FEMALE", "여"]])
    const [loading, setLoading] = useState(true);
    const [profileData, setProfileData] = useState<GetMeResponse["data"]>({
        id : -1, 
        email : DEFAULT_DATA,
        username : DEFAULT_DATA,
        birth : DEFAULT_DATA,
        gender : DEFAULT_DATA,
        profileImage : DEFAULT_DATA,
        introduction : DEFAULT_DATA
    })
    
    const profileList = [
        {label : '이름', data : profileData.username},
        {label : '소개', data : profileData.introduction},
        {label : '성별', data : genderMap.get(profileData.gender) ?? "내용을 불러올 수 없습니다"},
        {label : '생년월일', data : new Date(profileData.birth).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' }) ?? "내용을 불러올 수 없습니다"},
        {label : '이메일', data : profileData.email ?? "내용을 불러올 수 없습니다"},
    ]

    const getProfileData = async () => {
        try {
            const profileData = (await getMe()).data;
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
            setLoading(true);
            getProfileData()
            setLoading(false)
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
                <TouchableOpacity 
                    onPress={()=>{navigation.navigate('EditProfile', profileData)}}
                    style={styles.headerRight}
                >
                    <EditIcon style={styles.headerRight}/>
                </TouchableOpacity>
            </View>
            <ScrollView 
                style={styles.scorllContainer}
                contentContainerStyle={{gap : 18}}
            >
                <View style={styles.imgContainer}>
                    <Shadow
                        distance={4} 
                        offset={[0, 4]}
                        startColor="rgba(185, 185, 185, 0.2)"
                        style={{borderRadius : 80}}
                    >
                        <Image 
                            style={{
                                width : width/4, 
                                height : width/4,
                                borderRadius : 80
                            }}
                            source={{uri : profileData.profileImage}}
                        />
                    </Shadow>
                </View>
                {profileList.map(({label, data}, index) => (
                    <View style={styles.dataContainer} key={index}>
                        <Text style={styles.labelText}>{label}</Text>
                        <Text style={styles.dataText}>{data}</Text>
                    </View>
                ))}
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
        color : Colors.primary
    },
    mainContainer : {
        flex : 1
    },
    scorllContainer : {
        padding : 16,
        flex : 1
    },
    imgContainer : {
        flex : 1,
        justifyContent : "center",
        alignItems : "center",
        paddingTop : 16,
        paddingBottom : 32
    },
    dataContainer : {
        width : "100%",
        padding : 16,
        flexDirection : "row",
        justifyContent : "space-between",
        borderRadius : 8,
        backgroundColor : Colors.white2
    },
    labelText : {
        fontSize : 16,
        fontFamily : Fonts.semiBold,
        color : Colors.black2
    },
    dataText : {
        fontSize : 16,
        fontFamily : Fonts.reqular,
        color : Colors.black2
    }
})