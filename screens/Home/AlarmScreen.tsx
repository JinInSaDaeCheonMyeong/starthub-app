import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation/RootStack";
import { FlatList, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import SideBar from "../../component/home/SideBar";
import SubHeaderBar from "../../component/home/SubHeaderBar";
import GlassView from "../../component/GlassView";
import { useCallback, useState } from "react";
import {useFocusEffect} from '@react-navigation/native'
import { AlarmHistory } from "../../type/notification/notification.type";
import { getAlarmHistory } from "../../api/notification";
import { isAxiosError } from "axios";
import { ShowToast, ToastType } from "../../util/ShowToast";
import { Colors } from "../../constants/Color";
import { Fonts } from "../../constants/Fonts";
import * as Progress from "react-native-progress"
import { formatToDate, getDateDifference } from "../../util/DateFormat";
import NoticeIcon from "../../assets/icons/alarm/Iconly/Regular/Bulk/Work.svg"
import CalendarIcon from "../../assets/icons/alarm/Iconly/Regular/Bulk/Calendar.svg"
import { getNotice } from "../../api/notice";
import { NoticeType } from "../../type/notice/notice.type";

export type AlarmScreenProps = StackScreenProps<
    RootStackParamList,
    "Alarm"
>;

export default function AlarmScreen({navigation} : AlarmScreenProps) {
    const insets = useSafeAreaInsets()
    const [history, setHistory] = useState<AlarmHistory[]>([])
    const [loading, setLoading] = useState(true)

    const parseReceptionPeriod = (period: string) => {
        try {
            if (!period || typeof period !== 'string') {
                return {
                    startDate: new Date(),
                    endDate: new Date()
                };
            }
            const parts = period.split("~").map(str => str.trim());
            if (parts.length !== 2) {
                return {
                    startDate: new Date(),
                    endDate: new Date()
                };
            }
            const [startPart, endPart] = parts;
            const startDateStr = startPart.split(" ")[0];
            const endDateStr = endPart.split(" ")[0];
            const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
            if (!dateRegex.test(startDateStr) || !dateRegex.test(endDateStr)) {
                return {
                    startDate: new Date(),
                    endDate: new Date()
                };
            }

            // Date 객체 생성 시 시간을 00:00:00으로 설정하여 날짜만 사용
            const startDate = new Date(startDateStr + 'T00:00:00');
            const endDate = new Date(endDateStr + 'T00:00:00');

            // 유효한 날짜인지 확인
            if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
                console.warn('Invalid date created from:', {
                    startDateStr,
                    endDateStr,
                    originalPeriod: period
                });
                return {
                    startDate: new Date(),
                    endDate: new Date()
                };
            }

            return {
                startDate,
                endDate
            };
        } catch (error) {
            return {
                startDate: new Date(),
                endDate: new Date()
            };
        }
    };

    const getItem = (type : string) => {
        switch (type) {
            case "AI_RECOMMENDATION":
            case "INTEREST_CATEGORY":
                return {
                    title: "이런 공고는 어때요?",
                    icon: <NoticeIcon width={20} height={20} />,
                };
            default :
                return {
                    title : '곧 마감되는 공고에요!',
                    icon : <CalendarIcon width={20} height={20}/>
                }
        }
    }
    const handleNotice = async (noticeId : number) => {
        try {
            const notice = (await getNotice(noticeId)).data
            const { startDate, endDate } = parseReceptionPeriod(notice.receptionPeriod);
            const data = {
                ...notice,
                startDate,
                endDate
            }
            navigation.navigate("InNotice", { Notice: data });
        } catch (error) {
            if(isAxiosError(error)){
                ShowToast('알람', error.message, ToastType.ERROR)
                return
            }
            ShowToast("알람", '알 수 없는 오류가 발생했습니다', ToastType.ERROR);
            return
        }
    }
    useFocusEffect(
        useCallback(() => {
            const initData = async () => {
                setLoading(true)
                try {
                    const data = (await getAlarmHistory()).data
                    setHistory(data)
                } catch (error) {
                    if(isAxiosError(error)){
                        ShowToast('알람', error.message, ToastType.ERROR)
                        return
                    }
                    ShowToast("알람", '알 수 없는 오류가 발생했습니다', ToastType.ERROR);
                } finally {
                    setLoading(false)
                }
            }
            initData()
        }, [])
    )
    return (
        <ImageBackground source={require("../../assets/images/glass-background.png")} style={{paddingTop: insets.top, paddingBottom: insets.bottom, flex : 1}}>
            <SubHeaderBar
                title="내 알림"
                handleBackPress={navigation.goBack}
            />
            <FlatList
                data={history}
                contentContainerStyle={{padding : 16, gap : 16}}
                renderItem={({item, index}) => {
                    const {title, icon} = getItem(item.notificationType)
                    return (
                        <TouchableOpacity onPress={async () => {
                            handleNotice(item.announcementId)
                        }}>
                            <GlassView 
                                key={index} 
                                containerStyle={{
                                    padding : 16,
                                    gap : 4
                                }}
                            >
                                <View style={{flexDirection : 'row', justifyContent : 'space-between', alignItems : 'center'}}>
                                    <View style={{flexDirection : 'row', gap : 6, alignItems : 'center'}}>
                                        {icon}
                                        <Text style={{color : '#777777', fontSize : 13, fontFamily : Fonts.reqular}}>{title}</Text>
                                    </View>
                                    <Text style={{color : '#777777', fontSize : 13, fontFamily : Fonts.reqular}}>{getDateDifference(new Date(item.createdAt))}</Text>
                                </View>
                                <Text numberOfLines={1} style={{color : Colors.black1, fontSize : 14, fontFamily : Fonts.semiBold}}>{item.title}</Text>
                            </GlassView>
                        </TouchableOpacity>
                    )
                }}
                ListFooterComponent={
                    loading ? (
                        <View style={styles.loadingContainer}>
                            <Progress.Circle size={40} indeterminate color={Colors.primary} />
                        </View>
                    ) : null
                }
                ListEmptyComponent={
                    !loading ? (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyContainerText}>내 알람 목록이 없습니다</Text>
                        </View>
                    ) : null
                }
            />
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    loadingContainer: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 40,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 40,
    },
    emptyContainerText: {
        fontSize: 18,
        color: Colors.gray2,
        fontFamily: Fonts.medium,
    },
})