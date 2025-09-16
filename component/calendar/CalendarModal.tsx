import { BottomSheetBackdrop, BottomSheetFlashList, BottomSheetFlatList, BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet"
import React, { useCallback, useMemo, useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context";
import XIcon from "../../assets/icons/xmark.svg"
import { Colors } from "../../constants/Color";
import { Fonts } from "../../constants/Fonts";
import { NoticeItemType } from "../../type/notice/notice.type";
import NoticeItem from "../notice/NoticeItem";

export type CalendarModalProps = {
    day : string
    scheduleList : NoticeItemType[]
    bottomSheetModalRef : React.RefObject<BottomSheetModal | null>,
    handleModalClose : () => void
}

export default function CalendarModal({
    day,
    scheduleList,
    bottomSheetModalRef,
    handleModalClose
} : CalendarModalProps){
    const insets = useSafeAreaInsets()
    const {height : windowHeight} = useWindowDimensions()
    const snapPoints = useMemo(() => ['50%','100%'], []);
    const [headerHeight, setHeaderHeight] = useState(0);
    const [currentSnapIndex, setCurrentSnapIndex] = useState(0);
    const currentSnapHeight = currentSnapIndex === 0 ? windowHeight * 0.5 : windowHeight;
    const listMaxHeight = currentSnapHeight - headerHeight - 32 - insets.top - insets.bottom;
    return(            
        <BottomSheetModal
            handleStyle={styles.handleStyle}
            handleIndicatorStyle={styles.handleIndicator}
            ref={bottomSheetModalRef}
            snapPoints={snapPoints}
            topInset={insets.top}
            enablePanDownToClose={true}
            backdropComponent={(props) => (
                <BottomSheetBackdrop
                    {...props}
                    appearsOnIndex={0}
                    disappearsOnIndex={-1}
                    opacity={0.5}
                    onPress={() => {handleModalClose()}}
                />
            )}
            onChange={(index) => setCurrentSnapIndex(index)}
        >
            <BottomSheetView style={[
                    styles.bottomSheetView, 
                    {
                        paddingTop : insets.top,
                        paddingBottom : insets.bottom,
                    }
                ]}>
                    { scheduleList.length !== 0 ? (
                        <FlatList
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={styles.contentContainer}
                            style={[styles.flatList, { 
                                maxHeight: listMaxHeight,
                            }]}
                            keyExtractor={(item : NoticeItemType) => item.id.toString()}
                            keyboardShouldPersistTaps="handled"
                            data={scheduleList}
                            renderItem={({item}) => (
                                <NoticeItem
                                    {...item}
                                    isHome={false}
                                    onPress={() => {console.log(item.webLink)}}
                                />
                            )}
                        />
                    ) : (
                        <View style={styles.errorMsgBox}>
                            <Text style={styles.errorText}>
                                {`해당 날짜에 일정이 없습니다`}
                            </Text>
                        </View>
                    )}
                    <View style={styles.headerContainer}
                        onLayout={(e) => setHeaderHeight(e.nativeEvent.layout.height)}
                    >
                        <View style={styles.blankBox}/>
                        <Text style={styles.bottomSheetTitleText}>
                            {day}
                        </Text>
                        <TouchableOpacity onPress={handleModalClose} hitSlop={16}>
                            <XIcon width={16} height={16} color={Colors.black1}/>
                        </TouchableOpacity>
                    </View>
            </BottomSheetView>
        </BottomSheetModal>
    )
}

const styles = StyleSheet.create({
    handleStyle : {
        borderRadius : 16,
        backgroundColor : Colors.white1,
        paddingVertical : 16
    },
    handleIndicator : {
        width : 60,
        height : 4,
        backgroundColor : Colors.gray3,
    },
    bottomSheetView : {
        flex : 1,
        position: 'relative',
        borderRadius : 16
    },
    contentContainer : {
        gap : 16,
        padding : 16,
    },
    flatList : { 
        overflow : 'visible'
    },
    headerContainer : {
        position : 'absolute',
        flexDirection : 'row', 
        alignItems : 'center', 
        justifyContent : 'space-between',
        width : "100%",
        paddingHorizontal : 16,
        paddingTop : 8,
        paddingBottom : 24,
        borderBottomWidth : 2,
        borderColor : Colors.white2,
        backgroundColor : Colors.white1
    },
    blankBox : {
        width : 16, 
        height : 16
    },
    bottomSheetTitleText : {
        color : Colors.black1,
        fontFamily : Fonts.medium,
        fontSize : 14
    },
    errorMsgBox : {
        justifyContent : 'center',
        alignItems : 'center',
        margin : 32
    },
    errorText : {
        fontSize : 16,
        fontFamily : Fonts.semiBold,
        color : Colors.error
    }
})