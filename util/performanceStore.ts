import { RenderPassReport } from "@shopify/react-native-performance";

export type PerformanceOverlayItem = {
    id: string;
    screen: string;
    pass: string;
    interactive: boolean;
    renderTimeLabel: string;
    source?: string;
    touchTimeLabel?: string;
    bootTimeLabel?: string;
    abortTimeLabel?: string;
    createdAt: number;
};

type Listener = () => void;

const listeners = new Set<Listener>();
let items: PerformanceOverlayItem[] = [];

function emitChange() {
    listeners.forEach((listener) => listener());
}

function formatDuration(value?: number): string | undefined {
    if (typeof value !== "number") {
        return undefined;
    }

    return `${value.toFixed(1)}ms`;
}

export function addPerformanceOverlayItem(report: RenderPassReport) {
    if (!__DEV__) {
        return;
    }

    const nextItem: PerformanceOverlayItem = {
        id: report.reportId,
        screen: report.destinationScreen,
        pass: report.renderPassName ?? "aborted",
        interactive: report.interactive,
        renderTimeLabel: formatDuration(report.timeToRenderMillis) ?? "-",
        source: report.sourceScreen,
        touchTimeLabel: formatDuration(report.timeToConsumeTouchEventMillis),
        bootTimeLabel: formatDuration(report.timeToBootJsMillis),
        abortTimeLabel: formatDuration(report.timeToAbortMillis),
        createdAt: Date.now(),
    };

    items = [nextItem, ...items].slice(0, 8);
    emitChange();
}

export function addManualPerformanceOverlayItem(item: PerformanceOverlayItem) {
    if (!__DEV__) {
        return;
    }

    items = [item, ...items].slice(0, 8);
    emitChange();
}

export function clearPerformanceOverlayItems() {
    items = [];
    emitChange();
}

export function getPerformanceOverlayItems() {
    return items;
}

export function subscribePerformanceOverlay(listener: Listener) {
    listeners.add(listener);

    return () => {
        listeners.delete(listener);
    };
}
