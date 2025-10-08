import React, {useCallback, useState} from 'react';
import {
    Alert, Linking,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    useWindowDimensions,
    View
} from 'react-native';
import RenderHtml from 'react-native-render-html';
import {StackScreenProps} from "@react-navigation/stack";
import {RootStackParamList} from "../../../navigation/RootStack";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import BackButton from "../../../component/BackButton";
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
import ComparisonIcon from "../../../assets/icons/notice/comparison.svg";
import {deleteLikes, postLikes} from "../../../api/likes";
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




type InNoticeScreenProps = StackScreenProps<RootStackParamList, 'InNotice'>;

export default function InNoticeScreen({navigation, route : {params}} : InNoticeScreenProps) {
    const notice = params.Notice
    const insets = useSafeAreaInsets();
    const source = {
        html: notice.content,
    };
    const [isSelected, setIsSelected] = useState(notice.isLiked)
    const [isBookmarkLoading, setIsBookmarkLoading] = useState(false)
    const [isSchedules, setIsSchedules] = useState(false)
    const [isScheduleLoading, setIsScheduleLoading] = useState(true)

    const handleBackPress = () => {
        navigation.goBack()
    };
    const handleBookmarkToggle = async () => {
        if (isBookmarkLoading) return

        setIsBookmarkLoading(true)
        try {
            if (isSelected) {
                await deleteLikes(notice.id)
            } else {
                await postLikes(notice.id)
            }

            const newIsLiked = !isSelected;
            setIsSelected(newIsLiked);
            if (params?.onGoBack) {
                params.onGoBack(notice.id, newIsLiked);
            }

        } catch (error) {
            console.error('북마크 토글 중 오류:', error)
        } finally {
            setIsBookmarkLoading(false)
        }
    }

    const handleSaveSchedules = async () => {
        if (isScheduleLoading) return
        setIsScheduleLoading(true)

        try {
            if(isSchedules){
                setIsSchedules(false)
                const announcementId = params.Notice.id
                await removeSchedules(announcementId)
                ShowToast("삭제 성공", "일정을 삭제하였습니다", ToastType.SUCCESS)
                return
            }
            const data : BaseScheduleType = {
                announcementId : params.Notice.id,
                startDate : formatToDate(params.Notice.startDate, 'solid'),
                endDate : formatToDate(params.Notice.endDate, 'solid')
            }
            await registerSchedules(data)
            setIsSchedules(true)
            ShowToast("추가 성공", "일정을 추가하였습니다", ToastType.SUCCESS)
        } catch (error) {
            ShowToast("오류 발생", "알 수 없는 오류가 발생하였습니다", ToastType.ERROR)
        } finally {
            setIsScheduleLoading(false)
        }
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
    }
    const { width } = useWindowDimensions();

    // 일정에 들어있는지 안들어있는지 검사하는 코드, 일정 추가 기능을 만들때 필요해서 작성함
    useFocusEffect(
        useCallback(() => {  
            const fetchIsSchedule = async () => {
                console.log(isScheduleLoading)
                setIsScheduleLoading(true);
                try {
                    const exists = (await getDateSchedules(
                        formatToDate(new Date(), 'solid'))
                    ).data.some((value) => value.id === params.Notice.id);
                    
                    setIsSchedules(exists)
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
                    ShowToast("오류 발생", "알 수 없는 오류가 발생하였습니다", ToastType.ERROR);
                    console.log(error);
                } finally {
                    setIsScheduleLoading(false)
                }
            }
            fetchIsSchedule(); // async 함수 호출
        }, [])
    )

    return (
        <View style={{paddingTop: insets.top, paddingBottom: insets.bottom}}>
            <SubHeaderBar
                title="공고"
                handleBackPress={handleBackPress}
            />
            <ScrollView style={{paddingHorizontal: 16}}>
                <View style={styles.topTitle}>
                    <View style={styles.topIconContainer}>
                        {categoryMap[notice.supportField as keyof typeof categoryMap]?.icon}
                    </View>
                    <Text style={styles.topLabelText}>
                        {categoryMap[notice.supportField as keyof typeof categoryMap]?.label}
                    </Text>
                    <Text style={styles.topDateText}>
                        {transformDate(notice.startDate)}~{transformDate(notice.endDate)}
                    </Text>
                </View>
                <Text style={styles.titleText}>
                    {notice.title}
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
                        <TouchableOpacity onPress={() => {
                            
                        }}>
                            <View style={styles.buttonsContainer}>
                                <ComparisonIcon width={18} height={18} color={Colors.primary}/>
                                <Text style={styles.buttonText}>
                                    공고 비교
                                </Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                            handleSaveSchedules()
                        }}>
                            <View style={styles.buttonsContainer}>
                                <CalendarIcon width={18} height={18} color={Colors.primary}/>
                                <Text style={styles.buttonText}>
                                    {`일정 ${isScheduleLoading ? '로딩 중' : isSchedules ? '삭제' : '추가'}`}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                        onPress={handleBookmarkToggle}
                        disabled={isBookmarkLoading}
                        activeOpacity={0.7}
                    >
                        {isSelected ? (
                            <BookMarkFill
                                width={24}
                                height={24}
                                fill={Colors.primary}
                                color={Colors.primary}
                            />
                        ) : (
                            <BookMark
                                width={24}
                                height={24}
                                color={Colors.primary}
                            />
                        )}
                    </TouchableOpacity>
                </View>
                <View>
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
                                    return (
                                        <View style={{
                                            transform: [
                                                { translateY: 7 },
                                            ]
                                        }}>
                                        <TouchableOpacity
                                            style={{
                                                borderColor: Colors.primary,
                                                borderWidth: 2,
                                                backgroundColor: Colors.primary,
                                                paddingHorizontal: 6,
                                                paddingVertical: 4,
                                                borderRadius: 4,
                                                alignSelf: 'center', // flex-start에서 center로 변경
                                                marginVertical: 0, // 2에서 0으로 변경하여 세로 여백 제거
                                                marginLeft: 4,
                                            }}
                                            onPress={() => {
                                                // 링크가 있다면 처리
                                                const href = tnode.attributes?.href;
                                                if (href) {
                                                    const matches = href.match(/'(.*?)'/) || [null, href];
                                                    const url = matches[1];
                                                    if (url) {
                                                        Alert.alert(
                                                            "링크 열기",
                                                            "외부 사이트로 이동하시겠습니까?",
                                                            [
                                                                { text: "취소", style: "cancel" },
                                                                {
                                                                    text: "이동",
                                                                    onPress: () => Linking.openURL(url)
                                                                }
                                                            ]
                                                        );
                                                    }
                                                }
                                            }}
                                        >
                                            <Text style={{
                                                color: Colors.white1,
                                                fontFamily: Fonts.semiBold,
                                                fontSize: 10,
                                                textAlign: 'center',
                                                alignItems: 'center'
                                            }}>
                                                {tnode.children?.map((child: any) => child.data || child.children?.[0]?.data).join('') || tnode.data || '버튼'}
                                            </Text>
                                        </TouchableOpacity>
                                        </View>
                                    );
                                }
                                // 일반 a 태그는 기본 렌더링
                                return <TDefaultRenderer tnode={tnode} {...props} />;
                            }
                        }}
                        renderersProps={{
                            a: {
                                onPress(event, href, htmlAttribs, target) {
                                    const matches = href.match(/'(.*?)'/)
                                    if (matches !== null) {
                                        const url: string = matches[1];
                                        Alert.alert(
                                            "링크 열기",
                                            "외부 사이트로 이동하시겠습니까?",
                                            [
                                                { text: "취소", style: "cancel" },
                                                {
                                                    text: "이동",
                                                    onPress: () => Linking.openURL(url)
                                                }
                                            ]
                                        );
                                    }
                                }
                            }
                        }}
                        classesStyles={{
                            title: {
                                fontFamily: Fonts.semiBold,
                                fontSize: 16,
                                color: Colors.black1,
                                paddingBottom: 6,
                            },
                            tit: {
                                fontFamily: Fonts.medium,
                                fontSize: 14,
                                color: Colors.black1,
                                paddingBottom: 6,
                            },
                            txt: {
                                fontFamily: Fonts.reqular,
                                fontSize: 12,
                                color: Colors.black1,
                                paddingBottom: 6,
                            },
                            "txt-button": {
                                fontSize: 12,
                                color: Colors.black1,
                                fontFamily: Fonts.reqular,
                            },
                            list: {
                                fontSize: 12,
                                fontFamily: Fonts.reqular,
                            },
                            dot_list: {
                                paddingBottom: 10,
                            }
                        }}
                    />
                </View>
                <View style={{height: insets.bottom + 30}}/>
            </ScrollView>
        </View>
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
        width: 40,
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
        height: 23,
        marginTop: 16,
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
        fontFamily: Fonts.reqular,
        fontSize: 14,

    },
    titleText: {
        fontFamily: Fonts.semiBold,
        fontSize: 18,
        paddingTop: 12,
        paddingBottom: 12,
        color: Colors.black1,
    },
    hashTagContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingBottom: 12,
    },
    hashTagText: {
        fontFamily: Fonts.medium,
        fontSize: 12,
        color: Colors.primary,
        paddingEnd: 12,
    },
    buttons: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 40,
        marginBottom: 28,
    },
    featureButtons: {
        flexDirection: 'row',
        height: 40
    },
    likeButton: {

    },
    buttonsContainer: {
        marginEnd: 12,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        borderColor: Colors.white2,
        borderWidth: 2,
        height: 40,
        width: 94,
        borderRadius: 8,
    },
    buttonText: {
        fontFamily: Fonts.semiBold,
        fontSize: 12,
    }
});