import { StyleSheet, Text, TextInput, View } from "react-native";
import { Colors } from "../../../../constants/Color";
import DateInputText from "../../../../component/auth/DateInputText";
import { DayList, MonthList, YearList } from "../.../../../../../constants/DateNumber";
import { Fonts } from "../../../../constants/Fonts";
import { useState } from "react";

type PersonScreenProps = {
    personNumber : string,
    companySite : string
    setPersonNumber : (personNumber : string) => void,
    setCompanySite : (companySite : string) => void,
}

export default function PersonScreen(props : PersonScreenProps) {

    return(
        <View style={styles.mainContainer}>
            <View style={styles.inputBox}>
                <View style={styles.textBox}>
                    <Text style={styles.subText}>기업 인원을 입력해주세요!</Text>
                    <Text style={styles.mainText}>기업의 총 인원 수가 궁금합니다!</Text>
                </View>
                <TextInput
                    style={styles.inputText}
                    placeholder="기업 인원을 입력해주세요..."
                    keyboardType='numeric'
                    placeholderTextColor={Colors.gray3}
                    value={props.personNumber}
                    onChangeText={(s) => {props.setPersonNumber(s)}}
                />
            </View>
            <View style={styles.inputBox}>
                <View style={styles.textBox}>
                    <Text style={styles.subText}>사이트가 있다면 입력해주세요!</Text>
                    <Text style={styles.mainText}>(선택) 기업의 사이트가 궁금합니다!</Text>
                </View>
                <TextInput
                    style={styles.inputText}
                    placeholder="기업 사이트를 입력해주세요..."
                    placeholderTextColor={Colors.gray3}
                    value={props.companySite}
                    onChangeText={(s) => {props.setCompanySite(s)}}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer : {
        flex : 1,
        gap : 56,
        overflow : "hidden"
    },
    inputBox : {
        gap : 16,
    },
    textBox : {
        gap : 4
    },
    subText : {
        fontSize : 16,
        fontFamily : Fonts.medium,
        color : Colors.black2
    },
    mainText : {
        fontSize : 20,
        fontFamily : Fonts.bold,
        color : Colors.black2
    },
    inputText : {
        fontSize : 18,
        color : Colors.black2,
        fontFamily : Fonts.medium
    },
    birthDateContainer : {
        flex : 1,
        flexDirection : "row",
        justifyContent : "space-between",
        gap : 16,
    },
    birthInput : {
        flex : 1,
        paddingHorizontal : 16,
        paddingVertical : 12,
        backgroundColor : Colors.white2,
        color : Colors.black2,
        fontSize : 16,
        fontFamily : Fonts.medium,
        borderRadius : 8,
        textAlign : "center"
    }
})