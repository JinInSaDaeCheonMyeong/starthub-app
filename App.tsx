import 'react-native-reanimated';
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import RootStack from "./navigation/RootStack";
import { NavigationContainer } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import toastConfig from "./lib/ToastConfig";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { useEffect, useState } from "react";
import { Keyboard, Platform } from "react-native";
import { saveFCMToken } from "./util/token";
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";
import { navigationRef } from "./util/NavigationService";
import messaging from '@react-native-firebase/messaging';

messaging().setBackgroundMessageHandler(async () => {});

const requestUserPermission = async (): Promise<string | null> => {
  try {
    const authorizationStatus = await messaging().requestPermission();

    if (
        authorizationStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authorizationStatus === messaging.AuthorizationStatus.PROVISIONAL
    ) {
      return await messaging().getToken();
    }
    return null;
  } catch {
    return null;
  }
};

Notifications.setNotificationHandler({
  handleNotification: async (): Promise<Notifications.NotificationBehavior> => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

async function setupNotificationChannels() {
  if (Platform.OS !== "android") return;

  const channels = [
    { id: "AI_RECOMMENDATION", name: "AI 추천 공고", lightColor: "#FF231F7C" },
    { id: "INTEREST_CATEGORY", name: "관심 공고", lightColor: "#00FF00" },
    { id: "DEADLINE", name: "마감 임박 공고", lightColor: "#00FF00" },
  ];

  await Promise.all(
      channels.map((ch) =>
          Notifications.setNotificationChannelAsync(ch.id, {
            name: ch.name,
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: ch.lightColor,
            sound: "default",
          })
      )
  );
}

async function registerForPushNotificationsAsync(): Promise<string | null> {
  if (!Device.isDevice) return null;

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") return null;

  return await requestUserPermission();
}

function App() {
  useEffect(() => {
    const initializeApp = async () => {
      await setupNotificationChannels();

      const token = await registerForPushNotificationsAsync();
      if (token) {
        await saveFCMToken(token).catch(() => {});
      }
    };

    initializeApp();

    const unsubscribeMessaging = messaging().onMessage(async (remoteMessage) => {
      if (remoteMessage.notification) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: remoteMessage.notification.title || '알림',
            body: remoteMessage.notification.body || '',
            data: remoteMessage.data,
          },
          trigger: null,
        });
      }
    });

    const unsubscribeTokenRefresh = messaging().onTokenRefresh(async (token) => {
      await saveFCMToken(token).catch(() => {});
    });

    return () => {
      unsubscribeMessaging();
      unsubscribeTokenRefresh();
    };
  }, []);

  return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <BottomSheetModalProvider>
          <SafeAreaProvider>
            <AppContent />
          </SafeAreaProvider>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
  );
}

export default App;

function AppContent() {
  const insets = useSafeAreaInsets();
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const showSubscription = Keyboard.addListener(
        Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
        (e) => setKeyboardHeight(e.endCoordinates.height)
    );
    const hideSubscription = Keyboard.addListener(
        Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
        () => setKeyboardHeight(0)
    );

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  return (
      <NavigationContainer ref={navigationRef}>
        <RootStack />
        <Toast
            config={toastConfig}
            position="bottom"
            bottomOffset={
              keyboardHeight > 0
                  ? (Platform.OS === "ios" ? keyboardHeight + 86 : 92)
                  : insets.bottom + (Platform.OS === "ios" ? 86 : 92)
            }
        />
      </NavigationContainer>
  );
}
