import { BaseToastProps, ToastConfig, } from "react-native-toast-message"
import CustomToast from "../component/CustomToast"
import { ToastType } from "../util/ShowToast"

const toastConfig : ToastConfig = {
    success : (props : BaseToastProps) => (
        <CustomToast text={props.text2 ?? ''} type={ToastType.SUCCESS}/>
    ),
    info : (props : BaseToastProps) => (
        <CustomToast text={props.text2 ?? ''} type={ToastType.WARNING}/>
    ),
    error : (props : BaseToastProps) => (
        <CustomToast text={props.text2 ?? ''} type={ToastType.ERROR}/>
    ),
}

export default toastConfig
