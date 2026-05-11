import { Colors } from "../../constants/Color";
import BusinessIcon from "../../assets/icons/category/notice/business.svg";
import EducationIcon from "../../assets/icons/category/notice/education.svg";
import EventIcon from "../../assets/icons/category/notice/event.svg";
import FacilityIcon from "../../assets/icons/category/notice/facility.svg";
import FundingIcon from "../../assets/icons/category/notice/funding.svg";
import GlobalIcon from "../../assets/icons/category/notice/global.svg";
import RNDIcon from "../../assets/icons/category/notice/rnd.svg";
import TalentIcon from "../../assets/icons/category/notice/talent.svg";

export const noticeCategoryMeta = {
    "사업화": { label: "사업화", icon: <BusinessIcon width={20} height={20} color={Colors.primary} /> },
    "멘토링ㆍ컨설팅ㆍ교육": { label: "교육", icon: <EducationIcon width={20} height={20} color={Colors.primary} /> },
    "창업교육": { label: "교육", icon: <EducationIcon width={20} height={20} color={Colors.primary} /> },
    "행사ㆍ네트워크": { label: "행사", icon: <EventIcon width={20} height={20} color={Colors.primary} /> },
    "시설ㆍ공간ㆍ보육": { label: "시설", icon: <FacilityIcon width={20} height={20} color={Colors.primary} /> },
    "정책자금": { label: "자금", icon: <FundingIcon width={20} height={20} color={Colors.primary} /> },
    "글로벌": { label: "글로벌", icon: <GlobalIcon width={20} height={20} color={Colors.primary} /> },
    "기술개발(R&D)": { label: "R&D", icon: <RNDIcon width={20} height={20} color={Colors.primary} /> },
    "인력": { label: "인력", icon: <TalentIcon width={20} height={20} color={Colors.primary} /> },
    "판로ㆍ해외진출": { label: "글로벌", icon: <GlobalIcon width={16} height={16} color={Colors.primary} /> },
} as const;
