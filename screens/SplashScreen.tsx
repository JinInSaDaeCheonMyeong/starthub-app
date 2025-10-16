import {CompositeScreenProps} from "@react-navigation/native";
import {StackScreenProps} from "@react-navigation/stack";
import {AuthStackParamList} from "../navigation/AuthStack";
import {RootStackParamList} from "../navigation/RootStack";
import {StyleSheet, View, Image} from "react-native";
import {useEffect} from "react";
import {getAccToken} from "../util/token";
import {getMe} from "../api/user";

type SplashScreenProps = CompositeScreenProps<
    StackScreenProps<AuthStackParamList, "Splash">,
    StackScreenProps<RootStackParamList>
>;

export default function SplashScreen({ navigation }: SplashScreenProps) {

    useEffect(() => {
        async function autoLogin() {
            const token = await getAccToken();
            console.log(token);

            await new Promise(resolve => setTimeout(resolve, 1200));

            if (token != null) {
                try {
                    const response = await (await getMe()).data;
                    console.log("response", response);
                    if (response.username) {
                        navigation.replace("HomeStack" as any);
                    } else {
                        navigation.replace("SignupInput");
                    }
                } catch {
                    navigation.replace("Welcome");
                }
            } else {
                navigation.replace("Welcome");
            }
        }
        autoLogin();
    }, []);


    return (
        <View style={styles.container}>
            <Image
                source={require("../assets/images/splash_icon.png")}
                style={{
                    width: 200,
                    height: 200
                }}
            />
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    }
})