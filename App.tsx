import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import RootStack from "./navigation/RootStack";
import {NavigationContainer} from "@react-navigation/native";
import Toast from "react-native-toast-message";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import toastConfig from "./lib/ToastConfig";
import { navigationRef } from "./util/NavigationService";
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";

export default function App() {
  return (
    <GestureHandlerRootView style={{flex : 1}}>
      <BottomSheetModalProvider>
        <SafeAreaProvider>
          <AppContent/>
        </SafeAreaProvider>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}

function AppContent() {
  const insets = useSafeAreaInsets()
  return (
    <NavigationContainer ref={navigationRef}>
      <RootStack />
      <Toast
        config={toastConfig}
        position="bottom"
        bottomOffset={insets.bottom + 86}
      />
    </NavigationContainer>
  );
}