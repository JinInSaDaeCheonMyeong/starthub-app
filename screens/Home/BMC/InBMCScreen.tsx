import React, {useState} from 'react';
import {
    View,
    Text,
    StyleSheet, ScrollView, Dimensions, TouchableOpacity,
    ImageBackground,
    Platform,
} from 'react-native';
import { Colors } from '../../../constants/Color';
import { Fonts } from '../../../constants/Fonts';
import {StackScreenProps} from "@react-navigation/stack";
import {RootStackParamList} from "../../../navigation/RootStack";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {SelectBMCValue} from "../../../type/BMC/BMC.type";
import ChannelsIcon from "../../../assets/icons/bmc/channels.svg"
import CostStructureIcon from "../../../assets/icons/bmc/cost_structure.svg"
import CustomerRelationshipsIcon from "../../../assets/icons/bmc/customer_relationships.svg"
import CustomerSegmentsIcon from "../../../assets/icons/bmc/customer_segments.svg"
import KeyActivitiesIcon from "../../../assets/icons/bmc/key_activities.svg"
import KeyPartnersIcon from "../../../assets/icons/bmc/key_partners.svg"
import KeyResourcesIcon from "../../../assets/icons/bmc/key_resources.svg"
import RevenueStreamsIcon from "../../../assets/icons/bmc/revenue_streams.svg"
import ValuePropositionIcon from "../../../assets/icons/bmc/value_proposition.svg"
import SubHeaderBar from '../../../component/home/SubHeaderBar';
import GlassView from '../../../component/GlassView';
import { DefaultImage } from '../../../constants/AppImages';
import { Image } from 'expo-image';


const {width} = Dimensions.get('window');


type InBMCScreenProps = StackScreenProps<RootStackParamList, 'InBMC'>;

const values = [
    {
        itemValue: SelectBMCValue.keyPartners,
        icon: KeyPartnersIcon,
    },
    {
        itemValue: SelectBMCValue.keyActivities,
        icon: KeyActivitiesIcon
    },
    {
        itemValue: SelectBMCValue.valueProposition,
        icon: ValuePropositionIcon,
    },
    {
        itemValue: SelectBMCValue.customerRelationships,
        icon: CustomerRelationshipsIcon,
    },
    {
        itemValue: SelectBMCValue.customerSegments,
        icon: CustomerSegmentsIcon,
    },
    {
        itemValue: SelectBMCValue.keyResources,
        icon: KeyResourcesIcon
    },
    {
        itemValue: SelectBMCValue.channels,
        icon: ChannelsIcon,
    },
    {
        itemValue: SelectBMCValue.costStructure,
        icon: CostStructureIcon,
    },
    {
        itemValue: SelectBMCValue.revenueStreams,
        icon: RevenueStreamsIcon,
    }
]
const backgroundImage = DefaultImage.background
const defaultBMCImage = DefaultImage.bmc
export default function InBMCScreen({navigation, route : {params}} : InBMCScreenProps) {
    const handleBackPress = () => {
        navigation.goBack()
    };
    const buttonSide = (width-96)/5
    const [selectValue, setSelectValue] = useState<SelectBMCValue>(SelectBMCValue.keyPartners);
    const imageSource = params.BMC.imageUrl
    const insets = useSafeAreaInsets();
    const bmcBlockMap: Record<SelectBMCValue, string> = {
        [SelectBMCValue.keyPartners]: params.BMC.keyPartners,
        [SelectBMCValue.keyActivities]: params.BMC.keyActivities,
        [SelectBMCValue.valueProposition]: params.BMC.valueProposition,
        [SelectBMCValue.customerRelationships]: params.BMC.customerRelationships,
        [SelectBMCValue.customerSegments]: params.BMC.customerSegments,
        [SelectBMCValue.keyResources]: params.BMC.keyResources,
        [SelectBMCValue.channels]: params.BMC.channels,
        [SelectBMCValue.costStructure]: params.BMC.costStructure,
        [SelectBMCValue.revenueStreams]: params.BMC.revenueStreams,
    };
    
    const [imageError, setImageError] = useState<boolean>(!imageSource);
    return (
        <ImageBackground 
            style={[styles.container,{paddingTop: insets.top, paddingBottom: insets.bottom}]}
            source={backgroundImage}
        >
            <SubHeaderBar
                title={params.BMC.title}
                handleBackPress={handleBackPress}
            />
            <ScrollView contentContainerStyle={{gap : 24, paddingHorizontal : 16, paddingVertical : 16}}>
                <View style={[styles.bmcImage]}>
                <Image
                    source={imageError || !imageSource ? defaultBMCImage : {uri : imageSource, cache : 'force-cache'}}
                    contentFit="contain"
                    placeholder={defaultBMCImage}
                    style={styles.bmcImage}
                    onError={() => {
                        setImageError(true)
                    }}
                />
                    {imageError && (
                        <View style={styles.dummyOverlay}>
                            <Text style={styles.dummyText}>이미지가 없습니다</Text>
                        </View>
                    )}
                </View>
                <View style={{flexWrap: 'wrap', flexDirection: 'row', rowGap : 16, columnGap : 16}}>
                    {values.map((value, index) => {
                        const Icon = value.icon;
                        const isSelected = value.itemValue === selectValue;
                        const backgroundColor = isSelected ? 'rgba(36, 102, 244, 0.6)' : Colors.white1;
                        const iconColor = isSelected ? Colors.white1 : Colors.second;
                        const borderColor = isSelected ? Colors.primary : Colors.white1
                        const overlayColor = Platform.OS === 'android' ? isSelected ? 'rgba(255, 255, 255, 0)' : undefined : undefined
                        return (
                            <TouchableOpacity key={index} onPress={() => setSelectValue(value.itemValue)}>
                                <GlassView containerStyle={{
                                        width: buttonSide,
                                        height: buttonSide,
                                        backgroundColor: backgroundColor,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        borderColor: borderColor,
                                        borderWidth: 1,
                                        borderRadius: 8
                                    }} 
                                    overlayColor={overlayColor}
                                >
                                    <Icon color={iconColor} width={buttonSide*0.4} height={buttonSide*0.4} />
                                </GlassView>
                            </TouchableOpacity>
                        );
                    })}
                </View>
                <GlassView containerStyle={{paddingVertical : 20, paddingHorizontal : 16, gap : 12, borderColor : 'rgba(255, 255, 255, 0.5)'}}>
                    <Text style={{
                        fontSize: 18,
                        fontFamily: Fonts.semiBold,
                        color: Colors.black1,
                    }}>
                        {selectValue}
                    </Text>
                    <Text style={{
                        fontSize: 16,
                        fontFamily: Fonts.medium,
                        color : Colors.black1
                    }}>
                            {bmcBlockMap[selectValue]}
                    </Text>
                </GlassView>
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
        borderBottomWidth: 1,
        borderBottomColor: Colors.gray3,
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
    dummyOverlay: {
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(255,255,255,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    bmcImage : {
        width: 'auto',
        height : 250,
        backgroundColor : Colors.white1,
        borderWidth : 1,
        borderColor : Colors.gray4,
    },
    dummyText: {
        color: Colors.gray2,
        fontSize: 14,
        fontFamily: Fonts.medium,
    },
});
