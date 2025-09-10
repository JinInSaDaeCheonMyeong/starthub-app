import {Dimensions, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import { useState } from "react";
import { Colors } from "../../../constants/Color";
import { Fonts } from "../../../constants/Fonts";
import StartupType from "../../../constants/StartupType";

type TypeScreenProps = {
    gender : string,
    setGender : (value : string) => void
    startupType : string,
    setStartupType : (value : StartupType) => void
}

export default function TypeScreen(props : TypeScreenProps) {

    const [selectGender, setSelectGender] = useState(props.gender === "MALE" ? true : false)
    const [selectType, setSelectType] = useState(props.startupType === "초기 창업" ? true : false)

    return(
        <View style={styles.mainContainer}>
            <View style={styles.inputBox}>
                <View style={styles.textBox}>
                    <Text style={styles.subText}>회원님의 성별을 선택해주세요!</Text>
                    <Text style={styles.mainText}>당신의 성별이 궁금합니다!</Text>
                </View>
                <View style={styles.genderContainer}>
                    <TouchableOpacity
                        onPress={() => {
                            props.setGender("MALE")
                            setSelectGender(true)
                        }}
                        style={[styles.genderBox, {borderColor : selectGender ? Colors.primary : Colors.white2 }]}
                    >
                        <Text style={[styles.selectText, {color : selectGender ? Colors.primary : Colors.gray2 }]}>남</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        onPress={() => {
                            props.setGender("FEMALE")
                            setSelectGender(false)
                        }}
                        style={[styles.genderBox, {borderColor : !selectGender ? Colors.primary : Colors.white2 }]}
                    >
                        <Text style={[styles.selectText, {color : !selectGender ? Colors.primary : Colors.gray2 }]}>여</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.inputBox}>
                <View style={styles.textBox}>
                    <Text style={styles.subText}>창업 형태를 선택해주세요!</Text>
                    <Text style={styles.mainText}>더 적합한 공고를 찾아 드릴게요!</Text>
                </View>
                <View style={styles.genderContainer}>
                    <TouchableOpacity
                        onPress={() => {
                            props.setStartupType(StartupType.EARLY_STARTUP)
                            setSelectType(true)
                        }}
                        style={[styles.genderBox, {borderColor : selectType ? Colors.primary : Colors.white2 }]}
                    >
                        <Text style={[styles.selectText, {color : selectType ? Colors.primary : Colors.gray2 }]}>초기 창업</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        onPress={() => {
                            props.setStartupType(StartupType.PRE_STARTUP)
                            setSelectType(false)
                        }}
                        style={[styles.genderBox, {borderColor : !selectType ? Colors.primary : Colors.white2 }]}
                    >
                        <Text style={[styles.selectText, {color : !selectType ? Colors.primary : Colors.gray2 }]}>예비 창업</Text>
                    </TouchableOpacity>
                </View>
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
    inputBox : {
        gap : 16,
    },
    genderBox : {
        flex : 1,
        padding  : 16,
        backgroundColor : Colors.white2,
        borderRadius : 8,
        alignItems : "center",
        borderWidth : 1,
        borderStyle : "solid",
    },
    selectText : {
        fontFamily : Fonts.medium,
        fontSize : 16,
        color : Colors.gray2,
    },
    genderContainer : {
        flexDirection : "row",
        justifyContent : "space-between",
        gap : 16
    },
})