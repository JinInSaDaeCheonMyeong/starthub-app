import { FlatList, StyleSheet, Text, TextInput, View } from "react-native";
import CategorySelectButton from "../../../../component/auth/CategorySelectButton";
import { Colors } from "../../../../constants/Color";
import { InterestTypeList } from "../../../../constants/InterestTypeList";
import { Fonts } from "../../../../constants/Fonts";

type PreInterestScreenProps = {
    preCompanyLocation : string
    setPreCompanyLocation : (companyLocation : string) => void
    preInterestList : string[]
    setPreInterestList : (list : string[]) => void
}

export default function PreInterestScreen(props : PreInterestScreenProps){

    return(
        <View style={styles.mainContainer}>
                <View style={styles.inputBox}>
                    <View style={styles.textBox}>
                        <Text style={styles.subText}>창업 위치를 입력해주세요!</Text>
                        <Text style={styles.mainText}>(선택) 위치에 알맞는 공고를 추천들릴게요!</Text>
                    </View>
                    <TextInput
                        style={styles.inputText}
                        placeholder="창업 위치를 입력해주세요..."
                        placeholderTextColor={Colors.gray3}
                        value={props.preCompanyLocation}
                        onChangeText={(s) => {props.setPreCompanyLocation(s)}}
                    />
                </View>
            <View style={{gap : 24}}>
            <View style={styles.textBox}>
                <Text style={styles.subText}>드디어 마지막입니다!</Text>
                <Text style={styles.mainText}>창업 분야를 1개 이상 선택해주세요!</Text>
            </View>
            <FlatList
                scrollEnabled={false}
                data={InterestTypeList}
                showsVerticalScrollIndicator={false}
                contentContainerStyle = {styles.listContentContainer}
                renderItem={({item : {id, color, text, icon}}) => (
                <CategorySelectButton
                    key={id}
                    id={id}
                    color={color}
                    text={text}
                    icons={icon}
                    onClick={(id) => {
                        if (props.preInterestList.includes(id)) {
                            props.setPreInterestList(props.preInterestList.filter(key => key !== id))
                        } else {
                            const interestList = [...props.preInterestList]
                            interestList.push(id)
                            props.setPreInterestList(interestList)
                        }
                    }}
                    selected = {props.preInterestList.includes(id)}
                />
            )}
            />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer : {
        flex : 1,
        gap : 48,
        overflow : "hidden"
    },
    inputBox : {
        gap : 16,
    },
    textBox : {
        gap : 4
    },
    categorySelectContainer : {
        gap : 16
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
    listContentContainer : {
        gap : 16
    },
    inputText : {
        fontSize : 18,
        color : Colors.black2,
        fontFamily : Fonts.medium
    },
})