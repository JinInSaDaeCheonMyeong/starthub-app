import { StackScreenProps } from "@react-navigation/stack";
import { Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, useWindowDimensions, View } from "react-native";
import { SystemStackParamList } from "../../navigation/SystemStack";
import BackButton from "../../component/BackButton";
import { Colors } from "../../constants/Color";
import { Fonts } from "../../constants/Fonts";
import { useState } from "react";
import { ShowToast, ToastType } from "../../util/ShowToast";
import { setProfile } from "../../api/user";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type ProfileScreenProps = StackScreenProps<SystemStackParamList, 'EditProfile'>

export default function EditProfileScreen({navigation, route : {params}} : ProfileScreenProps){
    const birthList = params.birth.split('-')
    const insets = useSafeAreaInsets()
    const [user, setUser] = useState(params)
    const [year, setYear] = useState(birthList[0])
    const [month, setMonth] = useState(birthList[1])
    const [numberPerson, setNumberPerson] = useState(String(user.numberOfEmployees) ?? '');
    const [annualRevenue, setAnnualRevenue] = useState(String(user.annualRevenue) ?? '');
    const [day, setDay] = useState(birthList[2])
    const [selectGender, setSelectGender] = useState(user.gender === "MALE")
    const [selectStartupStatus, setSelectStartupStatus] = useState(user.startupStatus === "EARLY_STAGE")

    return(
        <KeyboardAvoidingView
            style={{flex : 1}}
            behavior='height'
            keyboardVerticalOffset={Platform.OS === 'ios' ? insets.bottom + 20 : 20}
        >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
                                username: user.username,
                                birth: `${year}-${month}-${day}`,
                                gender: selectGender ? "MALE" : "FEMALE",
                                startupStatus: selectStartupStatus ? "EARLY_STAGE" : "PREPARATION",
                                companyName: selectStartupStatus ? user.companyName : undefined,
                                companyDescription: selectStartupStatus ? user.companyDescription : undefined,
                                numberOfEmployees: selectStartupStatus ? Number(numberPerson) : undefined,
                                companyWebsite: selectStartupStatus ? user.companyWebsite : undefined,
                                annualRevenue: selectStartupStatus ? Number(annualRevenue) : undefined,
                                startupLocation: user.startupLocation,
                            })
                            ShowToast("프로필 수정", "프로필 수정에 성공하셨습니다", ToastType.SUCCESS)
                            navigation.goBack()
                        } catch (error : any) {
                            if(error.isAxiosError){
                                ShowToast("프로필 수정", "프로필 수정에 실패하셨습니다", ToastType.ERROR)
                                console.log(error.message)
                            }
                            ShowToast("프로필 수정", "알 수 없는 오류가 발생했습니다", ToastType.ERROR)
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
            <ScrollView 
                style={styles.dataContainer}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{gap : 24, paddingBottom : 16}}
            >
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
                <View style={styles.dataInputContainer}>
                    <Text style={styles.titleText}>창업 형태</Text>
                    <View style={styles.genderContainer}>
                        <TouchableOpacity 
                            onPress={() => setSelectStartupStatus(true)}
                            style={[styles.genderBox, {borderColor : selectStartupStatus ? Colors.primary : Colors.white2 }]}
                        >
                            <Text style={[styles.selectText, {color : selectStartupStatus ? Colors.primary : Colors.gray2 }]}>초기 창업</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            onPress={() => setSelectStartupStatus(false)}
                            style={[styles.genderBox, {borderColor : !selectStartupStatus ? Colors.primary : Colors.white2 }]}
                        >
                            <Text style={[styles.selectText, {color : !selectStartupStatus ? Colors.primary : Colors.gray2 }]}>예비 창업</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.line}/>
                {selectStartupStatus ? (
                    <>
                    <View style={styles.dataInputContainer}>
                        <Text style={styles.titleText}>기업명</Text>
                        <TextInput
                            style={styles.dataInputText}
                            value={user.companyName} 
                            placeholder="기업명을 입력해주세요..."
                            placeholderTextColor={Colors.gray2}
                            onChangeText={(value) => {setUser({
                                ...user, 
                                companyName : value
                            })}}
                        />
                    </View>
                    <View style={styles.dataInputContainer}>
                        <Text style={styles.titleText}>(선택) 기업 소개</Text>
                        <TextInput
                            style={styles.dataInputText}
                            value={user.companyDescription} 
                            placeholder="기업 소개를 해주세요..."
                            placeholderTextColor={Colors.gray2}
                            onChangeText={(value) => {setUser({
                                ...user, 
                                companyDescription : value
                            })}}
                        />
                    </View>
                    <View style={styles.dataInputContainer}>
                        <Text style={styles.titleText}>기업 인원</Text>
                        <TextInput
                            style={styles.dataInputText}
                            value={numberPerson} 
                            placeholder="기업 인원을 입력해주세요..."
                            keyboardType='numeric'
                            placeholderTextColor={Colors.gray2}
                            onChangeText={(value) => {
                                setNumberPerson(value)
                            }}
                        />
                    </View>
                    <View style={styles.dataInputContainer}>
                        <Text style={styles.titleText}>(선택) 기업 사이트</Text>
                        <TextInput
                            style={styles.dataInputText}
                            value={user.companyWebsite} 
                            placeholder="기업 사이트을 입력해주세요..."
                            placeholderTextColor={Colors.gray2}
                            onChangeText={(value) => {setUser({
                                ...user, 
                                companyWebsite : value
                            })}}
                        />
                    </View>
                    <View style={styles.dataInputContainer}>
                        <Text style={styles.titleText}>연매출액</Text>
                        <TextInput
                            style={styles.dataInputText}
                            value={annualRevenue} 
                            placeholder="연매출액을 입력해주세요..."
                            keyboardType='numeric'
                            placeholderTextColor={Colors.gray2}
                            onChangeText={(value) => {setAnnualRevenue(value)}}
                        />
                    </View>
                    <View style={styles.dataInputContainer}>
                        <Text style={styles.titleText}>(선택) 창업 위치</Text>
                        <TextInput
                            style={styles.dataInputText}
                            value={user.startupLocation} 
                            placeholder="창업 위치를 입력해주세요..."
                            placeholderTextColor={Colors.gray2}
                            onChangeText={(value) => {setUser({
                                ...user, 
                                startupLocation : value
                            })}}
                        />
                    </View>
                    </>
                ) : (
                    <View style={styles.dataInputContainer}>
                        <Text style={styles.titleText}>(선택) 창업 위치</Text>
                        <TextInput
                            style={styles.dataInputText}
                            value={user.startupLocation ?? ''} 
                            placeholder="창업 위치를 입력해주세요..."
                            placeholderTextColor={Colors.gray2}
                            onChangeText={(value) => {
                                setUser({
                                    ...user, 
                                    startupLocation : value
                            })}}
                        />
                    </View>
                )}
            </ScrollView>
        </View>
        </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
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
        fontSize : 14,
        fontFamily : Fonts.medium,
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
        fontSize : 16,
        fontFamily : Fonts.bold,
        color : Colors.black2
    },
    selectText : {
        fontSize : 14,
        fontFamily : Fonts.medium,
        color : Colors.black2
    },
    line : {
        borderBottomWidth : 2,
        borderColor : Colors.white2,
    }
})