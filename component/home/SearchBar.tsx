import {Dimensions, Platform, StyleSheet, TextInput, TouchableOpacity, View} from "react-native"
import SearchIcon from "../../assets/icons/search-icon.svg"
import { Colors } from "../../constants/Color"
import {useEffect, useState} from "react"
import { Fonts } from "../../constants/Fonts"
import GlassView from "../GlassView";

type SearchBarProps = {
    onPress : (text : string) => void
    value?: string
}

const width = Dimensions.get("window").width;

export default function SearchBar({onPress, value} : SearchBarProps) {  // ✅ value 추가
    const [text, setText] = useState('')

    // ✅ value prop이 변경되면 내부 state 업데이트
    useEffect(() => {
        if (value !== undefined && value !== text) {
            setText(value)
        }
    }, [value])
    return (
        <View style={[{flexDirection : "row", zIndex: 10000}]}>
            <GlassView containerStyle={styles.mainContainer}>
                <TextInput
                    inputMode={"search"}
                    style={styles.textInput}
                    placeholder={"검색어를 입력해주세요..."}
                    placeholderTextColor={Colors.gray2}
                    onSubmitEditing={() => onPress(text)}
                    value={text}
                    onChangeText={
                        (text) => setText(text)
                    }
                    autoCapitalize="none"
                />
            </GlassView>
            <TouchableOpacity onPress={() => onPress(text)}>
                <View style={{
                    marginStart: 12,
                    width: 50,
                    height: 50,
                    backgroundColor: Colors.primary,
                    borderRadius: 10,
                    justifyContent: "center",
                    alignItems: "center"
                }}>
                <SearchIcon
                    width={24}
                    height={24}
                    color={Colors.white1}
                />
                </View>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer : {
        width : width - 94,
        flexDirection : "row",
        justifyContent : 'space-between',
        alignItems : "center",
        borderRadius : 8,
        ...Platform.select({
            ios : {
                gap : 16,
                paddingHorizontal : 16,
                paddingVertical : 8,
            },
            android : {
                paddingVertical : 8,
                paddingHorizontal : 16,
                gap : 8
            }
        })
    },
    textInput : {
        flex : 1,
        height: 35,
        fontSize : 14,
        color : Colors.black2,
        fontFamily : Fonts.medium
    }
})