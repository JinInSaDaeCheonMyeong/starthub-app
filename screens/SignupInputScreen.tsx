import { 
    Keyboard, 
    KeyboardAvoidingView,
    ScrollView, 
    StyleSheet, 
    Text, 
    TouchableWithoutFeedback, 
    useWindowDimensions, 
    View,
    Platform
} from "react-native";
import { Colors } from "../constants/Color";
import BackButton from "../component/BackButton";
import { StackScreenProps } from "@react-navigation/stack";
import { AuthStackParamList } from "../navigation/AuthStack";
import * as Progress from 'react-native-progress';
import InfoScreen from "./onboard/user/InfoScreen";
import CommonButton from "../component/CommonButton";
import TypeScreen from "./onboard/user/TypeScreen";
import { useSignupInputScreen } from "../hooks/auth/signup/input/useSignupInputScreen";
import { Fonts } from "../constants/Fonts";
import { CompositeScreenProps } from "@react-navigation/core";
import { RootStackParamList } from "../navigation/RootStack";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useEffect, useState } from "react";
import EarlyInterestScreen from "./onboard/company/early/EarlyInterestScreen";
import MoneyScreen from "./onboard/company/early/MoneyScreen";
import NameScreen from "./onboard/company/early/NameScreen";
import PersonScreen from "./onboard/company/early/PersonScreen";
import PreInterestScreen from "./onboard/company/pre/PreInterestScreen";

export type SignupInputScreenProps = CompositeScreenProps<
    StackScreenProps<AuthStackParamList, 'SignupInput'>,
    StackScreenProps<RootStackParamList>
>;

const SCREENS = [
    InfoScreen,
    TypeScreen,
    MoneyScreen,
    EarlyInterestScreen,
    NameScreen,
    PersonScreen,
    PreInterestScreen
] as const

const MAXPROGRESS = SCREENS.length;

export default function SignupInputScreen(props : SignupInputScreenProps) {
    const {width} = useWindowDimensions();
    const insets = useSafeAreaInsets()
    const {
        form,
        ui : {
            currentProgress,
            errorText,
            errorVisible,
            disabled
        }, 
        actions : {
            goBack,
            goNext
        }
    } = useSignupInputScreen(props, MAXPROGRESS)

    const CurrentScreen = SCREENS[currentProgress-1]
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);

    useEffect(() => {
        const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
            setKeyboardVisible(true);
        });

        const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
            setKeyboardVisible(false);
        });

        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, []);

    return (
        <KeyboardAvoidingView 
            style={styles.mainContainer}
            behavior='height'
            keyboardVerticalOffset={Platform.OS === 'ios' ? insets.bottom + 20 : 20}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.innerContainer}>
                    <View style={styles.backButton}>
                        <BackButton
                            width={20}
                            height={20}
                            color={Colors.black2}
                            onClick={() => {
                                goBack();
                            }}
                        />
                    </View>
                    <View style={styles.progressBarContainer}>
                        <Text 
                            style={styles.progressBarText}
                        >
                            {`${currentProgress} of ${MAXPROGRESS}`}
                        </Text>
                        <Progress.Bar
                            width={width - 32}
                            progress={currentProgress / MAXPROGRESS}
                            color={Colors.primary}
                            borderColor={Colors.white2}
                            unfilledColor={Colors.white2}
                            borderWidth={0}
                            height={8}
                        />
                    </View>
                    <ScrollView 
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                        nestedScrollEnabled={true}
                    >
                        <CurrentScreen 
                            {...form}
                        />
                    </ScrollView>
                    <View style={[styles.buttonContainer, ]}
                    >
                        {errorVisible && <Text style={styles.errorText}>{errorText}</Text>}
                        <CommonButton
                            title={currentProgress == MAXPROGRESS ? "기업 정보 입력" : "다음"}
                            onPress={() => {
                                goNext();
                            }}
                            disabled={disabled}
                        />
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    mainContainer : {
        flex : 1,
    },
    innerContainer: {
        flex: 1,
        paddingHorizontal: 16,
    },
    scrollContent: {
        flexGrow: 1,
    },
    progressBarContainer : {
        width : "100%",
        marginBottom : 36,
        gap : 8,
        alignItems : "flex-end",
    },
    buttonContainer : {
        paddingTop: 12,
        paddingBottom: 16,
        gap: 8,
    },
    errorText : {
        textAlign : "center",
        color : Colors.error,
        fontSize : 12,
        fontFamily : Fonts.semiBold
    },
    backButton: {
        marginTop: 22,
    },
    progressBarText : {
        color : Colors.black2,
        fontFamily : Fonts.semiBold
    }
})