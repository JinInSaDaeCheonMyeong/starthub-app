import { StyleSheet, Text, TextInput, View } from "react-native";
import { Colors } from "../../../../constants/Color";
import { Fonts } from "../../../../constants/Fonts";

type NameScreenProps = {
    companyName : string,
    companyDescription : string
    setCompanyName : (companyName : string) => void,
    setCompanyDescription : (companyDescription : string) => void,
}

export default function NameScreen(props : NameScreenProps) {

    return(
        <View style={styles.mainContainer}>
            <View style={styles.inputBox}>
                <View style={styles.textBox}>
                    <Text style={styles.subText}>기업명을 입력해주세요!</Text>
                    <Text style={styles.mainText}>당신의 기업명이 궁금합니다!</Text>
                </View>
                <TextInput
                    style={styles.inputText}
                    placeholder="기업명을 입력해주세요..."
                    placeholderTextColor={Colors.gray3}
                    value={props.companyName}
                    onChangeText={(s) => {props.setCompanyName(s)}}
                />
            </View>
            <View style={styles.inputBox}>
                <View style={styles.textBox}>
                    <Text style={styles.subText}>기업 설명를 입력해주세요!</Text>
                    <Text style={styles.mainText}>(선택) 어떤 기업인지 궁금합니다!</Text>
                </View>
                <TextInput
                    style={styles.inputText}
                    placeholder="기업 설명을 입력해주세요..."
                    placeholderTextColor={Colors.gray3}
                    value={props.companyDescription}
                    onChangeText={(s) => {props.setCompanyDescription(s)}}
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