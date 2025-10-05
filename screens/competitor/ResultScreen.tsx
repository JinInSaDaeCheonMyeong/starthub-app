import { Text, View } from "react-native";
import { CompoetitorStackParamList } from "../../navigation/CompetitorStack";
import { StackScreenProps } from "@react-navigation/stack";

type ResultScreenProps = StackScreenProps<CompoetitorStackParamList>

export default function ResultScreen({navigation} : ResultScreenProps){
    return (
        <View>
            <Text>ResultScreen</Text>
        </View>
    )
}