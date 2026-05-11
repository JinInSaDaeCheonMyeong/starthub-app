import Checkbox from "expo-checkbox"
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { Colors } from "../../constants/Color"
import RightArrow from "../../assets/icons/right-arrow-back.svg"
import { Fonts } from "../../constants/Fonts"


type SelectAgreementProps = {
    value : boolean
    title : string
    onSelect : (value : boolean) => void
    onClick : () => void
    touchable : boolean
}

export default function SelectAgreement(props : SelectAgreementProps){
    const toggleSelect = () => {
        props.onSelect(!props.value)
    }

    return ( 
        <View style={styles.mainContainer}>
            <Checkbox
                value={props.value}
                onValueChange={(value) => {
                    props.onSelect(value)
                }}
                style={props.value ? styles.selectCheckBox : styles.unSelectCheckBox}
                color={props.value ? Colors.primary : undefined}
            />
            <TouchableOpacity
                style={styles.textButton}
                onPress={toggleSelect}
                activeOpacity={0.7}
            >
                <Text style={styles.clickText}>{props.title}</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.linkButton}
                disabled={!props.touchable}
                onPress={props.onClick}
                hitSlop={12}
                activeOpacity={0.7}
            >
                {
                    props.touchable && (
                        <RightArrow width={16} height={16} color={Colors.gray3}/>
                    )
                }
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer : {
        flexDirection : "row",
        gap : 8,
        alignItems : "center"
    },
    textButton : {
        flex : 1,
    },
    linkButton : {
        minWidth : 24,
        minHeight : 24,
        flexDirection : "row",
        alignItems : "center",
        justifyContent : "center",
    },
    selectCheckBox : {
        width : 24,
        height : 24,
        borderColor : Colors.primary,
        backgroundColor : Colors.primary,
        borderRadius : 6,
        borderWidth : 1
    },
    unSelectCheckBox : {
        width : 24,
        height : 24,
        borderColor : Colors.gray3,
        borderRadius : 6,
        borderWidth : 1
    },
    clickText : {
        color : Colors.gray2,
        fontSize : 14,
        fontFamily : Fonts.medium,
    }
})
