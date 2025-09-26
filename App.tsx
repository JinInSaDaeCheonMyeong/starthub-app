import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import RootStack from "./navigation/RootStack";
import {NavigationContainer} from "@react-navigation/native";
import Toast from "react-native-toast-message";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import toastConfig from "./lib/ToastConfig";

export default function App() {
  return (
    <GestureHandlerRootView style={{flex : 1}}>
      <BottomSheetModalProvider>
        <NavigationContainer>
          <RootStack />
          <Toast config={toastConfig}/>
        </NavigationContainer>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
