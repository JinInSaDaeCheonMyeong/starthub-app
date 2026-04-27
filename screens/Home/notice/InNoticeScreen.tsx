import React, {useCallback} from 'react';
import {
    Alert, ImageBackground, Linking,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    useWindowDimensions,
    View
} from 'react-native';
import RenderHtml from 'react-native-render-html';
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {RootStackParamList} from "../../../navigation/RootStack";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {Colors} from "../../../constants/Color";
import {Fonts} from "../../../constants/Fonts";
import BusinessIcon from "../../../assets/icons/category/notice/business.svg";
import EducationIcon from "../../../assets/icons/category/notice/education.svg";
import EventIcon from "../../../assets/icons/category/notice/event.svg";
import FacilityIcon from "../../../assets/icons/category/notice/facility.svg";
import FundingIcon from "../../../assets/icons/category/notice/funding.svg";
import GlobalIcon from "../../../assets/icons/category/notice/global.svg";
import RNDIcon from "../../../assets/icons/category/notice/rnd.svg";
import TalentIcon from "../../../assets/icons/category/notice/talent.svg";
import CalendarIcon from "../../../assets/icons/notice/calendar.svg";
import OriginalIcon from "../../../assets/icons/notice/rectangle.svg"
import BookMarkFill from "../../../assets/icons/bookMark/bookmark.fill.svg";
import BookMark from "../../../assets/icons/bookMark/bookmark.svg";
import { ShowToast, ToastType } from '../../../util/ShowToast';
import SubHeaderBar from '../../../component/home/SubHeaderBar';
import { BaseScheduleType } from '../../../type/schedules/schedules.type';
import { formatToDate } from '../../../util/DateFormat';
import { getDateSchedules, registerSchedules, removeSchedules } from '../../../api/schedule';
import {useFocusEffect} from "@react-navigation/native"
import { isAxiosError } from 'axios';
import { ErrorResponse } from '../../../type/util/response.type';
import GlassView from '../../../component/GlassView';
import { DefaultImage } from '../../../constants/AppImages';
import { useNoticeStore } from '../../../store/noticeStore';

type InNoticeScreenProps = NativeStackScreenProps<RootStackParamList, 'InNotice'>;

const backgroundImage = DefaultImage.background

