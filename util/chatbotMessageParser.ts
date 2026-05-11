const CHATBOT_TOKEN_REGEX = /\[\[\s*(ANNOUNCEMENT|SCHEDULE|ANALYSIS|BMC)\s*:\s*(\d+)\s*:\s*([\s\S]*?)\]\]/g;

type TextSegment = { type: "text"; content: string };
type TokenSegment = {
    type: "token";
    tokenType: "announcement" | "analysis" | "bmc";
    id: number;
    title: string;
    url?: string;
};

export type MessageSegment = TextSegment | TokenSegment;

function parseTokenPayload(payload: string): { title: string; url?: string } {
    const markerMatch = payload.match(/[\s\n]+(?:T|URL)\s*:\s*(https?:\/\/[\s\S]+)$/i);
    if (markerMatch) {
        return {
            title: payload.slice(0, markerMatch.index).replace(/\s+/g, " ").trim(),
            url: markerMatch[1].replace(/\s+/g, ""),
        };
    }

    const urlStartIndex = payload.search(/:\s*https?:\/\//i);
    if (urlStartIndex >= 0) {
        return {
            title: payload.slice(0, urlStartIndex).replace(/\s+/g, " ").trim(),
            url: payload.slice(urlStartIndex + 1).replace(/\s+/g, ""),
        };
    }

    return { title: payload.replace(/\s+/g, " ").trim() };
}

export function parseMessageSegments(text: string): MessageSegment[] {
    const segments: MessageSegment[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;
    const regex = new RegExp(CHATBOT_TOKEN_REGEX.source, "g");

    while ((match = regex.exec(text)) !== null) {
        if (match.index > lastIndex) {
            segments.push({ type: "text", content: text.slice(lastIndex, match.index) });
        }

        const rawType = match[1];
        const id = parseInt(match[2], 10);
        const payload = match[3];

        if (rawType === "ANNOUNCEMENT" || rawType === "SCHEDULE") {
            const { title, url } = parseTokenPayload(payload);
            segments.push({
                type: "token",
                tokenType: "announcement",
                id,
                title,
                url,
            });
        } else if (rawType === "ANALYSIS") {
            segments.push({
                type: "token",
                tokenType: "analysis",
                id,
                title: payload.replace(/\s+/g, " ").trim(),
            });
        } else {
            segments.push({
                type: "token",
                tokenType: "bmc",
                id,
                title: payload.replace(/\s+/g, " ").trim(),
            });
        }

        lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
        segments.push({ type: "text", content: text.slice(lastIndex) });
    }

    return segments;
}
