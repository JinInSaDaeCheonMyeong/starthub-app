import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import {Calendar, LocaleConfig} from 'react-native-calendars';
import { Colors } from "../../../constants/Color";
import { Fonts } from "../../../constants/Fonts";

LocaleConfig.locales['ko'] = {
    monthNames: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
    monthNamesShort: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
    dayNames: ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'],
    dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
    today: '오늘'
};

LocaleConfig.defaultLocale = 'ko';

export default function CalendarScreen() {
    return (
        <ScrollView style={{padding : 16}}>
            <Calendar
                style={{gap : 12,}}
                theme={{
                    calendarBackground : Colors.white1,
                    weekVerticalMargin : 0,
                    stylesheet : {
                        calendar : {
                            header : {
                                undefined
                            }
                        }
                    },
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