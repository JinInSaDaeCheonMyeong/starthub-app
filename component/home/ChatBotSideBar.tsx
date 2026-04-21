import { ScrollView, Text, TouchableOpacity, View } from "react-native"
import StartupStatus from "../../constants/StartupStatus"
import XIcon from "../../assets/icons/xmark.svg"
import ProfileIcon from "../../assets/icons/header/person.svg"
import BellIcon from "../../assets/icons/header/bell.svg"
import HeartIcon from "../../assets/icons/header/heart.svg"
import HomeIcon from "../../assets/icons/chat/house.svg"
import ChatIcon from "../../assets/icons/chat/pencil.svg"
import NoticeIcon from "../../assets/icons/chat/newspaper.svg"
import CompetitorIcon from "../../assets/icons/chat/chart.svg"
import BMCIcon from "../../assets/icons/chat/briefcase.svg"
import LogoutIcon from "../../assets/icons/section/logout.svg"
import DeleteIcon from "../../assets/icons/section/delete.svg"
import { Colors } from "../../constants/Color"
import { Fonts } from "../../constants/Fonts"
import { ChatSession } from "../../type/chatbot/chatbot.type"

type ChatBotSideBarProps = {
    username: string
    startupStatus: StartupStatus
    navigation: any
    sessions: ChatSession[]
    onXmarkPress: () => void
    handleSignOut: () => void
    handleDeleteUser: () => void
    onNewChat: () => void
    onSelectSession: (sessionId: number) => void
}

