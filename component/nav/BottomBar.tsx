import {BottomTabBarProps} from "@react-navigation/bottom-tabs";
import {View, StyleSheet, Text, TouchableOpacity, LayoutChangeEvent} from "react-native";
import {Colors} from "../../constants/Color";
import {Shadow} from "react-native-shadow-2";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import HomeIcon from "../../assets/icons/bottom/home.svg"
import NoticeIcon from "../../assets/icons/bottom/notice.svg"
import CalendarIcon from "../../assets/icons/bottom/calendar.svg"
import BMCIcon from "../../assets/icons/bottom/BMC.svg"
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";
import {useEffect, useState} from "react";



export const BottomBar: React.FC<BottomTabBarProps> = ({state, navigation}) => {
    const insets = useSafeAreaInsets();
    const [barWidth, setBarWidth] = useState(0);
    const indicatorX = useSharedValue(0);
    const labelMap = new Map<string, string>([
        ['Home', '홈'],
        ['Notice', '공고'],
        ['Calendar', '달력'],
        ['BMC', 'BMC']
    ]);
    const horizontalPadding = 40;
    const contentWidth = Math.max(barWidth - horizontalPadding * 2, 0);
    const itemWidth = contentWidth > 0 ? contentWidth / state.routes.length : 0;

    useEffect(() => {
        if (itemWidth <= 0) return;
        indicatorX.value = withTiming(state.index * itemWidth, {duration: 180});
    }, [indicatorX, itemWidth, state.index]);

    const indicatorStyle = useAnimatedStyle(() => ({
        opacity: itemWidth > 0 ? 1 : 0,
        transform: [{
            translateX: indicatorX.value + (itemWidth - styles.indicator.width) / 2,
        }],
    }));

    const getTabIcon = (routeName: string, color: string) => {
        switch (routeName) {
            case 'Home':
                return <HomeIcon width={24} height={24} color={color} />;
            case 'Notice':
                return <NoticeIcon width={24} height={24} color={color} />;
            case 'Calendar':
                return <CalendarIcon width={24} height={24} color={color} />;
            case 'BMC':
                return <BMCIcon width={24} height={24} color={color} />;
            default:
                return null;
        }
    };

    const handleLayout = (event: LayoutChangeEvent) => {
        setBarWidth(event.nativeEvent.layout.width);
    };

    return (
        <Shadow distance={8} offset={[0, 4]} startColor="rgba(155, 155, 155, 0.2)">
            <View
                onLayout={handleLayout}
                style={[styles.container, { paddingBottom: insets.bottom + 12}]}
            >
                <Animated.View style={[styles.indicator, indicatorStyle]} />
                {state.routes.map((route, index) => {
                    const label = labelMap.get(route.name) ?? route.name;
                    const isFocused = state.index === index;
                    const color = isFocused? Colors.primary : Colors.gray2
                    const onPress = () => {
                        const event = navigation.emit({
                            type: 'tabPress',
                            target: route.key,
                            canPreventDefault: true,
                        });

                        if (!isFocused && !event.defaultPrevented) {
                            navigation.navigate(route.name);
                        }
                    };
                    return (
                        <TouchableOpacity key={route.key}
                                          onPress={onPress}
                                          style={styles.itemContainer}
                                          activeOpacity={0.7}
                                          hitSlop={{left : 16, right : 16}}
                        >
                            {getTabIcon(route.name, color)}
                            {label && <Text style={[styles.labelText, {color:color}]}>{label}</Text>}
                        </TouchableOpacity>
                    )}
                )}
            </View>
        </Shadow>
    );
}
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        minHeight: 74,
        width: '100%',
        backgroundColor: Colors.white1,
        justifyContent: 'space-between',
        paddingHorizontal: 40
    },
    indicator: {
        position: 'absolute',
        top: 8,
        left: 40,
        width: 24,
        height: 3,
        borderRadius: 999,
        backgroundColor: Colors.primary,
    },
    itemContainer: {
        paddingTop : 16,
        flexDirection: "column",
        alignItems: "center",
        flex: 1,
    },
    labelText : {
        paddingTop: 8,
        fontSize: 12,
        fontFamily: 'Pretendard-Medium',
    }
})
