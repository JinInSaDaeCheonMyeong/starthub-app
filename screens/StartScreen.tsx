import {StackScreenProps} from "@react-navigation/stack";
import {AuthStackParamList} from "../navigation/AuthStack";
import {RootStackParamList} from "../navigation/RootStack";
import {CompositeScreenProps} from "@react-navigation/native";
import {
    Image,
    Platform,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import {Colors} from "../constants/Color";
import React from "react";
import BackButton from "../component/BackButton";
import useGoogleLogin from "../hooks/useGoogleLogin";
import {Fonts} from "../constants/Fonts";
import {ShowToast, ToastType} from "../util/ShowToast";


type StartScreenProps = CompositeScreenProps<
    StackScreenProps<AuthStackParamList, 'Start'>,
    StackScreenProps<RootStackParamList>
>;

export default function StartScreen({navigation}: StartScreenProps) {
    const platform = Platform.select({
        ios: "ios",
        android: "android"
    })
    const { request, promptAsync } = useGoogleLogin( isFirst => {
        console.log("isFirst", isFirst);
            if (isFirst){
                navigation.navigate("SignupInput")
            }
            else {
                navigation.navigate('HomeStack');
            }
        }
    );

    const authItems = [
        {
            title: 'StartHub 이메일',
            icon: require('../assets/logos/starthub_logo.png'),
            onPress: async () => {
                await navigation.navigate("Signin")
            },
            request : true
        },
        {
            title: 'Google',
            icon: require('../assets/logos/google_logo.png'),
            onPress: async () => {
                if (platform == "ios") {
                    await promptAsync();
                }
                else {
                    ShowToast(
                        "안내",
                        "아직 개발 중인 기능입니다.",
                        ToastType.INFO
                    )
                }
            },
            request: request
        },
        {
            title: '네이버',
            icon: require('../assets/logos/naver_logo.png'),
            onPress: async () => {
                ShowToast(
                    "안내",
                    "아직 개발 중인 기능입니다.",
                    ToastType.INFO
                )
            },
            request: true
        },
        {
            title: 'Apple',
            icon: require('../assets/logos/apple_logo.png'),
            onPress: async () => {
                ShowToast(
                    "안내",
                    "아직 개발 중인 기능입니다.",
                    ToastType.INFO
                )
            },
            request: true
        }
    ];
    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.backButton}>
                    <BackButton onClick={() => navigation.goBack()} width={20} height={20} color={Colors.black2}/>
                </View>
                <Text style={styles.topText}>
                    안녕하세요!{"\n"}계정을{" "}
                    <Text style={{
                        color: Colors.primary}}>
                        선택
                    </Text>
                    해주세요.
                </Text>
                <View style={styles.itemContainer}>
                    {
                        authItems.map((item, index) => (
                            <TouchableOpacity style={styles.authItem} key={index} onPress={item.onPress} disabled={!item.request}>
                                <Image source={item.icon} style={styles.itemIcon}/>
                                <Text style={styles.itemText}>{item.title}로 시작하기</Text>
                            </TouchableOpacity>
                        ))
                    }
                </View>
                <StatusBar barStyle="dark-content" backgroundColor={Colors.white1}/>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        margin : 16
    },
    backButton: {
        marginTop: 22,
    },
    topText: {
        marginTop: 74,
        alignItems: 'center',
        fontSize: 24,
        fontFamily : Fonts.bold,
        textAlign: 'center',
        color: Colors.black2,
    },
    authItem: {
        height: 60,
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: Colors.gray3,
        borderRadius: 8,
        marginBottom: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    itemContainer: {
        marginTop: 68,
    },
    itemIcon: {
        width: 20,
        height: 20,
        marginLeft: 22,
        resizeMode: 'contain'
    },
    itemText: {
        flex: 1,
        fontSize: 16,
        fontFamily : Fonts.medium,
        textAlign: 'center',
        color: Colors.black2,
        marginRight: 42,
    },
})