export default function InNoticeScreen({navigation, route : {params}} : InNoticeScreenProps) {
    const notice = params.Notice
    const insets = useSafeAreaInsets();
    const cleanedContent = notice.content
        .replace(/<br>\s*<!--/g, "<!--")
        .replace(/<br>\s*<\/(.*?)>/gi, "</$1>");

    const isValidDate = (date: Date) => !Number.isNaN(date.getTime());
    const hasValidDateRange = isValidDate(notice.startDate) && isValidDate(notice.endDate);

    const extractUrlFromAnchor = (href?: string, onClick?: string): string | null => {
        const candidates = [href, onClick].filter(Boolean) as string[];

        for (const value of candidates) {
            const trimmed = value.trim();

            if (/^https?:\/\//i.test(trimmed)) {
                return trimmed;
            }

            const quotedHttp = trimmed.match(/['\"](https?:\/\/[^'\"]+)['\"]/i);
            if (quotedHttp?.[1]) {
                return quotedHttp[1];
            }

            const plainHttp = trimmed.match(/https?:\/\/[^\s'\"]+/i);
            if (plainHttp?.[0]) {
                return plainHttp[0];
            }
        }

        return null;
    };

    const source = {
        html: cleanedContent.replace(
            /(<p class="txt-button">.*?<\/p>)\s*<br\s*\/?>/gi,
            '$1'
        )
    };
    const isSelected = useNoticeStore((state) => state.likedById[notice.id] ?? notice.isLiked)
    const isBookmarkLoading = useNoticeStore((state) => state.bookmarkLoadingById[notice.id] ?? false)
    const isSchedules = useNoticeStore((state) => state.scheduleByNoticeId[notice.id] ?? false)
    const isScheduleLoading = useNoticeStore((state) => state.scheduleLoadingByNoticeId[notice.id] ?? true)
    const toggleNoticeLike = useNoticeStore((state) => state.toggleNoticeLike)
    const setScheduleStatus = useNoticeStore((state) => state.setScheduleStatus)
    const setScheduleLoading = useNoticeStore((state) => state.setScheduleLoading)

    const handleBackPress = () => {
        navigation.goBack()
    };

    const handleBookmarkToggle = async () => {
        if (isBookmarkLoading) return

        try {
            const newIsLiked = await toggleNoticeLike(notice.id, notice.isLiked);
            if (params?.onGoBack) {
                params.onGoBack(notice.id, newIsLiked);
            }

        } catch {
            ShowToast('오류 발생', '북마크 처리 중 오류가 발생했습니다', ToastType.ERROR);
        }
    }

    const handleSaveSchedules = async () => {
        if (isScheduleLoading) return
        if (!hasValidDateRange) {
            ShowToast("추가 불가", "상시 접수 공고는 일정을 추가할 수 없습니다", ToastType.ERROR)
            return
        }

        setScheduleLoading(notice.id, true)

        try {
            if(isSchedules){
                const announcementId = notice.id
                await removeSchedules(announcementId)
                setScheduleStatus(notice.id, false)
                ShowToast("삭제 성공", "일정을 삭제했습니다", ToastType.SUCCESS)
                return
            }
            const data : BaseScheduleType = {
                announcementId : notice.id,
                startDate : formatToDate(notice.startDate, 'solid'),
                endDate : formatToDate(notice.endDate, 'solid')
            }
            await registerSchedules(data)
            setScheduleStatus(notice.id, true)
            ShowToast("추가 성공", "일정을 추가했습니다", ToastType.SUCCESS)
        } catch (error) {
            ShowToast("오류 발생", "알 수 없는 오류가 발생했습니다", ToastType.ERROR)
        } finally {
            setScheduleLoading(notice.id, false)
        }
    }

    const handleOpenURL = (url : string) => {
        Alert.alert(
            "링크 열기",
            "외부 사이트로 이동하시겠습니까?",
            [
                { text: "취소", style: "cancel" },
                {
                    text: "이동",
                    onPress: () => Linking.openURL(url).catch(() =>
                        ShowToast('오류 발생', '링크를 열 수 없습니다', ToastType.ERROR)
                    )
                }
            ]
        );
    }

    const targetAge = notice.targetAge == "전체" ? "전체연령" : notice.targetAge;
    const startupHistory = notice.startupHistory == "전체" ? "업력상관없음" : notice.startupHistory;
    const transformDate = (date : Date) => {
        return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`
    }
    const categoryMap = {
        "사업화" : {label : "사업화", icon : <BusinessIcon width={20} height={20} color={Colors.primary}/>},
        "멘토링ㆍ컨설팅ㆍ교육" : {label : "교육", icon : <EducationIcon width={20} height={20} color={Colors.primary}/>},
        "창업교육" : {label : "교육", icon : <EducationIcon width={20} height={20} color={Colors.primary}/>},
        "행사ㆍ네트워크" : {label : "행사", icon : <EventIcon width={20} height={20} color={Colors.primary}/>},
        "시설ㆍ공간ㆍ보육" : {label : "시설", icon : <FacilityIcon width={20} height={20} color={Colors.primary}/>},
        "정책자금" : {label : "자금", icon : <FundingIcon width={20} height={20} color={Colors.primary}/>},
        "글로벌" : {label : "글로벌", icon : <GlobalIcon width={20} height={20} color={Colors.primary}/>},
        "기술개발(R&D)" : {label : "R&D", icon : <RNDIcon width={20} height={20} color={Colors.primary}/>},
        "인력" : {label : "인력", icon : <TalentIcon width={20} height={20} color={Colors.primary}/>},
        "판로ㆍ해외진출" : {label : "글로벌", icon : <GlobalIcon width={16} height={16} color={Colors.primary}/>},
    } as const
    
    const { width } = useWindowDimensions();

    const fetchIsSchedule = async () => {
        setScheduleLoading(notice.id, true);
        try {
            const exists = (await getDateSchedules(
                formatToDate(new Date(), 'solid'))
            ).data.some((value) => value.id === params.Notice.id);
            
            setScheduleStatus(notice.id, exists)
        } catch (error) {
            if (isAxiosError(error)) {
                const response = error.response;
                if (!response) {
                    ShowToast("오류 발생", "네트워크 오류가 발생했습니다", ToastType.ERROR);
                    return;
                }
                const data = response.data as ErrorResponse;
                ShowToast("오류 발생", data.message, ToastType.ERROR);
                return;
            }
            ShowToast("오류 발생", "알 수 없는 오류가 발생했습니다", ToastType.ERROR);
        } finally {
            setScheduleLoading(notice.id, false)
        }
    }

    useFocusEffect(
        useCallback(() => { 
            fetchIsSchedule(); // async 함수 호출
        }, [])
    )

    return (
        <ImageBackground source={backgroundImage} style={{flex : 1, paddingTop: insets.top, paddingBottom: insets.bottom}}>
            <SubHeaderBar
                title={categoryMap[notice.supportField as keyof typeof categoryMap]?.label}
                handleBackPress={handleBackPress}
            />
            <ScrollView style={{padding: 16}} showsVerticalScrollIndicator={false}>
                <View style={styles.topWrapper}>
                    <Text style={styles.titleText}>
                        {notice.title}
                    </Text>
                    <Text style={styles.topDateText}>
                        {hasValidDateRange
                            ? `${transformDate(notice.startDate)}~${transformDate(notice.endDate)}`
                            : notice.receptionPeriod || '모집 기간 정보 없음'}
                    </Text>
                    <View style={styles.hashTagContainer}>
                        {[notice.region, targetAge, startupHistory].map((item, index) => (
                            <View key={index}>
                                <Text style={styles.hashTagText}>
                                    #{item}
                                </Text>
                            </View>
                        ))}
                    </View>
                    <View style={styles.buttons}>
                        <View style={styles.featureButtons}>
                            <TouchableOpacity onPress={() => handleOpenURL(params.Notice.url)}>
                                <GlassView 
                                    containerStyle={styles.buttonsContainer}
                                    blurPercent={0.45}
                                >
                                    <OriginalIcon height={20} color={Colors.primary}/>
                                    <Text style={styles.buttonText}>
                                        원문 보기
                                    </Text>
                                </GlassView>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                disabled={isScheduleLoading}
                                onPress={() => handleSaveSchedules()}
                            >
                                <GlassView containerStyle={styles.buttonsContainer}>
                                    <CalendarIcon height={20}/>
                                    <Text style={styles.buttonText}>
                                        {`일정 ${isScheduleLoading ? '로딩 중' : isSchedules ? '삭제' : '추가'}`}
                                    </Text>
                                </GlassView>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity
                            onPress={handleBookmarkToggle}
                            disabled={isBookmarkLoading}
                            activeOpacity={0.7}
                        >
                            {isSelected ? (
                                <BookMarkFill
                                    width={28}
                                    height={28}
                                    fill={Colors.primary}
                                    color={Colors.primary}
                                />
                            ) : (
                                <BookMark
                                    width={28}
                                    height={28}
                                    color={Colors.primary}
                                />
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
                <RenderHtml
                    contentWidth={width - 32}
                    source={source}
                    tagsStyles={{
                        ul: { listStyleType: 'none', paddingLeft: 0, marginLeft: 0 },
                    }}
                    systemFonts={[Fonts.semiBold, Fonts.medium]}
                    renderers={{
                        a: ({ TDefaultRenderer, tnode, ...props }: any) => {
                            // btn_by-bl 클래스가 있는 a 태그인지 확인
                            if (tnode.classes?.includes('btn_by-bl')) {
                                // 버튼 스타일로 렌더링
                                const url = extractUrlFromAnchor(
                                    tnode.attributes?.href,
                                    tnode.attributes?.onclick
                                );
                                return (
                                    <Text
                                        onPress={() => {
                                            if (url) {
                                                handleOpenURL(url)
                                            }
                                        }}
                                        style={{
                                            color: Colors.info,
                                            fontFamily: Fonts.reqular,
                                            fontSize: 14,
                                            textDecorationLine : 'underline'
                                        }}
                                    >
                                        접수 바로가기
                                    </Text>
                                );
                            }
                            // 일반 a 태그는 기본 렌더링
                            return <TDefaultRenderer tnode={tnode} {...props} />;
                        }
                    }}
                    renderersProps={{
                        a: {
                            onPress(_event, href, htmlAttribs, _target) {
                                const url = extractUrlFromAnchor(href, htmlAttribs?.onclick)
                                if (url) {
                                    handleOpenURL(url);
                                }
                            }
                        }
                    }}
                    classesStyles={{
                        title: {
                            fontFamily: Fonts.semiBold,
                            fontSize: 18,
                            color: Colors.black1,
                            marginTop : 28
                        },
                        tit: {
                            fontFamily: Fonts.medium,
                            fontSize: 16,
                            color: Colors.black1,
                            marginTop : 8,
                            marginBottom : 6
                        },
                        txt: {
                            fontFamily: Fonts.reqular,
                            flex : 1,
                            fontSize: 14,
                            color: Colors.black1,
                            marginBottom : 16
                        },
                        "txt-button": {
                            fontSize: 14,
                            color: Colors.black1,
                            fontFamily: Fonts.reqular,
                        },
                        list: {
                            fontSize: 14,
                            fontFamily: Fonts.reqular,
                        },
                    }}
                />
                <View style={{height: insets.bottom + 30}}/>
            </ScrollView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: Colors.white1,
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 18,
        fontFamily: Fonts.semiBold,
        color: Colors.black2,
        textAlign: 'center',
    },
    headerBackPadding: {
        paddingEnd: 56
    },
    topTitle: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    topIconContainer: {
        paddingEnd: 2,
    },
    topLabelText: {
        fontFamily: Fonts.semiBold,
        fontSize: 14,
        color: Colors.primary,
        paddingEnd: 12,
    },
    topDateText: {
        fontFamily: Fonts.medium,
        fontSize: 14,
        color : Colors.gray1
    },
    titleText: {
        fontFamily: Fonts.bold,
        fontSize: 18,
        paddingTop: 8,
        color: Colors.black1,
    },
    hashTagContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        columnGap : 8
    },
    hashTagText: {
        fontFamily: Fonts.medium,
        fontSize: 14,
        color: Colors.primary,
        marginBottom : 4
    },
    buttons: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    featureButtons: {
        flexDirection: 'row',
        gap : 12
    },
    buttonsContainer: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
        paddingLeft : 10,
        paddingRight : 14,
        backgroundColor : 'rgba(255, 255, 255, 0.45)',
        borderColor: 'rgba(255, 255, 255, 0.17)',
        borderWidth: 2,
        gap : 10,
        borderRadius: 8,
    },
    buttonText: {
        fontFamily: Fonts.reqular,
        fontSize: 14,
    },
    topWrapper : {
        gap : 12
    }
});
