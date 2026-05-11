import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type ChatTokenCardProps = {
    title: string;
    label: string;
    onPress: () => void;
};

export default function ChatTokenCard({ title, label, onPress }: ChatTokenCardProps) {
    return (
        <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.75}>
            <View style={styles.badge}>
                <Text style={styles.badgeText}>{label}</Text>
            </View>
            <Text style={styles.title} numberOfLines={2}>{title}</Text>
            <Text style={styles.link}>자세히 보기 →</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        marginTop: 6,
        backgroundColor: "#EDF2FF",
        borderRadius: 10,
        padding: 10,
        borderLeftWidth: 2,
        borderLeftColor: "#4A7DFF",
    },
    badge: {
        alignSelf: "flex-start",
        backgroundColor: "#4A7DFF",
        borderRadius: 5,
        paddingHorizontal: 5,
        paddingVertical: 1,
        marginBottom: 4,
    },
    badgeText: {
        color: "#fff",
        fontSize: 9,
        fontWeight: "600",
    },
    title: {
        fontSize: 12,
        fontWeight: "600",
        color: "#1a1a1a",
        marginBottom: 4,
    },
    link: {
        fontSize: 11,
        color: "#4A7DFF",
    },
});
