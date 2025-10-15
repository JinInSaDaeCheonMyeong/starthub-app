import { StackScreenProps } from "@react-navigation/stack";
import { FlatList, ImageBackground, ScrollView, Text, View } from "react-native";
import { CompoetitorStackParamList } from "../../navigation/CompetitorStack";
import SubHeaderBar from "../../component/home/SubHeaderBar";

type HistoryScreenProps = StackScreenProps<CompoetitorStackParamList>

export function HistoryScreen({navigation} : HistoryScreenProps) {
    return (
        <ImageBackground
            style={{flex : 1, position : 'relative'}} 
            source={require("../../assets/images/glass-background.png")}
        >
            <SubHeaderBar
                handleBackPress={navigation.goBack}
                handleSubPress={async () => {
                    navigation.navigate('Select')
                }}
                title="내 경쟁사 분석"
                subIcon={
                    <View>
                        <Text>안녕</Text>
                    </View>
                }
            />
            <FlatList
                data={[1]}
                renderItem={() => {
                    return (
                        <View>

                        </View>
                    )
                }}
            />
        </ImageBackground>
    )
}