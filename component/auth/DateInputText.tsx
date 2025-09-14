import { Keyboard, StyleSheet, TouchableWithoutFeedback, View } from "react-native";
import BottomArrow from "../../assets/icons/bottom-arrow-back.svg"
import TopArrow from "../../assets/icons/top-arrow-back.svg"
import { Colors } from "../../constants/Color";
import { Dispatch, SetStateAction, useState } from "react";
import DropDownPicker from "react-native-dropdown-picker";
import CheckMark from "../../assets/icons/checkmark.svg"
import { Fonts } from "../../constants/Fonts";

type DateInputProps = {
    value : string | null, 
    items : string[]
    placeholder : string
    setValue : (s : string) => void
}

export default function DateInputText(props : DateInputProps) {

    const [open, setOpen] = useState(false)

    const items = props.items.map(item => ({ label: item, value: item }))

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={[styles.mainContainer, open && {paddingBottom : 48 * 4}]}>
            <DropDownPicker
                open={open}
                value={props.value}
                items={items}
                setOpen={setOpen}
                multiple = {false}
                setValue={(callback) => {
                const newValue =
                    typeof callback === "function"
                    ? callback(props.value)
                    : callback;
                if (newValue !== null) {
                    props.setValue(newValue);
                }}}
                placeholder={props.placeholder}
                placeholderStyle={styles.placeholderStyle}
                style={styles.mainStyle}
                listMode="SCROLLVIEW"
                dropDownContainerStyle={styles.dropdownContainerStyle}
                textStyle={styles.textStyle}
                labelStyle={styles.lableStyle}
                containerStyle={{height : 48}}
                ArrowUpIconComponent={
                    ({style}) => (
                    <TopArrow
                        width={18} 
                        height={18} 
                        color={Colors.gray2} 
                        style={style}
                    />
                )}
                ArrowDownIconComponent={
                    ({style}) => (
                    <BottomArrow
                        width={18}
                        height={18}
                        color={Colors.gray2}
                        style={style}
                    />
                )}
                TickIconComponent={
                    ({style}) => (
                    <CheckMark
                        width={18}
                        height={18}
                        color={Colors.gray2}
                        style={style}
                    />
                )}
            />
        </View>
        </TouchableWithoutFeedback>
    )
}

const styles = StyleSheet.create({
    mainContainer : {
        flex : 1,
        minHeight: 48
    },
    mainStyle : {
        backgroundColor : Colors.white2,
        borderWidth : 0,
        borderRadius : 8,
        padding : 16
    },
    placeholderStyle : {
        color : Colors.gray2,
        fontSize : 18,
        fontFamily : Fonts.medium,
    },
    dropdownContainerStyle : {
        backgroundColor : Colors.white2,
        borderWidth : 0,
        borderRadius : 8,
    },
    textStyle : {
        color : Colors.black2,
        fontSize : 18,
        fontFamily : Fonts.medium,
        paddingVertical : 8,
        paddingHorizontal : 6,
    },
    lableStyle : {
        color : Colors.black2,
        fontSize : 18,
        fontFamily : Fonts.medium,
        paddingVertical : 8,
        paddingHorizontal : 6,
    }
})