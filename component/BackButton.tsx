import LeftArrow from '../assets/icons/left-arrow-back.svg';

type BackButtonProps = {
    width : number
    height : number
    color : string
    onClick : () => void
}

export default function BackButton(props : BackButtonProps){
    return (
    <LeftArrow width={props.width} height={props.height} hitSlop={16} color={props.color} onTouchEnd={props.onClick}/>
)
}