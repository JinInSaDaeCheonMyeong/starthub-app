import { KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import SubHeaderBar from "../../component/home/SubHeaderBar";
import EditProfileForm from "../../component/system/editProfile/EditProfileForm";
import useEditProfileScreen from "../../hooks/system/useEditProfileScreen";
import { SystemStackParamList } from "../../navigation/SystemStack";
import { Colors } from "../../constants/Color";

export type ProfileScreenProps = NativeStackScreenProps<SystemStackParamList, "EditProfile">;

export default function EditProfileScreen(props: ProfileScreenProps) {
    const {
        form: {
            user,
            year,
            month,
            day,
            numberPerson,
            annualRevenue,
            selectGender,
            selectStartupStatus,
            setUser,
            setYear,
            setMonth,
            setDay,
            setNumberPerson,
            setAnnualRevenue,
            setSelectGender,
            setSelectStartupStatus,
        },
        ui: {
            insets,
        },
        action: {
            sendEditProfile,
            goBack,
        },
    } = useEditProfileScreen(props);

    return (
        <KeyboardAvoidingView
            style={styles.keyboardAvoidingView}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={insets.top}
            contentContainerStyle={styles.keyboardContent}
        >
            <View style={styles.mainContainer}>
                <SubHeaderBar
                    title="프로필 수정"
                    handleBackPress={goBack}
                    subIcon="EditProfile"
                    handleSubPress={sendEditProfile}
                />
                <EditProfileForm
                    user={user}
                    year={year}
                    month={month}
                    day={day}
                    numberPerson={numberPerson}
                    annualRevenue={annualRevenue}
                    selectGender={selectGender}
                    selectStartupStatus={selectStartupStatus}
                    setUser={setUser}
                    setYear={setYear}
                    setMonth={setMonth}
                    setDay={setDay}
                    setNumberPerson={setNumberPerson}
                    setAnnualRevenue={setAnnualRevenue}
                    setSelectGender={setSelectGender}
                    setSelectStartupStatus={setSelectStartupStatus}
                />
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    keyboardAvoidingView: {
        flex: 1,
    },
    keyboardContent: {
        backgroundColor: Colors.black2,
    },
    mainContainer: {
        flex: 1,
    },
});
