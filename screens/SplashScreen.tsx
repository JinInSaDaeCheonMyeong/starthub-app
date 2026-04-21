import { CompositeScreenProps } from "@react-navigation/native";
import { StackScreenProps } from "@react-navigation/stack";
import { AuthStackParamList } from "../navigation/AuthStack";
import { RootStackParamList } from "../navigation/RootStack";
import { StyleSheet, View } from "react-native";
import { useEffect } from "react";
import { getAccToken } from "../util/token";
import { getMe } from "../api/user";
import { Image } from "expo-image";

type SplashScreenProps = CompositeScreenProps<
    StackScreenProps<AuthStackParamList, "Splash">,
    StackScreenProps<RootStackParamList>
>;

export default function SplashScreen({ navigation }: SplashScreenProps) {
    useEffect(() => {
        const autoLogin = async () => {
            const token = await getAccToken();

            await new Promise((resolve) => setTimeout(resolve, 1200));

            if (!token) {
                navigation.replace("Welcome");
                return;
            }

            try {
                const { data } = await getMe();
                const startupFields = data.startupFields ?? [];

                if (data.username && startupFields.length > 0) {
                    navigation.replace("HomeStack");
                } else {
                    navigation.replace("SignupInput");
                }
            } catch {
                navigation.replace("Welcome");
            }
        };

        autoLogin();
    }, []);

    return (
        <View style={styles.container}>
            <Image
                source={require("../assets/images/splash_icon.png")}
                style={styles.logo}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    logo: {
        width: 200,
        height: 200
    }
});
