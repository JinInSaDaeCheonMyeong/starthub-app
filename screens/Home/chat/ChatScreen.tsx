import {FlatList, Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import SearchBar from "../../../component/home/SearchBar";
import { Shadow } from "react-native-shadow-2";
import { Colors } from "../../../constants/Color";
import { Fonts } from "../../../constants/Fonts";
import { ChatMenuButton } from "../../../component/home/ChatMenuButton";
import { getDateDifference } from "../../../util/DateFormat";
import { ChatRoomType } from "../../../type/chat/room.type";
import { CompositeScreenProps, useFocusEffect } from "@react-navigation/core";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../../../navigation/RootStack";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { HomeStackParamList } from "../../../navigation/HomeStack";
import { getMessages, getMyRoom } from "../../../api/chat";
import { useCallback, useEffect, useState } from "react";
import { getMe, getUser } from "../../../api/user";
import { GetUserResponse } from "../../../type/user/user.type";
import { GetCompanyByIdResponse } from "../../../type/company/company.type";
import { getCompanyById } from "../../../api/company";
import { isAxiosError } from "axios";
import { ErrorResponse } from "../../../type/util/response.type";
import { ShowToast, ToastType } from "../../../util/ShowToast";
import { Provider } from "react-native-paper";
import ErrorChatIcon from "../../../assets/icons/error-chat.svg"

export type ChatScreenProps = CompositeScreenProps<
    BottomTabScreenProps<HomeStackParamList, 'Chat'>,
    StackScreenProps<RootStackParamList>
>

interface ChatRoomListItem extends ChatRoomType {
    otherUser : GetUserResponse["data"]
    otherCompany : GetCompanyByIdResponse["data"]["companyName"]
}

export default function ChatScreen({navigation} : ChatScreenProps) {
    const [chatRoomList, setChatRoomList] = useState<ChatRoomListItem[]>([])
    const [filterText, setFilterText] = useState('')

    const setInitialRoomList = async () => {
        const list = (await getMyRoom()).data;
        if (!list.length) return;
        const myId = (await getMe()).data.id;
        const totalList = await Promise.all(list.map(async (data) => {
            const isMe = data.userId === myId;
            const targetId = isMe ? data.founderId : data.userId;
            const otherUserData = (await getUser(targetId)).data;
            const companyName = otherUserData.companyIds.length > 0
            ? (await getCompanyById(otherUserData.companyIds[0])).data.companyName
            : "무소속";
            return {
                ...data,
                otherUser: otherUserData,
                otherCompany: companyName,
            };
        }));

        setChatRoomList(totalList);
    };

    const filterList = () : ChatRoomListItem[] => {
        return chatRoomList.filter(item =>  
            item.otherCompany.includes(filterText) ||
            item.otherUser.username.includes(filterText)
        )
    }

    useFocusEffect(
        useCallback(() => {
            setInitialRoomList()
        }, [])
    )

    return (
        <View style={styles.mainContainer}>
            <Provider>
            <View style={styles.searchContainer}>
                <SearchBar onPress={(text : string) => {
                    setFilterText(text)
                }}/>
            </View>
            <View style={styles.chatWrapper}>
                <Shadow
                    distance={4} 
                    offset={[0, 4]} 
                    startColor="rgba(185, 185, 185, 0.2)"
                    style={styles.shadowStyle}
                >
                    <View style={styles.chatContainer}>
                        <Text style={styles.mainText}>내 채팅</Text>
                        <FlatList
                            showsVerticalScrollIndicator={false}
                            data={filterList()}
                            scrollEnabled={filterList().length !== 0}
                            contentContainerStyle={{ gap: 16 }}
                            keyExtractor={(item) => item.id.toString()}
                            ListEmptyComponent={() => {
                                const hasNoMatch = filterList().length === 0;
                                const showError = filterText && hasNoMatch;

                                if (hasNoMatch) {
                                    const color = showError ? Colors.error : Colors.info;
                                    const text = showError ? "채팅을 찾을 수 없습니다" : "채팅을 찾는 중입니다";

                                    return (
                                        <View style={{ paddingVertical: 24, alignItems: "center", gap: 12 }}>
                                            <ErrorChatIcon width={40} height={40} color={color} />
                                            <Text style={{
                                                fontFamily: Fonts.bold,
                                                color,
                                                fontSize: 16
                                            }}>
                                                {text}
                                            </Text>
                                        </View>
                                    );
                                }

                                return null;
                            }}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    onPress={async () => {
                                        try {
                                            const messagesResponse = (await getMessages(item.id)).data
                                            navigation.navigate('InChat', {
                                                roomId: item.id,
                                                chatLst: messagesResponse,
                                                img: item.otherUser.profileImage,
                                                name: item.otherUser.username,
                                                companyName: item.otherCompany
                                            })
                                        } catch (error: unknown) {
                                            if (isAxiosError(error)) {
                                                const response = error.response?.data
                                                const errorData = response as ErrorResponse
                                                ShowToast("오류 발생", errorData.message, ToastType.ERROR)
                                            }
                                        }
                                    }}
                                >
                                    <View style={styles.chatRoomContainer}>
                                        <Image
                                            style={{
                                                width: 48,
                                                height: 48,
                                                borderRadius: 8
                                            }}
                                            source={{ uri: item.otherUser.profileImage }}
                                        />
                                        <View style={styles.chatInfoContainer}>
                                            <Text
                                                style={styles.msgText}
                                                numberOfLines={1}
                                                ellipsizeMode="tail"
                                            >
                                                {item.otherCompany}
                                            </Text>
                                            <Text
                                                style={styles.userText}
                                                numberOfLines={1}
                                                ellipsizeMode="tail"
                                            >
                                                {item.otherUser.username}
                                            </Text>
                                        </View>
                                        <View style={styles.menuContainer}>
                                            <ChatMenuButton
                                                onDelete={() => { console.log("삭제하기") }}
                                            />
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </Shadow>
            </View>
            </Provider>
        </View>
    )

}

const styles = StyleSheet.create({
    mainContainer : {
        flex: 1,
        flexDirection: 'column',
    },
    searchContainer: {
        paddingHorizontal: 16,
        paddingTop: 16,
    },
    chatWrapper: {
        flex: 1,
        paddingHorizontal: 16,
        paddingVertical: 16,
    },
    shadowStyle: {
        width: "100%",
    },
    chatContainer : {
        flexDirection: 'column',
        borderRadius : 8,
        backgroundColor : Colors.white1,
        gap : 16,
        padding : 16,
        maxHeight : "100%"
    },
    chatRoomContainer : {
        flexDirection : 'row',
        width : "100%",
        justifyContent : 'space-between',
        gap : 8
    },
    chatInfoContainer : {
        paddingVertical : 4,
        flex : 1,
        gap : 4
    },
    dateMenuContainer : {
        paddingVertical : 4
    },
    menuContainer : {
        paddingVertical : 4,
        alignItems : "center"
    },
    mainText : {
        fontFamily : Fonts.semiBold,
        fontSize : 16,
        color : Colors.gray1
    },
    userText : {
        fontFamily : Fonts.bold,
        fontSize : 14,
        color : Colors.gray1
    },
    msgText : {
        fontFamily : Fonts.medium,
        fontSize : 12,
        color : Colors.gray2
    },
    dateText : {
        fontFamily : Fonts.medium,
        fontSize : 12,
        color : Colors.gray2
    }
})