import { eachDayOfInterval, subDays, format } from "date-fns";
import { Colors } from "../constants/Color";

type DotColor =
    | typeof Colors.info
    | typeof Colors.warning
    | typeof Colors.error;

export type Dot = {
    id : number
    color : DotColor
}

type Item = {
    id: number;
    startTime: string;
    endTime: string;
};

type MarkedDates = Record<
    string,
    {
        dots: Dot[];
        selected?: boolean;
        selectedColor?: string;
    }
>;

export function buildDeadlineMarks(items: Item[]): MarkedDates {
    const marked: MarkedDates = {};

    items.forEach((event) => {
        const start = new Date(event.startTime);
        const end = new Date(event.endTime);

        const yellowStart = subDays(end, 14);
        const redStart = subDays(end, 7);

        const allDates = eachDayOfInterval({ start, end });

        allDates.forEach((date) => {
        const key = format(date, "yyyy-MM-dd");

        const dots: Dot[] = marked[key]?.dots
            ? [...marked[key].dots]
            : [];

        if (date >= start && date <= yellowStart) dots.push({id : event.id, color: Colors.info }); // 기본 파랑
        if (date >= yellowStart && date <= redStart) dots.push({ id: event.id, color: Colors.warning }); // 2주 전부터 노랑
        if (date >= redStart) dots.push({ id: event.id, color: Colors.error }); // 1주 전부터 빨강

        dots.sort((a, b) => {
            const colorOrder = [Colors.error, Colors.warning, Colors.info];
            return colorOrder.indexOf(a.color) - colorOrder.indexOf(b.color);
        });

        marked[key] = {
            dots: dots.slice(0, 3),
            selected: true,
            selectedColor: "transparent",
        };
        });
    });

    return marked;
}