import { StackScreenProps } from "@react-navigation/stack";
import { SystemStackParamList } from "../../navigation/SystemStack";
import { Platform, ScrollView, StyleSheet, Text, View } from "react-native";
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