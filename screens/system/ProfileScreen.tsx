import { StackScreenProps } from "@react-navigation/stack";
import { SystemStackParamList } from "../../navigation/SystemStack";
import { ImageBackground, Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { Colors } from "../../constants/Color";
import { Fonts } from "../../constants/Fonts";
import StartupStatus from "../../constants/StartupStatus";
import useProfileScreen from "../../hooks/system/useProfileScreen";
import SubHeaderBar from "../../component/home/SubHeaderBar";

export type ProfileScreenProps = StackScreenProps<SystemStackParamList, 'Profile'>

export default function ProfileScreen(props : ProfileScreenProps){
    const {
        form : {
            profileData
        },
        ui : {
            profileList,
            earlyStartupList,
            preStartupList,
            isWebLink
        },
        action : {
            goBack,
            goEditProfile,
            goWeb
        }
    } = useProfileScreen(props)
    return (
        <View
            style={[styles.mainContainer]}
        >
            <SubHeaderBar
                title="프로필"
                handleBackPress={goBack}
                subIcon='Profile'
                handleSubPress={goEditProfile}
            />
            <ScrollView 
                style={styles.scorllContainer}
                contentContainerStyle={{
                    gap : 24, 
                    paddingBottom : Platform.select({ios : 16, android : 32})
                }}
                showsVerticalScrollIndicator={false}
            >
                <View style={{gap : 4, marginBottom : 8}}>
                    <Text style={{fontFamily : Fonts.semiBold, fontSize : 16, color : Colors.black1}}>“어제의 꿈은 오늘의 희망이며 내일의 현실이다.”</Text>
                    <Text style={{fontFamily : Fonts.bold, fontSize : 20, color : Colors.primary}}>오늘도 잘 부탁드립니다!</Text>
                </View>
                {profileList.map(({label, data, icon}, index) => (
                    <View style={styles.labelContainer} key={index}>
                        <View style={styles.dataContainer}>
                            {icon}
                            <Text style={styles.labelText}>{label}</Text>
                        </View>
                        <Text style={styles.dataText}>{data}</Text>
                    </View>
                ))}
                <View style={styles.line}/>
                {profileData.startupStatus === StartupStatus.EARLY_STAGE ?
                    earlyStartupList.map(({label, data, icon}, index) => (
                        <View style={styles.labelContainer} key={index}>
                            <View style={styles.dataContainer}>
                                {icon}
                                <Text style={styles.labelText}>{label}</Text>
                            </View>
                            {
                                isWebLink(label) ? (
                                    <Text 
                                    onPress={() => {goWeb(data)}} 
                                    style={[
                                        styles.dataText, 
                                        !data.includes("내용이 없습니다") && { 
                                            color : Colors.info, 
                                            textDecorationLine : "underline" 
                                        }]}
                                    >
                                    {data}
                                    </Text>
                                ) : (
                                    <Text style={styles.dataText}>{data}</Text>
                                )
                            }
                        </View>
                    )) : 
                    preStartupList.map(({label, data}, index) => (
                        <View style={styles.labelContainer} key={index}>
                            <Text style={styles.labelText}>{label}</Text>
                            <Text style={styles.dataText}>{data}</Text>
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
        flexDirection : 'row',
        justifyContent : 'space-between',
        alignItems : 'center',
        gap : 12
    },
    line : {
        width : "100%",
        borderBottomWidth : 1,
        borderColor : Colors.gray3
    },
    dataContainer : {
        flexDirection : 'row',
        gap : 8,
        alignItems : 'center'
    },
    labelText : {
        fontSize : 16,
        fontFamily : Fonts.bold,
        color : Colors.black2
    },
    dataText : {
        fontSize : 14,
        fontFamily : Fonts.reqular,
        color : Colors.black1
    }
})