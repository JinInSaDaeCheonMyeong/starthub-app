import { Image, ImageBackground, Pressable, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from "react-native";
import { Colors } from "../../constants/Color";
import { BannerType } from "../../type/banner/banner.type";
import { Fonts } from "../../constants/Fonts";

export default function Banner({
    title,
    peroid,
    index,
    maxIndex,
    onPress
} : BannerType & {onPress : () => void}) {
    return (
        <Pressable
            onPress={() => {onPress()}}
            style={{flex : 1}}
        >
        <ImageBackground
            source={require('../../assets/images/banner/banner.png')}
            style={styles.bannerContainer}
            imageStyle={{borderRadius : 16}}
        >
            <View style={{
                flex : 1,
                paddingHorizontal : 20,
                justifyContent : 'center',
                gap : 6
            }}>
                <Text 
                    numberOfLines={2} 
                    ellipsizeMode="tail" 
                    style={styles.titleText}
                >
                    {title}
                </Text>
                <Text style={styles.peroidText}>{`모집 : ${peroid}`}</Text>
                <Text style={styles.indexText}>
                    {index}/
                    <Text style={{color : Colors.white2}}>
                        {maxIndex}
                    </Text>
                </Text>
            </View>
        </ImageBackground>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    bannerContainer : {
        flex: 1,
        backgroundColor : Colors.info,
        marginHorizontal : 16,
        borderRadius : 16,
        position : 'relative',
        overflow : 'hidden'
    },
    titleText : { 
        fontSize: 20, 
        color: Colors.white1,
        fontFamily : Fonts.bold,
    },
    peroidText : {
        fontSize: 16, 
        fontFamily : Fonts.semiBold,
        color: Colors.white1,
    },
    indexText : {
        fontSize: 14,
        fontFamily : Fonts.medium,
        color: Colors.white1,
        bottom : 16,
        right : 16,
        position : 'absolute'
    }
})