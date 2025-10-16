import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import RootStack from "./navigation/RootStack";
import {NavigationContainer} from "@react-navigation/native";
import Toast from "react-native-toast-message";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import toastConfig from "./lib/ToastConfig";
import { navigationRef } from "./util/NavigationService";

export default function App() {
  return (
    <GestureHandlerRootView style={{flex : 1}}>
      <BottomSheetModalProvider>
        <NavigationContainer ref={navigationRef}>
          <RootStack />
          <Toast config={toastConfig}/>
        </NavigationContainer>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
