export function cleanNoticeContent(content: string) {
    return content
        .replace(/<br>\s*<!--/g, "<!--")
        .replace(/<br>\s*<\/(.*?)>/gi, "</$1>")
        .replace(/(<p class="txt-button">.*?<\/p>)\s*<br\s*\/?>/gi, "$1");
}

export function extractUrlFromAnchor(href?: string, onClick?: string): string | null {
    const candidates = [href, onClick].filter(Boolean) as string[];

    for (const value of candidates) {
        const trimmed = value.trim();

        if (/^https?:\/\//i.test(trimmed)) {
            return trimmed;
        }

        const quotedHttp = trimmed.match(/['"](https?:\/\/[^'"]+)['"]/i);
        if (quotedHttp?.[1]) {
            return quotedHttp[1];
        }

        const plainHttp = trimmed.match(/https?:\/\/[^\s'"]+/i);
        if (plainHttp?.[0]) {
            return plainHttp[0];
        }
    }

    return null;
}
