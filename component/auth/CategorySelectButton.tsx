import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import CategoryCheckMark from "../../assets/icons/category/category-check-mark.svg"
import { Colors } from "../../constants/Color";
import { useState } from "react";
import { SvgProps } from "react-native-svg";
import { Fonts } from "../../constants/Fonts";

type CategorySelectButtonProps = {
    key : string,
    id : string,
    icons : React.FC<SvgProps>,
    text : string,
    color : string,
    onClick : (categoryKey : string) => void,
    selected : boolean
}

export default function CategorySelectButton(props : CategorySelectButtonProps) {

    const [isSelected, setIsSelected] = useState(props.selected)

    return(
        <TouchableOpacity
            onPress={() => {
                setIsSelected(!isSelected)
                props.onClick(props.id)
            }}
        >
            <View style={{
                ...styles.mainContainer,
                borderColor : props.color,
                backgroundColor : isSelected ? `${props.color}E6` : Colors.white1
            }}>
                <View style={styles.titleContainer}>
                    {<props.icons
                    width={32}
                    height={32} 
                    color={isSelected ? Colors.white1 : props.color}
                    />}
                    <Text style={{
                        ...styles.titleText, 
                        color : isSelected ? Colors.white1 : Colors.black2
                    }}>
                        {props.text}
                    </Text>
                </View>
                <CategoryCheckMark color={isSelected ? Colors.white1 : props.color}/>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    mainContainer : {
        width : "100%",
        paddingVertical : 16,
        paddingHorizontal : 20,
        flexDirection : "row",
        justifyContent : "space-between",
        borderWidth : 2,
        borderRadius : 8,
        marginBottom : 12,
    },
    titleContainer : {
        gap : 16,
        flexDirection : "row",
        alignItems : "center"
    },
    titleText : {
        fontSize : 18,
        fontFamily : Fonts.semiBold,
    }
})