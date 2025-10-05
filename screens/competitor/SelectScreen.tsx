import { StackScreenProps } from "@react-navigation/stack";
import { FlatList, Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { CompoetitorStackParamList } from "../../navigation/CompetitorStack";
import SubHeaderBar from "../../component/home/SubHeaderBar";
import { Colors } from "../../constants/Color";
import { Fonts } from "../../constants/Fonts";
import { useEffect, useState } from "react";
import { BMCType, GetBMCsResponse } from "../../type/BMC/BMC.type";
import { getBMCs } from "../../api/bmc";
import { formatToDate } from "../../util/DateFormat";
import { Shadow } from "react-native-shadow-2";

type SelectScreenProps = StackScreenProps<CompoetitorStackParamList>

export default function SelectScreen({navigation} : SelectScreenProps){
    const [allBMCs, setAllBMCs] = useState<BMCType[]>([]);
    const [selectBMC, setSelectBMC] = useState<number | undefined>(undefined)
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBMCs = async () => {
            try {
                const response: GetBMCsResponse = await getBMCs();
                setAllBMCs(response.data);
            } catch (error) {
                console.error('BMC 데이터 로딩 실패:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchBMCs();
    }, []);

    return (
        <ImageBackground 
            style={{flex : 1}} 
            source={require("../../assets/images/glass-background.png")}
        >
            <SubHeaderBar
                handleBackPress={navigation.goBack}
                handleSubPress={() => {
                    navigation.navigate('Result', {
                    image : require('../../assets/images/bmc-thumbnail-exam.png')})
                }}
                title="BMC 선택"
                subIcon="Profile"
            />
            <FlatList
                style={{flex : 1}}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{gap : 16, padding : 16}}
                data={allBMCs}
                renderItem={({ item }) => {
                    const selected = item.id === selectBMC;
                    
                    const content = (
                        <View style={{ borderRadius: 8, overflow: 'hidden' }}>
                        <View style={[styles.myBMCBox, { width: '100%' }]}>
                            <View
                            style={{
                                backgroundColor: Colors.white2,
                                borderTopLeftRadius: 8,
                                borderTopRightRadius: 8,
                            }}
                            >
                            <Image
                                source={require('../../assets/images/bmc-thumbnail-exam.png')}
                                style={styles.myBMCThumbnail}
                            />
                            </View>
                            <View style={[styles.BMCContentContainer, { backgroundColor: Colors.white1 }]}>
                            <View style={styles.BMCTextContainer}>
                                <Text style={styles.titleText}>{item.title}</Text>
                                <Text style={styles.dateText}>
                                {formatToDate(item.updatedAt, 'solid')}
                                </Text>
                            </View>
                            </View>
                    
                            {!selected && selectBMC !== undefined && (
                            <View
                                style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                backgroundColor: 'rgba(255, 255, 255, 0.6)',
                                borderRadius: 8,
                                }}
                            />
                            )}
                        </View>
                        </View>
                    );
                    
                    return (
                        <TouchableOpacity
                        style={{ position: 'relative' }}
                        onPress={() => setSelectBMC(selected ? undefined : item.id)}
                        >
                        {selected ? (
                            <Shadow
                            offset={[0, 4]}
                            distance={16}
                            startColor="rgba(72, 130, 255, 0.4)"
                            style={{ width: '100%' }}
                            >
                            {content}
                            </Shadow>
                        ) : (
                            content
                        )}
                        </TouchableOpacity>
                    );
                }}
                ListEmptyComponent={() => (
                    !loading ?
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyContainerText}>존재하는 공고가 없습니다.</Text>
                        </View>: <View/>
                )}
            />
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    BMCContentContainer: {
        width: '100%',
        flexDirection: 'row',
        backgroundColor: Colors.white1,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
    },
    BMCTextContainer: {
        flexDirection: 'column',
        gap : 6,
        paddingStart: 12
    },
    titleText: {
        marginTop : 16,
        fontSize: 16,
        fontFamily: Fonts.medium,
    },
    dateText: {
        fontSize: 14,
        fontFamily: Fonts.reqular,
        color: Colors.gray2,
    },
    myBMCBox: {
        backgroundColor: Colors.white1,
        borderRadius: 8,
        flexDirection: 'column',
        paddingBottom : 16,
        borderColor: Colors.white2,
        borderWidth: 2,
    },
    myBMCThumbnail: {
        paddingHorizontal: 8,
        paddingVertical :8,
        backgroundColor: Colors.white2,
        width: '100%',
        resizeMode: 'cover',
        height: 200,
    },
    emptyContainerText: {
        fontSize: 18,
        color: Colors.gray2,
        fontFamily: Fonts.medium
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        width: "100%",
    },
})