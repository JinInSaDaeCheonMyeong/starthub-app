import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import RootStack from "./navigation/RootStack";
import { NavigationContainer } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import toastConfig from "./lib/ToastConfig";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { useEffect, useRef, useState } from "react";
import { Keyboard, Platform } from "react-native";
import { saveFCMToken } from "./util/token";
import { ShowToast, ToastType } from "./util/ShowToast";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { navigationRef } from "./util/NavigationService";
import messaging from '@react-native-firebase/messaging';

// 앱이 background/quit(종료) 상태인 경우 메시지를 받기 위함
messaging().setBackgroundMessageHandler(async (remoteMessage: any) => {
  console.log('[Background Message] ', remoteMessage);
});

// Firebase Messaging 권한 요청 및 토큰 받기
const requestUserPermission = async (): Promise<string | null> => {
  try {
    const authorizationStatus = await messaging().requestPermission();

    if (authorizationStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authorizationStatus === messaging.AuthorizationStatus.PROVISIONAL) {
      console.log('Authorization Status: ', authorizationStatus);

      // FCM Token 생성
      const token = await messaging().getToken();
      console.log('📱 FCM Token:', token);

      return token;
    } else {
      console.log('📛 푸시 알림 권한이 허용되지 않았습니다.');
      return null;
    }
  } catch (error) {
    console.error('❌ FCM 권한 요청 실패:', error);
    return null;
  }
};

Notifications.setNotificationHandler({
  handleNotification:
      async (): Promise<Notifications.NotificationBehavior> => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true,
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
    console.log("⚠️ 실제 기기가 아니므로 푸시 알림을 테스트할 수 없습니다.");
    return null;
  }

  console.log("🔔 푸시 알림 권한 확인 중...");

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  console.log("📋 현재 권한 상태:", existingStatus);

  if (existingStatus !== "granted") {
    console.log("🙏 푸시 알림 권한 요청 중...");
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
    console.log("📋 권한 요청 결과:", status);
  }

  if (finalStatus !== "granted") {
    console.log("📛 푸시 알림 권한이 허용되지 않았습니다.");
    return null;
  }

  console.log("✅ 푸시 알림 권한 허용됨");

  // Firebase Messaging을 사용하여 FCM 토큰 받기 (Android, iOS 모두 지원)
  return await requestUserPermission();
}

export default function App() {
  const notificationListener = useRef<Notifications.Subscription | null>(null);
  const responseListener = useRef<Notifications.Subscription | null>(null);

  useEffect(() => {
    const initializeApp = async () => {
      // 알림 채널 설정 (Android)
      await setupNotificationChannels();

      // FCM 토큰 받기
      const token = await registerForPushNotificationsAsync();

      if (token) {
        console.log("📱 FCM Token:", token);
        try {
          await saveFCMToken(token);
          ShowToast(
              "FCM 토큰",
              "푸시 알림이 성공적으로 설정되었습니다",
              ToastType.SUCCESS
          );
        } catch (error) {
          console.error('FCM 토큰 저장 실패:', error);
          ShowToast(
              "FCM 토큰",
              "FCM 토큰을 저장하는데 실패하였습니다",
              ToastType.ERROR
          );
        }
      }
    };

    initializeApp();

    // 앱이 foreground(실행) 상태인 경우 메시지 수신
    const unsubscribeMessaging = messaging().onMessage(async (remoteMessage) => {
      console.log('[Foreground Message] ', JSON.stringify(remoteMessage));

      // Foreground에서 알림 표시
      if (remoteMessage.notification) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: remoteMessage.notification.title || '알림',
            body: remoteMessage.notification.body || '',
            data: remoteMessage.data,
          },
          trigger: null, // 즉시 표시
        });
      }
    });

    // Expo Notifications 리스너
    notificationListener.current =
        Notifications.addNotificationReceivedListener((notification) => {
          console.log("📩 Notification Received (Foreground):", notification);
        });

    responseListener.current =
        Notifications.addNotificationResponseReceivedListener((response) => {
          console.log(
              "🖱 Notification Response (Clicked):",
              JSON.stringify(response)
          );
          // 여기에 알림 클릭 시 네비게이션 로직 추가 가능
        });

    // 앱 시작 시 알림으로 열렸는지 확인
    Notifications.getLastNotificationResponseAsync().then((response) => {
      if (response) {
        console.log(
            "🛎 App launched from notification:",
            JSON.stringify(response)
        );
      }
    });

    // FCM 토큰 갱신 리스너
    const unsubscribeTokenRefresh = messaging().onTokenRefresh(async (token) => {
      console.log('🔄 FCM Token Refreshed:', token);
      try {
        await saveFCMToken(token);
      } catch (error) {
        console.error('토큰 갱신 저장 실패:', error);
      }
    });

    return () => {
      unsubscribeMessaging();
      unsubscribeTokenRefresh();

      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(
            notificationListener.current
        );
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
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

function AppContent() {
  const insets = useSafeAreaInsets();
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const showSubscription = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      (e) => {
        setKeyboardHeight(e.endCoordinates.height);
      }
    );

    const hideSubscription = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      () => {
        setKeyboardHeight(0);
      }
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
