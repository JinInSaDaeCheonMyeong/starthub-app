import React, {useState} from 'react';
import {
    View,
    Text,
    StyleSheet, ScrollView, Dimensions, TouchableOpacity,
    ImageBackground,
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

export default function InBMCScreen({navigation, route : {params}} : InBMCScreenProps) {
    const handleBackPress = () => {
        navigation.goBack()
    };
    const buttonSide = (width-96)/5
    const [selectValue, setSelectValue] = useState<SelectBMCValue>(SelectBMCValue.keyPartners);
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
    return (
        <ImageBackground 
            style={[styles.container,{paddingTop: insets.top, paddingBottom: insets.bottom}]}
            source={require("../../../assets/images/glass-background.png")}
        >
            <SubHeaderBar
                title={params.BMC.title}
                handleBackPress={handleBackPress}
            />
            <ScrollView>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{flexWrap: 'wrap', flexDirection: 'row', paddingStart: 16, paddingTop: 20, paddingBottom: 24}}>
                        {values.map((value, index) => {
                            const Icon = value.icon;
                            const isSelected = value.itemValue === selectValue;
                            const backGroundColor = isSelected ? Colors.primary : Colors.white1;
                            const iconColor = isSelected ? Colors.white1 : Colors.primary;

                            return (
                                <TouchableOpacity key={index} onPress={() => setSelectValue(value.itemValue)}>
                                    <View style={{
                                        width: buttonSide,
                                        height: buttonSide,
                                        backgroundColor: backGroundColor,
                                        marginEnd: 16,
                                        marginBottom: 16,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        borderColor: Colors.primary,
                                        borderWidth: 2,
                                        borderRadius: 8
                                    }}>
                                        <Icon color={iconColor} width={buttonSide*0.4} height={buttonSide*0.4} />
                                    </View>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                    <View style={{height: 2, width: width-32, paddingHorizontal: 16, backgroundColor: Colors.white2}}/>
                    <View style={{width: width - 32, alignItems: 'flex-start'}}>
                        <Text style={{
                            paddingTop: 24,
                            paddingBottom: 12,
                            fontSize: 18,
                            fontFamily: Fonts.semiBold,
                            color: Colors.black1,
                        }}>
                            {selectValue}
                        </Text>
                        <Text style={{
                            fontSize: 16,
                            fontFamily: Fonts.medium,
                        }}>
                                {bmcBlockMap[selectValue]}
                        </Text>
                    </View>

                </View>
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
    }
});
