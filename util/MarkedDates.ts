import { format } from "date-fns";
import { MonthScheduleType } from "../type/schedules/schedules";

const categoryMap: Record<string, string> = {
    "사업화": "#5D85E5",
    "멘토링ㆍ컨설팅ㆍ교육": "#34ABF0",
    "창업교육": "#34ABF0",
    "행사ㆍ네트워크": "#F965AD",
    "시설ㆍ공간ㆍ보육": "#FA6B6B",
    "정책자금": "#F6CD48",
    "글로벌": "#31CAB4",
    "기술개발(R&D)": "#A964EE",
    "인력": "#F6A071",
    "판로ㆍ해외진출": "#31CAB4",
};

type DotPriority = "end" | "start";

export type Dot = {
    id: number;
    color: string;
    priority: DotPriority;
};

export type MarkedDates = Record<
    string,
    {
        dots: Dot[];
        selected?: boolean;
        selectedColor?: string;
    }
>;

export function buildDeadlineMarks(
    items: MonthScheduleType[],
    markType: DotPriority | "none" = "none"
): MarkedDates {
    const marked: MarkedDates = {};

    const allowed: DotPriority[] =
        markType === "none" ? ["start", "end"] : [markType];

    items.forEach((schedule) => {
        const points: { date: Date; priority: DotPriority }[] = [
            { date: new Date(schedule.startDate), priority: "start" },
            { date: new Date(schedule.endDate), priority: "end" },
        ];

        points.forEach(({ date, priority }) => {
            if (!allowed.includes(priority)) return;
            const key = format(date, "yyyy-MM-dd");
            const dots: Dot[] = marked[key]?.dots ? [...marked[key].dots] : [];
            dots.push({
                id: schedule.announcementId,
                color: categoryMap[schedule.supportFields ?? '사업화'],
                priority,
            });
            marked[key] = {
                dots: sortDots(dots),
            };
        });
    });
    return marked;
}

function sortDots(dots: Dot[]): Dot[] {
    const dotPriority: DotPriority[] = ["end", "start"];
    return dots.sort(
        (a, b) => dotPriority.indexOf(a.priority) - dotPriority.indexOf(b.priority)
    );
}
