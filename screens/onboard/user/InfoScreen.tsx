import { StyleSheet, Text, TextInput, View } from "react-native";
import { Colors } from "../../../constants/Color";
import DateInputText from "../../../component/auth/DateInputText";
import { DayList, MonthList, YearList } from "../../../constants/DateNumber";
import { Fonts } from "../../../constants/Fonts";

type InfoScreenProps = {
    name : string,
    year : string,
    month : string,
    day : string,
    setName : (name : string) => void,
    setYear : (year : string) => void,
    setMonth : (month : string) => void,
    setDay : (day : string) => void,
}

export default function InfoScreen(props : InfoScreenProps) {

    return(
        <View style={styles.mainContainer}>
            <View style={styles.inputBox}>
                <View style={styles.textBox}>
                    <Text style={styles.subText}>회원님의 이름을 입력해주세요!</Text>
                    <Text style={styles.mainText}>당신의 이름이 궁금합니다!</Text>
                </View>
                <TextInput
                    style={styles.inputText}
                    placeholder="이름을 입력해주세요..."
                    placeholderTextColor={Colors.gray3}
                    value={props.name}
                    onChangeText={(s) => {props.setName(s)}}
                />
            </View>
            <View style={styles.inputBox}>
                <View style={styles.textBox}>
                    <Text style={styles.subText}>회원님의 생년월일을 입력해주세요!</Text>
                    <Text style={styles.mainText}>{"나이 대에 맞는 공고를 추천 해드릴게요!"}</Text>
                </View>
                <View style={styles.birthDateContainer}>
                    <DateInputText 
                        items={YearList} 
                        placeholder="YYYY"
                        value={props.year} 
                        setValue={(s) => {props.setYear(s)}}
                    />
                    <DateInputText 
                        items={MonthList} 
                        placeholder="MM"
                        value={props.month} 
                        setValue={(s) => {props.setMonth(s)}}
                    />
                    <DateInputText 
                        items={DayList} 
                        placeholder="DD"
                        value={props.day} 
                        setValue={(s) => {props.setDay(s)}}
                    />
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
