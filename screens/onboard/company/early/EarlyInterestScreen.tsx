import { FlatList, StyleSheet, Text, View } from "react-native";
import CategorySelectButton from "../../../../component/auth/CategorySelectButton";
import { Colors } from "../../../../constants/Color";
import { InterestTypeList } from "../../../../constants/InterestTypeList";
import { Fonts } from "../../../../constants/Fonts";

type EarlyInterestScreenProps = {
    earlyInterestList : string[]
    setEarlyInterestList : (list : string[]) => void
}

export default function EarlyInterestScreen(props : EarlyInterestScreenProps){

    return(
        <View style={styles.mainContainer}>
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
                        if (props.earlyInterestList.includes(id)) {
                            props.setEarlyInterestList(props.earlyInterestList.filter(key => key !== id))
                        } else {
                            const interestList = [...props.earlyInterestList]
                            interestList.push(id)
                            props.setEarlyInterestList(interestList)
                        }
                    }}
                    selected = {props.earlyInterestList.includes(id)}
                />
            )}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer : {
        flex : 1,
        gap : 24,
        overflow : "hidden"
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
    }
})