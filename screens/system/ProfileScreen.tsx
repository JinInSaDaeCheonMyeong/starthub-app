import { StackScreenProps } from "@react-navigation/stack";
import { SystemStackParamList } from "../../navigation/SystemStack";
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from "react-native";
import BackButton from "../../component/BackButton";
import EditIcon from "../../assets/icons/header/edit.svg"
import { Colors } from "../../constants/Color";
import { Shadow } from "react-native-shadow-2";
import { Fonts } from "../../constants/Fonts";

type ProfileScreenProps = StackScreenProps<SystemStackParamList, 'Profile'>

export default function ProfileScreen({navigation, route : {params}} : ProfileScreenProps){
    const {width} = useWindowDimensions()
    const genderMap = new Map<string, string>([['MALE', "남"], ["FEMALE", "여"]])
    const profileList = [
        {label : '이름', data : params.username ?? "내용을 불러올 수 없습니다"},
        {label : '소개', data : params.introduction ?? "내용을 불러올 수 없습니다"},
        {label : '성별', data : genderMap.get(params.gender) ?? "내용을 불러올 수 없습니다"},
        {label : '생년월일', data : new Date(params.birth).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' }) ?? "내용을 불러올 수 없습니다"},
        {label : '이메일', data : params.email ?? "내용을 불러올 수 없습니다"},
    ]
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
                    onPress={()=>{navigation.navigate('EditProfile', params)}}
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
                            source={{uri : params.profileImage}}
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