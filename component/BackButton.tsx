import { useState } from "react";
import LeftArrow from "../assets/icons/left-arrow-back.svg";
import {TouchableOpacity} from "react-native";

type BackButtonProps = {
    width: number;
    height: number;
    color: string;
    onClick: () => void;
};

export default function BackButton(props: BackButtonProps) {
    const [disabled, setDisabled] = useState(false);

    const handleClick = () => {
        if (disabled) return; // 이미 눌린 상태면 무시
        setDisabled(true);
        props.onClick();
        setTimeout(() => setDisabled(false), 500); // 0.5초 후 다시 활성화
    };

    return (
        <TouchableOpacity
            onPress={handleClick}
            hitSlop={16}
            style={{ width: props.width, height: props.height}}
        >
        <LeftArrow
            width={props.width}
            height={props.height}
            color={props.color}
        />
        </TouchableOpacity>
    );
}
