import { Dispatch, SetStateAction } from "react";
import { ScrollView, StyleSheet, Text, TextInput, TouchableWithoutFeedback, Keyboard, View } from "react-native";
import { GetMeResponse } from "../../../type/user/user.type";
import { Colors } from "../../../constants/Color";
import { Fonts } from "../../../constants/Fonts";
import ProfileTextField from "./ProfileTextField";
import SegmentOptionGroup from "./SegmentOptionGroup";
import NameIcon from "../../../assets/icons/profile/name.svg";
import GenderIcon from "../../../assets/icons/profile/gender.svg";
import BirthIcon from "../../../assets/icons/profile/birth.svg";
import BackpackIcon from "../../../assets/icons/profile/backpack.svg";
import CompanyIcon from "../../../assets/icons/profile/company.svg";
import IntroduceIcon from "../../../assets/icons/profile/introduce.svg";
import PeopleIcon from "../../../assets/icons/profile/people.svg";
import LocationIcon from "../../../assets/icons/profile/location.svg";
import SiteIcon from "../../../assets/icons/profile/link.svg";
import MoneyIcon from "../../../assets/icons/profile/money.svg";

type ProfileUser = GetMeResponse["data"];
type SelectGender = "male" | "female" | "none" | "other";

type EditProfileFormProps = {
    user: ProfileUser;
    year: string;
    month: string;
    day: string;
    numberPerson: string;
    annualRevenue: string;
    selectGender: SelectGender;
    selectStartupStatus: boolean;
    setUser: Dispatch<SetStateAction<ProfileUser>>;
    setYear: (value: string) => void;
    setMonth: (value: string) => void;
    setDay: (value: string) => void;
    setNumberPerson: (value: string) => void;
    setAnnualRevenue: (value: string) => void;
    setSelectGender: Dispatch<SetStateAction<SelectGender>>;
    setSelectStartupStatus: Dispatch<SetStateAction<boolean>>;
};

const iconProps = { width: 15, height: 15 };

export default function EditProfileForm({
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
}: EditProfileFormProps) {
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView
                style={styles.dataContainer}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={styles.scrollContent}
            >
                <ProfileTextField
                    icon={<NameIcon {...iconProps} />}
                    label="이름"
                    value={user.username}
                    placeholder="이름을 입력해주세요..."
                    onChangeText={(value) => setUser({ ...user, username: value })}
                />

                <View style={styles.dataInputContainer}>
                    <View style={styles.iconBox}>
                        <GenderIcon {...iconProps} />
                        <Text style={styles.titleText}>성별</Text>
                    </View>
                    <SegmentOptionGroup
                        selectedValue={selectGender}
                        onSelect={setSelectGender}
                        options={[
                            { label: "남", value: "male" },
                            { label: "여", value: "female" },
                            { label: "선택 안함", value: "other" },
                        ]}
                    />
                </View>

                <View style={styles.dataInputContainer}>
                    <View style={styles.iconBox}>
                        <BirthIcon {...iconProps} />
                        <Text style={styles.titleText}>생년월일</Text>
                    </View>
                    <View style={styles.row}>
                        <TextInput
                            style={styles.birthInput}
                            inputMode="numeric"
                            maxLength={4}
                            value={year}
                            placeholder="YYYY"
                            placeholderTextColor={Colors.gray2}
                            onChangeText={setYear}
                        />
                        <TextInput
                            style={styles.birthInput}
                            inputMode="numeric"
                            maxLength={2}
                            value={month}
                            placeholder="MM"
                            placeholderTextColor={Colors.gray2}
                            onChangeText={setMonth}
                        />
                        <TextInput
                            style={styles.birthInput}
                            inputMode="numeric"
                            maxLength={2}
                            value={day}
                            placeholder="DD"
                            placeholderTextColor={Colors.gray2}
                            onChangeText={setDay}
                        />
                    </View>
                </View>

                <View style={styles.dataInputContainer}>
                    <View style={styles.iconBox}>
                        <BackpackIcon {...iconProps} />
                        <Text style={styles.titleText}>창업 형태</Text>
                    </View>
                    <SegmentOptionGroup
                        selectedValue={selectStartupStatus}
                        onSelect={setSelectStartupStatus}
                        options={[
                            { label: "초기 창업", value: true },
                            { label: "예비 창업", value: false },
                        ]}
                    />
                </View>

                <View style={styles.line} />

                {selectStartupStatus ? (
                    <EarlyStartupFields
                        user={user}
                        numberPerson={numberPerson}
                        annualRevenue={annualRevenue}
                        setUser={setUser}
                        setNumberPerson={setNumberPerson}
                        setAnnualRevenue={setAnnualRevenue}
                    />
                ) : (
                    <ProfileTextField
                        label="기업 위치"
                        value={user.startupLocation ?? ""}
                        placeholder="창업 위치를 입력해주세요..."
                        onChangeText={(value) => setUser({ ...user, startupLocation: value })}
                    />
                )}
            </ScrollView>
        </TouchableWithoutFeedback>
    );
}

