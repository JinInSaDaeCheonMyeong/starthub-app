import { useState } from "react"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { ProfileScreenProps } from "../../screens/system/EditProfileScreen"
import { setProfile } from "../../api/user"
import { ShowToast, ToastType } from "../../util/ShowToast"
import { useProfileStore } from "../../store/profileStore"

const useEditProfileScreen = ({
                                  navigation,
                                  route: { params }
                              }: ProfileScreenProps) => {

    const insets = useSafeAreaInsets()
    const fetchProfile = useProfileStore((state) => state.fetchProfile)

    /** 생년월일 분리 */
    const [year = "1000", month = "11", day = "11"] =
        params.birth.split("-")

    /** 사용자 정보 */
    const [user, setUser] = useState(params)

    /** 입력 상태 */
    const [birthYear, setYear] = useState(year)
    const [birthMonth, setMonth] = useState(month)
    const [birthDay, setDay] = useState(day)

    const [numberPerson, setNumberPerson] =
        useState(String(user.numberOfEmployees ?? ""))

    const [annualRevenue, setAnnualRevenue] =
        useState(String(user.annualRevenue ?? ""))

    /** 성별 선택 */
    const [selectGender, setSelectGender] = useState<
        "male" | "female" | "none" | "other"
    >(
        user.gender === "MALE"
            ? "male"
            : user.gender === "FEMALE"
                ? "female"
                : "none"
    )

    /** 초기 창업 여부 */
    const [selectStartupStatus, setSelectStartupStatus] =
        useState(user.startupStatus === "EARLY_STAGE")

    /**
     * URL 검증
     */
    const validateURL = (url: string) => {
        const regex =
            /^(https?:\/\/)([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[^\s]*)?$/
        return regex.test(url)
    }

    /**
     * 프로필 수정 요청
     */
    const sendEditProfile = async () => {

        const username = user.username.trim()
        const year = birthYear.trim()
        const month = birthMonth.trim()
        const day = birthDay.trim()

        if (!username || !year || !month || !day) {
            ShowToast(
                "프로필 수정",
                "필수 항목을 입력해주세요",
                ToastType.ERROR
            )
            return
        }

        if (selectStartupStatus) {

            if (
                !user.companyName?.trim() ||
                !numberPerson.trim() ||
                !annualRevenue.trim()
            ) {
                ShowToast(
                    "프로필 수정",
                    "필수 항목을 입력해주세요",
                    ToastType.ERROR
                )
                return
            }

            if (user.companyWebsite &&
                !validateURL(user.companyWebsite.trim())
            ) {
                ShowToast(
                    "프로필 수정",
                    "올바른 URL 형식이 아닙니다. (예: https://example.com)",
                    ToastType.ERROR
                )
                return
            }
        }

        try {

            await setProfile({

                username,

                birth: `${year}-${month}-${day}`,

                gender:
                    selectGender === "male"
                        ? "MALE"
                        : selectGender === "female"
                            ? "FEMALE"
                            : "OTHER",

                startupStatus:
                    selectStartupStatus
                        ? "EARLY_STAGE"
                        : "PRE_STARTUP",

                companyName:
                    selectStartupStatus
                        ? user.companyName?.trim()
                        : undefined,

                companyDescription:
                    selectStartupStatus
                        ? user.companyDescription?.trim()
                        : undefined,

                numberOfEmployees:
                    selectStartupStatus
                        ? Number(numberPerson.trim())
                        : undefined,

                companyWebsite:
                    selectStartupStatus
                        ? user.companyWebsite?.trim()
                        : undefined,

                annualRevenue:
                    selectStartupStatus
                        ? Number(annualRevenue.trim())
                        : undefined,

                startupLocation:
                    user.startupLocation?.trim(),

                startupFields: params.startupFields,

                /** 기존 디자인에는 없던 필드 */
                startupHistory: params.startupHistory ?? 0

            })

            await fetchProfile()

            ShowToast(
                "프로필 수정",
                "프로필 수정에 성공했습니다",
                ToastType.SUCCESS
            )

            navigation.goBack()

        } catch (error: any) {

            if (error.isAxiosError) {
                ShowToast(
                    "프로필 수정",
                    "프로필 수정에 실패했습니다",
                    ToastType.ERROR
                )
                return
            }

            ShowToast(
                "프로필 수정",
                "알 수 없는 오류가 발생했습니다",
                ToastType.ERROR
            )

        }

    }

    /**
     * 뒤로가기
     */
    const goBack = () => {
        navigation.goBack()
    }

    return {

        form: {
            user,
            year: birthYear,
            month: birthMonth,
            day: birthDay,
            numberPerson,
            annualRevenue,
            selectGender,
            selectStartupStatus,

            setUser,
            setYear,
            setMonth,
            setDay,
            setNumberPerson,
            setAnnualRevenue,
            setSelectGender,
            setSelectStartupStatus
        },

        ui: {
            insets
        },

        action: {
            goBack,
            sendEditProfile
        }

    }
}

export default useEditProfileScreen
