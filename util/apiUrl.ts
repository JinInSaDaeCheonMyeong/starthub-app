import { Platform } from 'react-native';

const getApiUrl = (): string => {
    const url = process.env.EXPO_PUBLIC_API_URL ?? '';
    if (Platform.OS === 'android') {
        return url.replace('localhost', '10.0.2.2');
    }
    return url;
};

export const API_URL = getApiUrl();
