import Toast from "react-native-toast-message";

export enum ToastType {
    SUCCESS = "success",
    ERROR = "error",
    WARNING = "info",
}

export function ShowToast(
    title: string,
    message: string,
    type: ToastType
) {
    Toast.hide(); // 기존 토스트 강제 닫기
    setTimeout(() => {
        Toast.show({
            text1: title,
            text2: message,
            type,
        });
    }, 300); // 약간의 딜레이 주면 자연스러움
}