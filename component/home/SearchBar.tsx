import { Platform, StyleSheet, TextInput, TouchableOpacity, View } from "react-native"
import SearchIcon from "../../assets/icons/search-icon.svg"
import { Colors } from "../../constants/Color"
import { useState } from "react"
import { Fonts } from "../../constants/Fonts"

type SearchBarProps = {
    onPress : (text : string) => void
}

export default function SearchBar({onPress} : SearchBarProps) {
    const [text, setText] = useState('')
    return (
    <View style={[styles.mainContainer,{zIndex:10000}]}>
        <TextInput
            style={styles.textInput}
            placeholder={"검색어를 입력해주세요..."}
            placeholderTextColor={Colors.gray2}
            value={text}
            onChangeText={
                (text) => setText(text)
            }
            autoCapitalize="none"
        />
        <TouchableOpacity onPress={() => onPress(text)}>
            <SearchIcon
                width={24}
                height={24}
                color={Colors.gray2}
            />
        </TouchableOpacity>
    </View>
    )
}

const styles = StyleSheet.create({
    mainContainer : {
        width : '100%',
        flexDirection : "row",
        justifyContent : 'space-between',
        backgroundColor : Colors.white2,
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