function EarlyStartupFields({
    user,
    numberPerson,
    annualRevenue,
    setUser,
    setNumberPerson,
    setAnnualRevenue,
}: {
    user: ProfileUser;
    numberPerson: string;
    annualRevenue: string;
    setUser: Dispatch<SetStateAction<ProfileUser>>;
    setNumberPerson: (value: string) => void;
    setAnnualRevenue: (value: string) => void;
}) {
    return (
        <>
            <ProfileTextField
                icon={<CompanyIcon {...iconProps} />}
                label="기업명"
                value={user.companyName}
                placeholder="기업명을 입력해주세요..."
                onChangeText={(value) => setUser({ ...user, companyName: value })}
            />
            <ProfileTextField
                icon={<IntroduceIcon {...iconProps} />}
                label="기업 소개"
                value={user.companyDescription}
                placeholder="기업 소개를 해주세요..."
                multiline
                textAlignVertical="top"
                scrollEnabled={false}
                onChangeText={(value) => setUser({ ...user, companyDescription: value })}
            />
            <ProfileTextField
                icon={<PeopleIcon {...iconProps} />}
                label="기업 인원"
                value={numberPerson}
                placeholder="기업 인원을 입력해주세요..."
                keyboardType="numeric"
                onChangeText={setNumberPerson}
            />
            <ProfileTextField
                icon={<LocationIcon {...iconProps} />}
                label="기업 위치"
                value={user.startupLocation}
                placeholder="창업 위치를 입력해주세요..."
                onChangeText={(value) => setUser({ ...user, startupLocation: value })}
            />
            <ProfileTextField
                icon={<SiteIcon {...iconProps} />}
                label="기업 사이트"
                value={user.companyWebsite}
                keyboardType="url"
                placeholder="기업 사이트을 입력해주세요..."
                autoCapitalize="none"
                onChangeText={(value) => setUser({ ...user, companyWebsite: value })}
            />
            <ProfileTextField
                icon={<MoneyIcon {...iconProps} />}
                label="연매출액"
                value={annualRevenue}
                placeholder="연매출액을 입력해주세요..."
                keyboardType="numeric"
                onChangeText={setAnnualRevenue}
            />
        </>
    );
}

const baseInput = {
    fontSize: 14,
    fontFamily: Fonts.reqular,
    color: Colors.black1,
    backgroundColor: Colors.white1,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.gray3,
    padding: 16,
} as const;

const styles = StyleSheet.create({
    dataContainer: {
        flex: 1,
        paddingHorizontal: 16,
    },
    scrollContent: {
        gap: 24,
        paddingBottom: 16,
    },
    dataInputContainer: {
        gap: 12,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 16,
    },
    birthInput: {
        ...baseInput,
        flex: 1,
        textAlign: "center",
    },
    titleText: {
        fontSize: 16,
        fontFamily: Fonts.bold,
        color: Colors.black2,
    },
    line: {
        borderBottomWidth: 1,
        borderColor: Colors.gray3,
    },
    iconBox: {
        flexDirection: "row",
        gap: 4,
        alignItems: "center",
    },
});
