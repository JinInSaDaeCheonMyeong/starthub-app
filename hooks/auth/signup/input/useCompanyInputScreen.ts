import { useCallback, useState } from "react";
import { BackHandler } from "react-native";
import { NavigationProp, useFocusEffect } from "@react-navigation/native";

import StartupStatus from "../../../../constants/StartupStatus";
import { CompanyInputScreenProps } from "../../../../screens/CompanyInputScreen";
import { RootStackParamList } from "../../../../navigation/RootStack";

import { useError } from "../../../util/useError";
import { useDisabled } from "../../../util/useDisabled";

import { CompanyInputFormData } from "../../../../type/user/companyInput.type";

import { ShowToast, ToastType } from "../../../../util/ShowToast";
import { setProfile } from "../../../../api/user";

export const useCompanyInputScreen = (
    {
        navigation,
        route: {
            params: { username, birth, gender, startupType }
        }
    }: CompanyInputScreenProps,
    earlyScreenNumber: number,
    preScreenNumber: number
) => {

    /** Root Navigation 접근용 */
    const rootNavigation =
        navigation as unknown as NavigationProp<RootStackParamList>;

    /** 초기 창업 여부 */
    const isEarlyStartup = startupType === StartupStatus.EARLY_STAGE;

    /** 총 진행 단계 */
    const MAXPROGRESS = isEarlyStartup
        ? earlyScreenNumber
        : preScreenNumber;

    /** 현재 진행 단계 */
    const [currentProgress, setCurrentProgress] = useState(1);

    /** 회사 입력 데이터 */
    const [formData, setFormData] = useState<CompanyInputFormData>({
        startupFields: [],
        companyName: "",
        companyDescription: "",
        numberOfEmployees: "",
        companyWebsite: "",
        startupLocation: "",
        annualRevenue: "",
    });

    const {
        value: { errorVisible, errorText },
        handler: { showError, hideError }
    } = useError();

    const { disabled, disabledBtn, enabledBtn } = useDisabled();

    /**
     * formData 업데이트 함수
     */
    const updateFormData = useCallback<
        <K extends keyof CompanyInputFormData>(
            key: K,
            value: CompanyInputFormData[K]
        ) => void
    >((key, value) => {
        setFormData(prev => ({ ...prev, [key]: value }));

        if (errorVisible) hideError();
    }, [errorVisible, hideError]);

    /**
     * setter 생성 함수 (generic)
     */
    const makeSetter = useCallback(
        <K extends keyof CompanyInputFormData>(key: K) =>
            (value: CompanyInputFormData[K]) =>
                updateFormData(key, value),
        [updateFormData]
    );

    /** 각 필드 setter */
    const setCompanyName = makeSetter("companyName");
    const setCompanyDescription = makeSetter("companyDescription");
    const setNumberOfEmployees = makeSetter("numberOfEmployees");
    const setCompanyWebsite = makeSetter("companyWebsite");
    const setAnnualRevenue = makeSetter("annualRevenue");
    const setStartupLocation = makeSetter("startupLocation");
    const setStartupFields = makeSetter("startupFields");

    /**
     * 뒤로가기 처리
     */
    const goBack = useCallback((): boolean => {
        hideError();

        if (currentProgress > 1) {
            setCurrentProgress(prev => prev - 1);
        } else {
            navigation.goBack();
        }

        return true;
    }, [currentProgress, hideError, navigation]);

    /**
     * URL 검증 함수
     */
    const validateURL = (url: string) => {
        const regex =
            /^(https?:\/\/)([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[^\s]*)?$/;
        return regex.test(url);
    };

    /**
     * 다음 단계 이동
     */
    const goNext = async () => {
        disabledBtn();

        const companyName = formData.companyName.trim();
        const companyDescription = formData.companyDescription.trim();
        const numberOfEmployees = formData.numberOfEmployees.trim();
        const companyWebsite = formData.companyWebsite.trim();
        const annualRevenue = formData.annualRevenue.trim();
        const startupLocation = formData.startupLocation.trim();
        const startupFields = formData.startupFields;

        /**
         * 입력값 검증
         */
        if (!companyName && isEarlyStartup) {
            showError("기업명을 입력해주세요");
            enabledBtn();
            return;
        }

        if (
            !numberOfEmployees &&
            currentProgress === 2 &&
            isEarlyStartup
        ) {
            showError("총 인원 수를 입력해주세요");
            enabledBtn();
            return;
        }

        if (
            companyWebsite &&
            currentProgress === 2 &&
            isEarlyStartup &&
            !validateURL(companyWebsite)
        ) {
            showError("올바른 URL 형식이 아닙니다. (예: https://example.com)");
            enabledBtn();
            return;
        }

        if (!annualRevenue && currentProgress === 3) {
            showError("연간 매출액을 입력해주세요");
            enabledBtn();
            return;
        }

        if (
            startupFields.length === 0 &&
            currentProgress === MAXPROGRESS
        ) {
            showError("창업 분야를 1개 이상 선택해주세요");
            enabledBtn();
            return;
        }

        /**
         * 마지막 단계
         */
        if (currentProgress >= MAXPROGRESS) {
            try {
                await setProfile({
                    username,
                    birth,
                    gender,
                    startupStatus: startupType,
                    companyName,
                    companyDescription,
                    numberOfEmployees: Number(numberOfEmployees),
                    companyWebsite,
                    annualRevenue: Number(annualRevenue),
                    startupLocation,
                    startupFields
                });

                ShowToast(
                    "프로필 등록",
                    "프로필 등록에 성공하셨습니다",
                    ToastType.SUCCESS
                );

                rootNavigation.reset({
                    index: 0,
                    routes: [{ name: "HomeStack" }]
                });

            } catch (error: any) {

                if (error.isAxiosError) {
                    ShowToast(
                        "프로필 등록",
                        "프로필 등록에 실패하셨습니다",
                        ToastType.ERROR
                    );
                    return;
                }

                ShowToast(
                    "프로필 등록",
                    "알 수 없는 오류가 발생했습니다",
                    ToastType.ERROR
                );

            } finally {
                hideError();
                enabledBtn();
            }

            return;
        }

        /** 다음 단계 */
        setCurrentProgress(prev => prev + 1);

        hideError();
        enabledBtn();
    };

    /**
     * 안드로이드 하드웨어 뒤로가기 처리
     */
    useFocusEffect(
        useCallback(() => {
            const handler =
                BackHandler.addEventListener(
                    "hardwareBackPress",
                    goBack
                );

            return () => handler.remove();
        }, [goBack])
    );

    return {
        form: {
            ...formData,
            setCompanyName,
            setCompanyDescription,
            setNumberOfEmployees,
            setCompanyWebsite,
            setAnnualRevenue,
            setStartupLocation,
            setStartupFields
        },

        ui: {
            MAXPROGRESS,
            currentProgress,
            isEarlyStartup,
            errorVisible,
            errorText,
            disabled
        },

        action: {
            goNext,
            goBack
        }
    };
};