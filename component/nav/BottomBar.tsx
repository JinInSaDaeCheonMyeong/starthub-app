import {BottomTabBarProps} from "@react-navigation/bottom-tabs";
import {View, StyleSheet, Text, TouchableOpacity} from "react-native";
import {Colors} from "../../constants/Color";
import {Shadow} from "react-native-shadow-2";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import HomeIcon from "../../assets/icons/bottom/home.svg"
import NoticeIcon from "../../assets/icons/bottom/notice.svg"
import CalendarIcon from "../../assets/icons/bottom/calendar.svg"
import BMCIcon from "../../assets/icons/bottom/BMC.svg"



export const BottomBar: React.FC<BottomTabBarProps> = ({state, descriptors, navigation}) => {
    const insets = useSafeAreaInsets();
    const labelMap = new Map<string, string>([
        ['Home', '홈'],
        ['Notice', '공고'],
        ['Calendar', '달력'],
        ['BMC', 'BMC']
    ]);
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
    return (
        <Shadow distance={8} offset={[0, 4]} startColor="rgba(155, 155, 155, 0.2)">
            <View style={[styles.container, { paddingBottom: insets.bottom + 12}]}>
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
    itemContainer: {
        paddingTop : 16,
        flexDirection: "column",
        width: 35,
        alignItems: "center",
    },
    labelText : {
        paddingTop: 8,
        fontSize: 12,
        fontFamily: 'Pretendard-Medium',
    }
})