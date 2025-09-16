import { StyleSheet, Text, TextInput, View } from "react-native";
import { Colors } from "../../../../constants/Color";
import { Fonts } from "../../../../constants/Fonts";

type MoneyScreenProps = {
    annualRevenue: string;
    startupLocation: string;
    setAnnualRevenue: (annualRevenue: string) => void;
    setStartupLocation: (startupLocation: string) => void;
};

export default function MoneyScreen(props : MoneyScreenProps) {

    return(
        <View style={styles.mainContainer}>
            <View style={styles.inputBox}>
                <View style={styles.textBox}>
                    <Text style={styles.subText}>연매출액을 입력해주세요!</Text>
                    <Text style={styles.mainText}>연간 매출액이 궁금합니다!</Text>
                </View>
                <TextInput
                    style={styles.inputText}
                    placeholder="연매출액을 입력해주세요..."
                    placeholderTextColor={Colors.gray3}
                    keyboardType='numeric'
                    value={props.annualRevenue}
                    onChangeText={(s) => {props.setAnnualRevenue(s)}}
                />
            </View>
            <View style={styles.inputBox}>
                <View style={styles.textBox}>
                    <Text style={styles.subText}>창업 위치를 입력해주세요!</Text>
                    <Text style={styles.mainText}>(선택) 위치에 알맞는 공고를 추천들릴게요!</Text>
                </View>
                <TextInput
                    style={styles.inputText}
                    placeholder="창업 위치를 입력해주세요..."
                    placeholderTextColor={Colors.gray3}
                    value={props.startupLocation}
                    onChangeText={(s) => {props.setStartupLocation(s);}}
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