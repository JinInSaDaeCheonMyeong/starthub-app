import { CompositeScreenProps } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../navigation/AuthStack";
import { RootStackParamList } from "../navigation/RootStack";
import { StyleSheet, View } from "react-native";
import { useEffect } from "react";
import { getAccToken } from "../util/token";
import { getMe } from "../api/user";
import { Image } from "expo-image";
import { useProfileStore } from "../store/profileStore";

type SplashScreenProps = CompositeScreenProps<
    NativeStackScreenProps<AuthStackParamList, "Splash">,
    NativeStackScreenProps<RootStackParamList>
>;

export default function SplashScreen({ navigation }: SplashScreenProps) {
    const setProfileData = useProfileStore((state) => state.setProfileData);

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
                setProfileData(data);
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
    }, [navigation, setProfileData]);

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
