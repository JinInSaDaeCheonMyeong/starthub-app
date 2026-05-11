import { StyleSheet, Text, TextInput, View } from "react-native";
import CategorySelectButton from "../../../../component/auth/CategorySelectButton";
import { Colors } from "../../../../constants/Color";
import { InterestTypeList } from "../../../../constants/InterestTypeList";
import { Fonts } from "../../../../constants/Fonts";
import { StartupField } from "../../../../type/user/companyInput.type";
import {FlashList} from "@shopify/flash-list";
import ListEmptyState from "../../../../component/ListEmptyState";

type PreInterestScreenProps = {
    startupLocation : string
    setStartupLocation : (companyLocation : string) => void
    startupFields: StartupField[];
    setStartupFields: (list: StartupField[]) => void;
}

export default function PreInterestScreen(props : PreInterestScreenProps){

    return(
        <View style={styles.mainContainer}>
                <View style={styles.inputBox}>
                    <View style={styles.textBox}>
                        <Text style={styles.subText}>창업 위치를 입력해주세요!</Text>
                        <Text style={styles.mainText}>(선택) 위치에 알맞는 공고를 추천드릴게요!</Text>
                    </View>
                    <TextInput
                        style={styles.inputText}
                        placeholder="창업 위치를 입력해주세요..."
                        placeholderTextColor={Colors.gray3}
                        value={props.startupLocation}
                        onChangeText={(s) => {props.setStartupLocation(s)}}
                    />
                </View>
            <View style={{gap : 24}}>
            <View style={styles.textBox}>
                <Text style={styles.subText}>드디어 마지막입니다!</Text>
                <Text style={styles.mainText}>창업 분야를 1개 이상 선택해주세요!</Text>
            </View>
            <FlashList
                scrollEnabled={false}
                data={InterestTypeList}
                removeClippedSubviews={true}
                showsVerticalScrollIndicator={false}
                contentContainerStyle = {styles.listContentContainer}
                ListEmptyComponent={
                    <ListEmptyState
                        message="선택 가능한 창업 분야 항목이 없습니다."
                        style={styles.emptyState}
                    />
                }
                renderItem={({item : {id, color, text, icon}}) => {
                    const selectItem : StartupField = {
                        businessType : id,
                        customField : text
                    }
                    return (
                        <CategorySelectButton
                            key={id}
                            id={id}
                            color={color}
                            text={text}
                            icons={icon}
                            onClick={() => {
                                const isSelected = props.startupFields.some(field => field.businessType === id);
                            
                                if (isSelected) {
                                    props.setStartupFields(props.startupFields.filter(field => field.businessType !== id));
                                } else {
                                    props.setStartupFields([...props.startupFields, selectItem]);
                                }
                            }}
                            selected={props.startupFields.some(field => field.businessType === id)}
                        />
                    )
                }}
            />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer : {
        flex : 1,
        gap : 48,
        overflow : "hidden"
    },
    inputBox : {
        gap : 16,
    },
    textBox : {
        gap : 4
    },
    categorySelectContainer : {
        gap : 16
    },
    subText : {
        fontSize : 16,
        fontFamily : Fonts.medium,
        color : Colors.black2
    },
    mainText : {
        fontSize : 20,
        fontFamily : Fonts.bold,
        color : Colors.black2
    },
    listContentContainer : {
        gap : 16
    },
    emptyState: {
        minHeight: 120,
    },
    inputText : {
        fontSize : 18,
        color : Colors.black2,
        fontFamily : Fonts.medium
    },
})
