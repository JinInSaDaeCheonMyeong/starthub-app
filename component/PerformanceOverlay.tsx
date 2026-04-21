import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors } from "../constants/Color";
import { Fonts } from "../constants/Fonts";
import {
    clearPerformanceOverlayItems,
    getPerformanceOverlayItems,
    PerformanceOverlayItem,
    subscribePerformanceOverlay,
} from "../util/performanceStore";

export default function PerformanceOverlay() {
    const insets = useSafeAreaInsets();
    const [collapsed, setCollapsed] = useState(false);
    const [items, setItems] = useState<PerformanceOverlayItem[]>(getPerformanceOverlayItems());

    useEffect(() => {
        return subscribePerformanceOverlay(() => {
            setItems(getPerformanceOverlayItems());
        });
    }, []);

    if (!__DEV__) {
        return null;
    }

    return (
        <View
            pointerEvents="box-none"
            style={[
                styles.container,
                { top: insets.top + 8 },
            ]}
        >
            <View style={styles.panel}>
                <View style={styles.header}>
                    <Pressable onPress={() => setCollapsed((value) => !value)} style={styles.headerButton}>
                        <Text style={styles.headerTitle}>
                            PERF {collapsed ? "OPEN" : "HIDE"}
                        </Text>
                    </Pressable>
                    <Pressable onPress={clearPerformanceOverlayItems} style={styles.clearButton}>
                        <Text style={styles.clearButtonText}>CLEAR</Text>
                    </Pressable>
                </View>

                {!collapsed && (
                    <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
                        {items.length === 0 ? (
                            <Text style={styles.emptyText}>측정값을 기다리는 중...</Text>
                        ) : (
                            items.map((item) => (
                                <View key={item.id} style={styles.card}>
                                    <View style={styles.row}>
                                        <Text style={styles.screenText}>{item.screen}</Text>
                                        <Text style={[styles.badge, item.interactive ? styles.readyBadge : styles.loadingBadge]}>
                                            {item.interactive ? "ready" : "loading"}
                                        </Text>
                                    </View>
                                    <Text style={styles.metaText}>pass {item.pass}</Text>
                                    <Text style={styles.metaText}>render {item.renderTimeLabel}</Text>
                                    {item.source ? <Text style={styles.metaText}>from {item.source}</Text> : null}
                                    {item.touchTimeLabel ? <Text style={styles.metaText}>touch {item.touchTimeLabel}</Text> : null}
                                    {item.bootTimeLabel ? <Text style={styles.metaText}>boot {item.bootTimeLabel}</Text> : null}
                                    {item.abortTimeLabel ? <Text style={styles.metaText}>abort {item.abortTimeLabel}</Text> : null}
                                </View>
                            ))
                        )}
                    </ScrollView>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        right: 8,
        zIndex: 9999,
        width: 220,
    },
    panel: {
        backgroundColor: "rgba(15, 23, 42, 0.92)",
        borderRadius: 14,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.12)",
        overflow: "hidden",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 10,
        paddingVertical: 8,
        backgroundColor: "rgba(255,255,255,0.06)",
    },
    headerButton: {
        paddingVertical: 2,
    },
    headerTitle: {
        color: Colors.white1,
        fontSize: 12,
        fontFamily: Fonts.bold,
    },
    clearButton: {
        paddingHorizontal: 6,
        paddingVertical: 4,
        borderRadius: 8,
        backgroundColor: "rgba(255,255,255,0.08)",
    },
    clearButtonText: {
        color: Colors.white1,
        fontSize: 10,
        fontFamily: Fonts.medium,
    },
    list: {
        maxHeight: 320,
    },
    listContent: {
        padding: 8,
        gap: 8,
    },
    emptyText: {
        color: "rgba(255,255,255,0.7)",
        fontSize: 12,
        fontFamily: Fonts.reqular,
    },
    card: {
        borderRadius: 10,
        padding: 8,
        backgroundColor: "rgba(255,255,255,0.05)",
        gap: 2,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 8,
    },
    screenText: {
        flex: 1,
        color: Colors.white1,
        fontSize: 12,
        fontFamily: Fonts.semiBold,
    },
    badge: {
        overflow: "hidden",
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 999,
        fontSize: 10,
        color: Colors.white1,
        fontFamily: Fonts.medium,
    },
    readyBadge: {
        backgroundColor: "rgba(39, 174, 96, 0.9)",
    },
    loadingBadge: {
        backgroundColor: "rgba(226, 185, 59, 0.9)",
    },
    metaText: {
        color: "rgba(255,255,255,0.82)",
        fontSize: 11,
        fontFamily: Fonts.reqular,
    },
});
