import { ScrollView, StyleSheet, View } from "react-native";
import { Dispatch, SetStateAction } from "react";
import SearchBar from "../home/SearchBar";
import DropDown from "../DropDown";
import { BusinessExperienceItems } from "../../constants/BusinessExperienceItems";
import { Colors } from "../../constants/Color";
import { Fonts } from "../../constants/Fonts";
import { RegionItems } from "../../constants/RegionItems";
import { SupportFieldItems } from "../../constants/SupportFieldItems";
import { TargetAgeItems } from "../../constants/TargetAgeItems";

type NoticeSearchFiltersProps = {
    title: string;
    setTitle: (value: string) => void;
    isNatural: boolean;
    dropDownMargin: number;
    supportField: string;
    setSupportField: (value: string) => void;
    supportFieldOpen: boolean;
    setSupportFieldOpen: Dispatch<SetStateAction<boolean>>;
    region: string;
    setRegion: (value: string) => void;
    regionOpen: boolean;
    setRegionOpen: Dispatch<SetStateAction<boolean>>;
    targetAge: string;
    setTargetAge: (value: string) => void;
    targetAgeOpen: boolean;
    setTargetAgeOpen: Dispatch<SetStateAction<boolean>>;
    businessExperience: string;
    setBusinessExperience: (value: string) => void;
    businessExperienceOpen: boolean;
    setBusinessExperienceOpen: Dispatch<SetStateAction<boolean>>;
};

function toggleFilterValue(currentValue: string, nextValue: string, setValue: (value: string) => void) {
    setValue(nextValue === currentValue ? "" : nextValue);
}

function getNextOpen(value: SetStateAction<boolean>, currentOpen: boolean) {
    return typeof value === "function" ? value(currentOpen) : value;
}

export default function NoticeSearchFilters({
    title,
    setTitle,
    isNatural,
    dropDownMargin,
    supportField,
    setSupportField,
    supportFieldOpen,
    setSupportFieldOpen,
    region,
    setRegion,
    regionOpen,
    setRegionOpen,
    targetAge,
    setTargetAge,
    targetAgeOpen,
    setTargetAgeOpen,
    businessExperience,
    setBusinessExperience,
    businessExperienceOpen,
    setBusinessExperienceOpen,
}: NoticeSearchFiltersProps) {
    const setOnlySupportFieldOpen: Dispatch<SetStateAction<boolean>> = (value) => {
        const nextOpen = getNextOpen(value, supportFieldOpen);
        if (nextOpen) {
            setRegionOpen(false);
            setTargetAgeOpen(false);
            setBusinessExperienceOpen(false);
        }
        setSupportFieldOpen(nextOpen);
    };

    const setOnlyRegionOpen: Dispatch<SetStateAction<boolean>> = (value) => {
        const nextOpen = getNextOpen(value, regionOpen);
        if (nextOpen) {
            setSupportFieldOpen(false);
            setTargetAgeOpen(false);
            setBusinessExperienceOpen(false);
        }
        setRegionOpen(nextOpen);
    };

    const setOnlyTargetAgeOpen: Dispatch<SetStateAction<boolean>> = (value) => {
        const nextOpen = getNextOpen(value, targetAgeOpen);
        if (nextOpen) {
            setSupportFieldOpen(false);
            setRegionOpen(false);
            setBusinessExperienceOpen(false);
        }
        setTargetAgeOpen(nextOpen);
    };

    const setOnlyBusinessExperienceOpen: Dispatch<SetStateAction<boolean>> = (value) => {
        const nextOpen = getNextOpen(value, businessExperienceOpen);
        if (nextOpen) {
            setSupportFieldOpen(false);
            setRegionOpen(false);
            setTargetAgeOpen(false);
        }
        setBusinessExperienceOpen(nextOpen);
    };

    return (
        <View>
            <View style={styles.searchBar}>
                <SearchBar onPress={setTitle} value={title} />
            </View>
            {!isNatural && (
                <ScrollView
                    style={styles.dropDownScroll}
                    keyboardShouldPersistTaps="handled"
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    nestedScrollEnabled
                >
                    <View style={[styles.dropDownWrapper, { paddingBottom: dropDownMargin }]}>
                        <DropDown
                            placeholderStyle={styles.dropDownPlaceHolder}
                            labelStyle={styles.dropDownLabel}
                            textStyle={styles.dropDownText}
                            open={supportFieldOpen}
                            value={supportField}
                            items={SupportFieldItems}
                            placeholder="지원분야"
                            setOpen={setOnlySupportFieldOpen}
                            minWidth={90}
                            maxWidth={150}
                            setValue={(value) => toggleFilterValue(supportField, value, setSupportField)}
                        />
                    </View>
                    <View style={styles.dropDownWrapper}>
                        <DropDown
                            placeholderStyle={styles.dropDownPlaceHolder}
                            labelStyle={styles.dropDownLabel}
                            textStyle={styles.dropDownText}
                            open={regionOpen}
                            value={region}
                            items={RegionItems}
                            placeholder="지역"
                            setOpen={setOnlyRegionOpen}
                            minWidth={70}
                            maxWidth={120}
                            setValue={(value) => toggleFilterValue(region, value, setRegion)}
                        />
                    </View>
                    <View style={styles.dropDownWrapper}>
                        <DropDown
                            placeholderStyle={styles.dropDownPlaceHolder}
                            labelStyle={styles.dropDownLabel}
                            textStyle={styles.dropDownText}
                            open={targetAgeOpen}
                            value={targetAge}
                            items={TargetAgeItems}
                            placeholder="연령"
                            setOpen={setOnlyTargetAgeOpen}
                            minWidth={150}
                            maxWidth={3000}
                            setValue={(value) => toggleFilterValue(targetAge, value, setTargetAge)}
                        />
                    </View>
                    <View style={styles.dropDownLastWrapper}>
                        <DropDown
                            placeholderStyle={styles.dropDownPlaceHolder}
                            labelStyle={styles.dropDownLabel}
                            textStyle={styles.dropDownText}
                            open={businessExperienceOpen}
                            value={businessExperience}
                            items={BusinessExperienceItems}
                            placeholder="창업업력"
                            setOpen={setOnlyBusinessExperienceOpen}
                            minWidth={90}
                            maxWidth={150}
                            setValue={(value) => toggleFilterValue(businessExperience, value, setBusinessExperience)}
                        />
                    </View>
                </ScrollView>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    searchBar: {
        paddingStart: 16,
    },
    dropDownScroll: {
        position: "absolute",
        zIndex: 999,
        paddingTop: 60,
    },
    dropDownWrapper: {
        marginStart: 16,
    },
    dropDownLastWrapper: {
        marginStart: 16,
        marginEnd: 16,
    },
    dropDownPlaceHolder: {
        color: Colors.gray2,
        fontSize: 14,
        fontFamily: Fonts.medium,
    },
    dropDownText: {
        color: Colors.black2,
        fontSize: 14,
        fontFamily: Fonts.medium,
    },
    dropDownLabel: {
        color: Colors.black2,
        fontSize: 14,
        fontFamily: Fonts.medium,
    },
});
