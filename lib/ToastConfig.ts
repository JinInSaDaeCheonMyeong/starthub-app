import { StyleSheet } from "react-native"
import { BaseToastProps, ErrorToast, InfoToast, SuccessToast, ToastConfig, } from "react-native-toast-message"
import { Fonts } from "../constants/Fonts"
import { Colors } from "../constants/Color"

const toastConfig : ToastConfig = {
    success : (props : BaseToastProps) => 
        SuccessToast({
            ...props,
            ...styles,
            style : {
                ...styles.style,
                borderLeftColor : Colors.success
            },
        }),
    info : (props : BaseToastProps) => 
        InfoToast({
            ...props,
            ...styles,
            style : {
                ...styles.style,
                borderLeftColor : Colors.info
            }
        }),
    error : (props : BaseToastProps) => 
        ErrorToast({
            ...props,
            ...styles,
            style : {
                ...styles.style,
                borderLeftColor : Colors.error
            }
        }),
}

const styles = StyleSheet.create({
    text1Style : {
        fontSize : 14,
        fontWeight : "normal",
        fontFamily : Fonts.semiBold,
        color : Colors.black1,
        marginBottom : undefined
    },
    text2Style : {
        fontSize : 12,
        fontWeight : "normal",
        fontFamily : Fonts.medium,
        color : Colors.gray2
    },
    style : {
        height : "auto",
        borderRadius : 6,
        borderLeftWidth : 4
    },
    contentContainerStyle : {
        paddingHorizontal : 24,
        paddingVertical : 12,
    }
})

export default toastConfig