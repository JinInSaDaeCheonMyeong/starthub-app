import { StackScreenProps } from "@react-navigation/stack";
import { Image, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, useWindowDimensions, View } from "react-native";
import { SystemStackParamList } from "../../navigation/SystemStack";
import BackButton from "../../component/BackButton";
import { Colors } from "../../constants/Color";
import { Fonts } from "../../constants/Fonts";
import { useState } from "react";
import { Shadow } from "react-native-shadow-2";
import { setProfile } from "../../api/user";
import { ShowToast, ToastType } from "../../util/ShowToast";
import CameraIcon from "../../assets/icons/category/interest/media-category.svg"
import { pickerImage } from "../../util/PickerImage";

type ProfileScreenProps = StackScreenProps<SystemStackParamList, 'EditProfile'>

export default function EditProfileScreen({navigation, route : {params}} : ProfileScreenProps){
    const birthList = params.birth.split('-')
    const [user, setUser] = useState(params)
    const [year, setYear] = useState(birthList[0])
    const [month, setMonth] = useState(birthList[1])
    const [day, setDay] = useState(birthList[2])
    const [selectGender, setSelectGender] = useState(user.gender === "MALE")
    const {width} = useWindowDimensions()

    return(
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
                    onPress={async ()=>{
                        try {
                            await setProfile({
                            username : user.username,
                            introduction : user.introduction,
                            birth: `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`,
                            gender : selectGender ? "MALE" : "FEMALE",
                            profileImage : "https://storage.googleapis.com/starthub-storage/profile-images/default_user_profile.png",
                            interests : []
                        })
                            ShowToast("프로필 수정", "프로필 수정에 성공하셨습니다", ToastType.SUCCESS)
                            navigation.popTo("System")
                        } catch (error : any) {
                            if(error.isAxiosError){
                                ShowToast("프로필 수정", "프로필 수정에 실패하셨습니다", ToastType.ERROR)
                                console.log(error.message)
                            }
                        } 
                    }}
                >   
                    <Text
                        style={styles.headerRight}
                    >
                        완료
                    </Text>
                </TouchableOpacity>
            </View>
            <View style={styles.dataContainer}>
                <View style={styles.imgContainer}>
                    <TouchableOpacity onPress={async () => {
                        ShowToast("정보", "아직 개발 중입니다", ToastType.INFO)
                        // const uri = await pickerImage()
                        // if (uri) setUser({...user, profileImage : uri})
                    }}>
                        <Shadow
                            distance={4}
                            offset={[0, 4]}
                            startColor="rgba(185, 185, 185, 0.2)"
                            style={{ borderRadius: 80 }}
                        >
                            <View style={{ position: "relative" }}>
                                <Image
                                    style={{
                                    width: width / 4,
                                    height: width / 4,
                                    borderRadius: 80,
                                    }}
                                    source={{ uri : user.profileImage }}
                                />
                                <View
                                    style={{
                                    position: "absolute",
                                    bottom: 0,
                                    right: 0,
                                    }}
                                >
                                    <Shadow
                                    distance={4}
                                    offset={[0, 4]}
                                    startColor="rgba(185, 185, 185, 0.2)"
                                    style={{ borderRadius: 20 }}
                                    >
                                        <View
                                            style={{
                                            backgroundColor: Colors.white1,
                                            borderRadius: 20,
                                            padding: 8,
                                            }}
                                        >
                                            <CameraIcon
                                                width={20} 
                                                height={20}
                                                color={Colors.gray2}
                                                fill={Colors.gray2}
                                            />
                                        </View>
                                    </Shadow>
                                </View>
                            </View>
                        </Shadow>
                    </TouchableOpacity>
                </View>
                <View style={styles.dataInputContainer}>
                    <Text style={styles.titleText}>이름</Text>
                    <TextInput
                        style={styles.dataInputText}
                        value={user.username} 
                        placeholder="이름을 입력해주세요..."
                        placeholderTextColor={Colors.gray2}
                        onChangeText={(value) => {setUser({...user, username : value})}}
                    />
                </View>
                <View style={styles.dataInputContainer}>
                    <Text style={styles.titleText}>소개</Text>
                    <TextInput
                        style={styles.dataInputText}
                        value={user.introduction} 
                        placeholder="자신의 소개를 입력해주세요..."
                        placeholderTextColor={Colors.gray2}
                        onChangeText={(value) => {setUser({...user, introduction : value})}}
                    />
                </View>
                <View style={styles.dataInputContainer}>
                    <Text style={styles.titleText}>성별</Text>
                    <View style={styles.genderContainer}>
                        <TouchableOpacity 
                            onPress={() => setSelectGender(true)}
                            style={[styles.genderBox, {borderColor : selectGender ? Colors.primary : Colors.white2 }]}
                        >
                            <Text style={[styles.selectText, {color : selectGender ? Colors.primary : Colors.gray2 }]}>남</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            onPress={() => setSelectGender(false)}
                            style={[styles.genderBox, {borderColor : !selectGender ? Colors.primary : Colors.white2 }]}
                        >
                            <Text style={[styles.selectText, {color : !selectGender ? Colors.primary : Colors.gray2 }]}>여</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.dataInputContainer}>
                    <Text style={styles.titleText}>생년월일</Text>
                    <View style={styles.genderContainer}>
                        <TextInput
                            style={[styles.dataInputText, {flex : 1, textAlign : "center"}]}
                            inputMode={'numeric'}
                            maxLength={4}
                            value={year} 
                            placeholder="YYYY"
                            placeholderTextColor={Colors.gray2}
                            onChangeText={(value) => {setYear(value)}}
                        />
                        <TextInput
                            style={[styles.dataInputText, {flex : 1, textAlign : "center"}]}
                            inputMode={'numeric'}
                            maxLength={2}
                            value={month} 
                            placeholder="MM"
                            placeholderTextColor={Colors.gray2}
                            onChangeText={(value) => {setMonth(value)}}
                        />
                        <TextInput
                            style={[styles.dataInputText, {flex : 1, textAlign : "center"}]}
                            inputMode={'numeric'}
                            maxLength={2}
                            value={day} 
                            placeholder="DD"
                            placeholderTextColor={Colors.gray2}
                            onChangeText={(value) => {setDay(value)}}
                        />
                    </View>
                </View>
            </View>
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
        color : Colors.primary,
        fontFamily : Fonts.medium,
        fontSize  : 16
    },
    mainContainer : {
        flex : 1,
    },
    dataContainer : {
        flex : 1,
        padding : 16,
        gap : 24
    },
    dataInputContainer : {
        gap : 12
    },
    genderContainer : {
        flexDirection : "row",
        justifyContent : "space-between",
        gap : 16
    },
    imgContainer : {
        padding : 16,
        justifyContent : "center",
        alignItems : "center",
        position : "relative"
    },
    dataInputWrap : {
        flex : 1,
        backgroundColor : Colors.white2,
    },
    dataInputText : {
        fontFamily : Fonts.medium,
        fontSize : 16,
        color : Colors.black2,
        backgroundColor : Colors.white2,
        padding : 16,
        borderRadius : 8
    },
    genderBox : {
        flex : 1,
        padding  : 16,
        backgroundColor : Colors.white2,
        borderRadius : 8,
        alignItems : "center",
        borderWidth : 1,
        borderStyle : "solid",
    },
    titleText : {
        fontFamily : Fonts.bold,
        fontSize : 16,
        color : Colors.black2,
    },
    selectText : {
        fontFamily : Fonts.medium,
        fontSize : 16,
        color : Colors.gray2,
    },
})