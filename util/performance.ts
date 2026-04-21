import { RenderPassReport } from "@shopify/react-native-performance";
import { addManualPerformanceOverlayItem, addPerformanceOverlayItem } from "./performanceStore";

function formatDuration(value?: number): string {
    if (typeof value !== "number") {
        return "-";
    }

    return `${value.toFixed(1)}ms`;
}

export function handlePerformanceReport(report: RenderPassReport) {
    if (!__DEV__) {
        return;
    }

    addPerformanceOverlayItem(report);

    const parts = [
        `[perf] ${report.destinationScreen}`,
        `pass=${report.renderPassName ?? "aborted"}`,
        `interactive=${report.interactive}`,
        `render=${formatDuration(report.timeToRenderMillis)}`,
    ];

    if (report.sourceScreen) {
        parts.push(`source=${report.sourceScreen}`);
    }

    if (typeof report.timeToBootJsMillis === "number") {
        parts.push(`boot=${formatDuration(report.timeToBootJsMillis)}`);
    }

    if (typeof report.timeToConsumeTouchEventMillis === "number") {
        parts.push(`touch=${formatDuration(report.timeToConsumeTouchEventMillis)}`);
    }

    if (typeof report.timeToAbortMillis === "number") {
        parts.push(`abort=${formatDuration(report.timeToAbortMillis)}`);
    }

    console.log(parts.join(" | "));
}

type LocalPerformanceReport = {
    destinationScreen: string;
    renderPassName: string;
    interactive: boolean;
    timeToRenderMillis: number;
    sourceScreen?: string;
    timeToConsumeTouchEventMillis?: number;
    timeToBootJsMillis?: number;
    timeToAbortMillis?: number;
};

export function handleLocalPerformanceReport(report: LocalPerformanceReport) {
    if (!__DEV__) {
        return;
    }

    addManualPerformanceOverlayItem({
        id: `${report.destinationScreen}-${report.renderPassName}-${Date.now()}`,
        screen: report.destinationScreen,
        pass: report.renderPassName,
        interactive: report.interactive,
        renderTimeLabel: formatDuration(report.timeToRenderMillis),
        source: report.sourceScreen,
        touchTimeLabel: typeof report.timeToConsumeTouchEventMillis === "number"
            ? formatDuration(report.timeToConsumeTouchEventMillis)
            : undefined,
        bootTimeLabel: typeof report.timeToBootJsMillis === "number"
            ? formatDuration(report.timeToBootJsMillis)
            : undefined,
        abortTimeLabel: typeof report.timeToAbortMillis === "number"
            ? formatDuration(report.timeToAbortMillis)
            : undefined,
        createdAt: Date.now(),
    });

    const parts = [
        `[perf] ${report.destinationScreen}`,
        `pass=${report.renderPassName}`,
        `interactive=${report.interactive}`,
        `render=${formatDuration(report.timeToRenderMillis)}`,
    ];

    if (report.sourceScreen) {
        parts.push(`source=${report.sourceScreen}`);
    }

    console.log(parts.join(" | "));
}
