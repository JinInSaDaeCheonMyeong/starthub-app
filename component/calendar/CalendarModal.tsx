import { BottomSheetBackdrop, BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet"
import React, { useCallback, useMemo } from "react";
import { Text } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context";

export type CalendarModalProps = {
    bottomSheetModalRef : React.RefObject<BottomSheetModal | null>,
    handleModalClose : () => void
}

export default function CalendarModal({
    bottomSheetModalRef,
    handleModalClose
} : CalendarModalProps){
    const insets = useSafeAreaInsets()
    const snapPoints = useMemo(() => ['50%', '100%'], []);

    return(            
        <BottomSheetModal
            ref={bottomSheetModalRef}
            snapPoints={snapPoints}
            index={0}
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
        >
            <BottomSheetView style={{
                    flex: 1,
                    alignItems: 'center',
                    paddingBottom : insets.bottom
                }}>
                    <Text>안녕</Text>
            </BottomSheetView>
        </BottomSheetModal>
    )
}