export default function ChatBotSideBar(props: ChatBotSideBarProps) {
    const startupStatus = props.startupStatus === StartupStatus.EARLY_STAGE ? '초기창업' : '예비창업'

    const navFeatures = [
        {
            icon: <ProfileIcon width={29} height={29} />,
            label: '프로필',
            action: () => props.navigation.reset({ index: 0, routes: [{ name: 'SystemStack' }] }),
        },
        {
            icon: <BellIcon width={29} height={29} />,
            label: '알림',
            action: () => props.navigation.reset({ index: 0, routes: [{ name: 'HomeStack' }, { name: 'Alarm' }] }),
        },
        {
            icon: <HeartIcon width={29} height={29} />,
            label: '북마크',
            action: () => props.navigation.reset({ index: 0, routes: [{ name: 'HomeStack' }, { name: 'MyLikes' }] }),
        },
    ]

    const menuSections = [
        {
            icon: <HomeIcon width={23} height={20} color={Colors.gray1} />,
            label: '홈',
            color: Colors.gray1,
            action: () => {
                props.onXmarkPress()
                props.navigation.reset({ index: 0, routes: [{ name: 'HomeStack' }] })
            },
        },
        {
            icon: <ChatIcon width={23} height={20} color={Colors.gray1} />,
            label: '새 채팅',
            color: Colors.gray1,
            action: () => {
                props.onXmarkPress()
                props.onNewChat()
            },
        },
        {
            icon: <NoticeIcon width={23} height={20} color={Colors.gray1} />,
            label: '공고 보러가기',
            color: Colors.gray1,
            action: () => {
                props.onXmarkPress()
                props.navigation.reset({ index: 0, routes: [{ name: 'HomeStack', params: { screen: 'Notice' } }] })
            },
        },
        {
            icon: <CompetitorIcon width={23} height={20} color={Colors.gray1} />,
            label: '경쟁사 분석',
            color: Colors.gray1,
            action: () => {
                props.onXmarkPress()
                props.navigation.reset({ index: 0, routes: [{ name: 'HomeStack' }, { name: 'Competitor' }] })
            },
        },
        {
            icon: <BMCIcon width={23} height={20} color={Colors.gray1} />,
            label: 'BMC 설계',
            color: Colors.gray1,
            action: () => {
                props.onXmarkPress()
                props.navigation.reset({ index: 0, routes: [{ name: 'HomeStack', params: { screen: 'BMC' } }] })
            },
        },
    ]

    const bottomSections = [
        {
            icon: <LogoutIcon width={23} height={20} />,
            label: '로그아웃',
            color: Colors.gray1,
            action: props.handleSignOut,
        },
        {
            icon: <DeleteIcon width={23} height={20} />,
            label: '회원 탈퇴',
            color: Colors.error,
            action: props.handleDeleteUser,
        },
    ]

    return (
        <View style={{ flex: 1 }}>
            {/* 헤더: 배지 + 유저명 + X */}
            <View style={{
                marginTop: 20,
                marginHorizontal: 20,
                marginBottom: 24,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
            }}>
                <View style={{
                    flexDirection: 'row',
                    gap: 8,
                    alignItems: 'center',
                }}>
                    <Text style={{
                        paddingHorizontal: 8,
                        paddingVertical: 6,
                        borderColor: Colors.primary,
                        borderWidth: 1,
                        borderRadius: 16,
                        color: Colors.primary,
                        fontSize: 12,
                        fontFamily: Fonts.medium,
                    }}>
                        {startupStatus}
                    </Text>
                    <Text style={{
                        color: Colors.black1,
                        fontSize: 20,
                        fontFamily: Fonts.bold,
                    }}>
                        {props.username}
                    </Text>
                </View>
                <TouchableOpacity hitSlop={16} onPress={props.onXmarkPress}>
                    <XIcon width={18} height={18} color={Colors.gray1} />
                </TouchableOpacity>
            </View>

            {/* 네비게이션 아이콘 3열 */}
            <View style={{ flexDirection: 'row', marginBottom: 12 }}>
                {navFeatures.map((item, index) => (
                    <TouchableOpacity
                        key={index}
                        style={{ flex: 1, padding: 16, alignItems: 'center', gap: 12 }}
                        onPress={item.action}
                    >
                        {item.icon}
                        <Text style={{ fontFamily: Fonts.reqular, fontSize: 14, color: Colors.gray1 }}>
                            {item.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* 메뉴 + 채팅 기록 통합 스크롤 영역 */}
            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                {/* 메뉴 섹션 */}
                {menuSections.map((item, index) => (
                    <View key={index}>
                        <View style={{ borderTopWidth: 1, borderColor: Colors.gray3 }} />
                        <TouchableOpacity
                            onPress={item.action}
                            style={{
                                paddingHorizontal: 22,
                                paddingVertical: 16,
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: 10,
                            }}
                        >
                            {item.icon}
                            <Text style={{ color: item.color, fontFamily: Fonts.reqular, fontSize: 15 }}>
                                {item.label}
                            </Text>
                        </TouchableOpacity>
                    </View>
                ))}

                {/* 채팅 기록 */}
                <View style={{ borderTopWidth: 1, borderColor: Colors.gray3 }} />
                <Text style={{
                    paddingHorizontal: 22,
                    paddingVertical: 10,
                    fontFamily: Fonts.semiBold,
                    fontSize: 13,
                    color: Colors.gray1,
                }}>
                    채팅 기록
                </Text>

                {props.sessions.length === 0 ? (
                    <Text style={{
                        paddingHorizontal: 22,
                        paddingVertical: 16,
                        fontFamily: Fonts.reqular,
                        fontSize: 13,
                        color: Colors.gray2,
                        textAlign: 'center',
                    }}>
                        채팅 기록이 없습니다
                    </Text>
                ) : (
                    props.sessions.map((session) => (
                        <TouchableOpacity
                            key={session.id}
                            onPress={() => {
                                props.onXmarkPress()
                                props.onSelectSession(session.id)
                            }}
                            style={{
                                paddingHorizontal: 22,
                                paddingVertical: 11,
                            }}
                        >
                            <Text
                                numberOfLines={1}
                                style={{
                                    fontFamily: Fonts.reqular,
                                    fontSize: 14,
                                    color: Colors.black1,
                                }}
                            >
                                {session.title}
                            </Text>
                            <Text style={{
                                fontFamily: Fonts.reqular,
                                fontSize: 11,
                                color: Colors.gray2,
                                marginTop: 2,
                            }}>
                                {session.messageCount}개 메시지
                            </Text>
                        </TouchableOpacity>
                    ))
                )}
            </ScrollView>

            {/* 하단: 로그아웃, 회원탈퇴 */}
            {bottomSections.map((item, index) => (
                <View key={index}>
                    <View style={{ borderTopWidth: 1, borderColor: Colors.gray3 }} />
                    <TouchableOpacity
                        onPress={item.action}
                        style={{
                            paddingHorizontal: 22,
                            paddingVertical: 13,
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 10,
                        }}
                    >
                        {item.icon}
                        <Text style={{ color: item.color, fontFamily: Fonts.reqular, fontSize: 15 }}>
                            {item.label}
                        </Text>
                    </TouchableOpacity>
                </View>
            ))}
        </View>
    )
}