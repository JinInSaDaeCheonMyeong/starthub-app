import { ReactNode, useEffect, useRef } from "react";
import { LayoutChangeEvent, StyleSheet, View } from "react-native";
import { handleLocalPerformanceReport } from "../../util/performance";

type MeasureViewProps = {
    screenName: string;
    children: ReactNode;
    interactive?: boolean;
    renderPassName?: string;
};

export default function MeasureView({
    screenName,
    children,
    interactive = false,
    renderPassName,
}: MeasureViewProps) {
    const passName = renderPassName ?? (interactive ? "interactive" : "loading");
    const passKey = `${screenName}:${passName}:${interactive ? "1" : "0"}`;
    const passStartRef = useRef(Date.now());
    const reportedPassKeyRef = useRef<string | null>(null);

    const reportIfNeeded = () => {
        if (reportedPassKeyRef.current === passKey) {
            return;
        }

        reportedPassKeyRef.current = passKey;
        handleLocalPerformanceReport({
            destinationScreen: screenName,
            renderPassName: passName,
            interactive,
            timeToRenderMillis: Date.now() - passStartRef.current,
        });
    };

    useEffect(() => {
        passStartRef.current = Date.now();
        reportedPassKeyRef.current = null;

        const firstFrame = requestAnimationFrame(() => {
            const secondFrame = requestAnimationFrame(() => {
                reportIfNeeded();
            });

            return () => cancelAnimationFrame(secondFrame);
        });

        return () => cancelAnimationFrame(firstFrame);
    }, [passKey]);

    const handleLayout = (_event: LayoutChangeEvent) => {
        reportIfNeeded();
    };

    return (
        <View style={styles.container} onLayout={handleLayout}>
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
