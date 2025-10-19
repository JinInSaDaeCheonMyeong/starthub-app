import { Linking, Text, TouchableOpacity, View } from "react-native"
import StartupStatus from "../../constants/StartupStatus"
import XIcon from "../../assets/icons/xmark.svg"
import ProfileIcon from "../../assets/icons/header/person.svg"
import BellIcon from "../../assets/icons/header/bell.svg"
import HeartIcon from "../../assets/icons/header/heart.svg"
import TimeIcon from "../../assets/icons/section/time.svg"
import InfoIcon from "../../assets/icons/section/information.svg";
import ServiceIcon from "../../assets/icons/section/service.svg";
import PremiumIcon from "../../assets/icons/section/premium.svg";
import LogoutIcon from "../../assets/icons/section/logout.svg";
import DeleteIcon from "../../assets/icons/section/delete.svg"
import { Colors } from "../../constants/Color"
import { Fonts } from "../../constants/Fonts"

type SideBarProps = {
    username : string,
    startupStatus : StartupStatus,
    navigation : any,
    onXmarkPress : () => void,
    handleSignOut : () => void,
    handleDeleteUser : () => void
}

export default function SideBar(props : SideBarProps){
    const startupStatus = props.startupStatus === StartupStatus.EARLY_STAGE ? '초기창업' : '예비창업'
    const navFeatures = [
        {
            icon : <ProfileIcon width={29} height={29}/>,
            label : '프로필',
            action : () => {props.navigation.navigate('SystemStack')}
        },
        {
            icon : <BellIcon width={29} height={29}/>,
            label : '알림',
            action : () => {props.navigation.navigate("Alarm");}
        },
        {
            icon : <HeartIcon width={29} height={29}/>,
            label : '북마크',
            action : () => {props.navigation.navigate('MyLikes')}
        },
    ]
    const sections = [
        // {
        //     icon : <TimeIcon width={23} height={20}/>,
        //     label : '최근 본 공고',
        //     color : Colors.gray1,
        //     action : () => {props.navigation.navigate('SystemStack')}
        // },
        {
            icon : <InfoIcon width={23} height={20}/>,
            label : '이용 약관',
            color : Colors.gray1,
            action : () => {Linking.openURL('https://various-bougon-d76.notion.site/27f507c40eaf80acbf4afba41b9964b7')}
        },
        // {
        //     icon : <ServiceIcon width={23} height={18}/>,
        //     label : '1:1 문의',
        //     color : Colors.gray1,
        //     action : () => {props.navigation.navigate('Profile')}
        // },
        // {
        //     icon : <PremiumIcon width={23} height={20}/>,
        //     label : '프리미엄 플랜',
        //     color : Colors.gray1,
        //     action : () => {props.navigation.navigate('Profile')}
        // },
        {
            icon : <LogoutIcon width={23} height={20}/>,
            label : '로그아웃',
            color : Colors.gray1,
            action : () => {props.handleSignOut()}
        },
        {
            icon : <DeleteIcon width={23} height={20}/>,
            label : '회원 탈퇴',
            color : Colors.error,
            action : () => {props.handleDeleteUser()}
        },
    ]
    return (
        <View>
            <View style={{
                marginTop : 20,
                marginHorizontal : 20,
                marginBottom : 24,
                flexDirection : 'row',
                justifyContent : 'space-between',
                alignItems : 'center'
            }}>
                <View style={{
                    flexDirection : 'row',
                    gap : 8,
                    justifyContent : 'space-between',
                    alignItems : 'center'
                }}>
                    <Text style={{
                        paddingHorizontal : 8,
                        paddingVertical : 6,
                        borderColor : Colors.primary,
                        borderWidth : 1,
                        borderRadius : 16,
                        color : Colors.primary
                    }}>
                        {startupStatus}
                    </Text>
                    <Text style={{
                        color : Colors.black1,
                        fontSize : 20,
                        fontFamily : Fonts.bold
                    }}>
                        {props.username}
                    </Text>
                </View>
                <TouchableOpacity
                    hitSlop={16}
                    onPress={props.onXmarkPress}
                >
                    <XIcon width={18} height={18} color={Colors.gray1}/>
                </TouchableOpacity>
            </View>
            <View style={{
                flexDirection : 'row',
                marginBottom : 12
            }}>
                {navFeatures.map((props, index) => {
                    return (
                        <TouchableOpacity
                            key={index}
                            style={{
                                flex : 1,
                                padding : 16,
                                alignItems : 'center',
                                gap  :12
                            }}
                            onPress={props.action}
                        >
                            {props.icon}
                            <Text style={{
                                fontFamily : Fonts.reqular,
                                fontSize : 14,
                                color : Colors.gray1
                            }}>
                                {props.label}
                            </Text>
                        </TouchableOpacity>
                    )
                })}
            </View>
            {sections.map((props, index) => {
                return (
                    <View key={index}>
                    <View style={{
                        borderTopWidth : 1,
                        borderColor : Colors.gray3
                    }}/>
                    <TouchableOpacity
                        onPress={props.action}
                        style={{
                            paddingHorizontal : 22,
                            paddingVertical : 13,
                            flexDirection : 'row',
                            alignItems : 'center',
                            gap : 10,
                        }}
                    >
                        {props.icon}
                        <Text style={[{color : props.color}]}>{props.label}</Text>
                    </TouchableOpacity>
                    </View>
                )
            })}
        </View>
    )
}