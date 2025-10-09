import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import RootStack from "./navigation/RootStack";
import { NavigationContainer } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import toastConfig from "./lib/ToastConfig";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { useEffect, useRef, useState } from "react";
import { Platform } from "react-native";

Notifications.setNotificationHandler({
  handleNotification:
    async (): Promise<Notifications.NotificationBehavior> => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
      shouldShowBanner : true,
      shouldShowList : true
    }),
});

async function setupNotificationChannels() {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("AI_RECOMMENDATION", {
      name: "AI 추천 공고",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
      sound: "default",
    });

    await Notifications.setNotificationChannelAsync("INTEREST_CATEGORY", {
      name: "관심 공고",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#00FF00",
      sound: "default",
    });

    await Notifications.setNotificationChannelAsync("DEADLINE", {
      name: "마감 임박 공고",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#00FF00",
      sound: "default",
    });
  }
}

async function registerForPushNotificationsAsync(): Promise<string | null> {
  if (!Device.isDevice) {
    console.log("실제 기기가 아니므로 푸시 알림을 테스트할 수 없습니다.");
    return null;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    console.log("📛 푸시 알림 권한이 허용되지 않았습니다.");
    return null;
  }

  const token = (await Notifications.getDevicePushTokenAsync()).data;
  return token;
}

// -----------------------------
// App 컴포넌트 (로직 단순화)
// -----------------------------
export default function App() {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const notificationListener = useRef<Notifications.Subscription | null>(null);
  const responseListener = useRef<Notifications.Subscription | null>(null);

  useEffect(() => {
    // 앱 초기화 로직을 하나의 async 함수로 정리
    const initializeApp = async () => {
      // 1. 채널 설정
      await setupNotificationChannels();

      // 2. 권한 요청 및 토큰 발급 (앱 시작 시 1회)
      const token = await registerForPushNotificationsAsync();
      if (token) {
        console.log("📱 FCM Token:", token);
        setExpoPushToken(token);
        // 이 곳에서 서버로 토큰을 전송하는 API를 호출할 수 있습니다.
      }
    };

    initializeApp();

    // Foreground 알림 수신
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        console.log("📩 Notification Received (Foreground):", notification);
      });

    // 알림 클릭 이벤트 (Foreground / Background / Quit)
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(
          "🖱 Notification Response (Clicked):",
          JSON.stringify(response)
        );
      });

    // Background / Quit 상태에서 앱이 알림으로 실행된 경우
    Notifications.getLastNotificationResponseAsync().then((response) => {
      if (response) {
        console.log(
          "🛎 App launched from notification:",
          JSON.stringify(response)
        );
      }
    });

    return () => {
      if (notificationListener.current)
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
      if (responseListener.current)
        Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []); // 의존성 배열이 비어있어 최초 1회만 실행됩니다.

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <NavigationContainer>
          <RootStack />
          <Toast config={toastConfig} />
        </NavigationContainer>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
