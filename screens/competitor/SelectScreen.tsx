import { StackScreenProps } from "@react-navigation/stack";
import { Text, View } from "react-native";
import { CompoetitorStackParamList } from "../../navigation/CompetitorStack";

type SelectScreenProps = StackScreenProps<CompoetitorStackParamList>

export default function SelectScreen({navigation} : SelectScreenProps){
    return (
        <View>
            <Text>SelectScreen</Text>
        </View>
    )
}