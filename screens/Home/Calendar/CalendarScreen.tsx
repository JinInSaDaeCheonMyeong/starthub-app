import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import {Calendar, LocaleConfig} from 'react-native-calendars';
import { Colors } from "../../../constants/Color";
import { Fonts } from "../../../constants/Fonts";
import { formatToDate } from "../../../util/DateFormat";
import LeftIcon from "../../../assets/icons/left-arrow-back.svg"
import RightIcon from "../../../assets/icons/right-arrow-back.svg"

LocaleConfig.defaultLocale = 'ko';

export default function CalendarScreen() {
    const dotInfoList = [
        { color: Colors.info, text: "마감 4주전" },
        { color: Colors.warning, text: "마감 2주전" },
        { color: Colors.error, text: "마감 1주전" },
    ];
    const dayDataList = ['일', '월', '화', '수', '목', '금', '토']

    return (
        <ScrollView 
            showsVerticalScrollIndicator={false}
            style={{padding : 16}}
        >
            <Calendar
                style={{gap : 8, marginBottom : 24}}
                theme={{
                    calendarBackground : Colors.white1,
                    weekVerticalMargin : 0,
                }}
                onDayPress={(day) => {console.log(day)}}
                markingType={"multi-dot"}
                markedDates={{
                    "2025-09-15": {
                        dots: [{ color: "blue" }, { color: "red" }, { color: "blue" }],
                        selected: true,
                        selectedColor: "blue",
                    },
                    "2025-09-16": {
                        dots: [{ color: "blue" }, { color: "red" }, { color: "blue" }],
                        selected: true,
                        selectedColor: "blue",
                    },
                }}
                customHeader={(props : any) => {
                    return (
                        <View style={{
                            gap : 8
                        }}>
                            <View style={{
                                justifyContent : 'space-between',
                                alignItems : 'center',
                                flexDirection : 'row'
                            }}>
                                <Text style={{
                                    fontFamily : Fonts.semiBold,
                                    fontSize : 20
                                }}>
                                    {formatToDate(props.month, "calendar")}
                                </Text>
                                <View style={{
                                    flexDirection : 'row',
                                    gap : 16
                                }}>
                                    <TouchableOpacity hitSlop={8} onPress={() => props.addMonth(-1)}>
                                        <LeftIcon width={20} height={20} color={Colors.black2}/>
                                    </TouchableOpacity>
                                    <TouchableOpacity hitSlop={8} onPress={() => props.addMonth(1)}>
                                        <RightIcon width={20} height={20} color={Colors.black2}/>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={{
                                flexDirection : 'row',
                                gap : 8
                            }}>
                                {dotInfoList.map((value, index) => (
                                    <View style={{flexDirection : 'row', alignItems : 'center', gap : 6, padding : 4}} key={index}>
                                        <View style={{
                                            width : 10,
                                            height : 10,
                                            borderRadius : 5,
                                            backgroundColor : value.color
                                        }}/>
                                        <Text style={{
                                            fontFamily : Fonts.medium,
                                            fontSize : 14, 
                                            color : Colors.black2
                                        }}>
                                            {value.text}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                            <View style={{
                                flexDirection : 'row',
                                paddingVertical : 6,
                                marginTop : 16
                            }}>
                                {dayDataList.map((value, index) => (
                                    <View key={index} 
                                    style={{
                                        flex : 1
                                    }}>
                                    <Text style={{
                                        color : index === 0 ? Colors.error : index === 6 ? Colors.info : Colors.black2,
                                        fontSize : 14,
                                        fontFamily : Fonts.medium,
                                        textAlign : 'center'
                                    }}>
                                            {value}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    );
                }}
                dayComponent={({date, state, marking, onPress}) => {
                    return (
                        <TouchableOpacity 
                            style={{
                                alignItems : 'center',
                                paddingHorizontal : 10,
                                height : 90,
                                backgroundColor : state !== 'disabled' ? Colors.white1 : Colors.white2
                            }}
                            onPress={() => {onPress !== undefined ? onPress(date) : console.log(date)}}
                        >
                            <View style={{
                                padding: 6, 
                                width : 30,
                                height : 30,
                                borderRadius : 15, 
                                backgroundColor : state === 'today' ? Colors.primary : undefined,
                                alignItems : 'center',
                                justifyContent : 'center',
                            }}>
                                <Text style={{
                                    color : state === 'today' ? Colors.white1 : state === 'disabled' ? Colors.gray3 : Colors.black2,
                                    fontFamily : Fonts.medium,
                                    fontSize : 14
                                }}>
                                    {date?.day}
                                </Text>
                            </View>
                            {marking?.dots && (
                                <View style={{
                                    flexDirection : 'row', 
                                    marginTop: 6,
                                    alignItems : 'center',
                                    justifyContent : 'center'
                                }}>
                                    {marking.dots.map((dot, index) => (
                                        <View
                                            key={index}
                                            style={{
                                                width : 6,
                                                height : 6,
                                                borderRadius : 3,
                                                backgroundColor : dot.color,
                                                marginHorizontal: 1,
                                            }}
                                        />
                                    ))}
                                </View>
                            )}
                        </TouchableOpacity>
                    )
                }}
            />
        </ScrollView>
    )
}