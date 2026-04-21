export const parseReceptionPeriod = (period: string): { startDate: Date; endDate: Date } => {
    const fallback = { startDate: new Date(), endDate: new Date() };
    try {
        if (!period || typeof period !== 'string') return fallback;
        const parts = period.split('~').map((s) => s.trim());
        if (parts.length !== 2) return fallback;
        const startDateStr = parts[0].split(' ')[0];
        const endDateStr = parts[1].split(' ')[0];
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(startDateStr) || !dateRegex.test(endDateStr)) return fallback;
        const startDate = new Date(startDateStr + 'T00:00:00');
        const endDate = new Date(endDateStr + 'T00:00:00');
        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return fallback;
        return { startDate, endDate };
    } catch {
        return fallback;
    }
};

export const getDateDifference = (date: Date): string => {
    const now = new Date();
    
    if (date.getTime() > now.getTime()) {
        return "방금 전";
    }
    
    const diffMs = now.getTime() - date.getTime();
    
    const years = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 365));
    const months = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 30));
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor(diffMs / (1000 * 60));
    const seconds = Math.floor(diffMs / 1000);
    
    if (years > 0) return `${years}년 전`;
    if (months > 0) return `${months}달 전`;
    if (days > 0) return `${days}일 전`;
    if (hours > 0) return `${hours}시간 전`;
    if (minutes > 0) return `${minutes}분 전`;
    if (seconds > 0) return `${seconds}초 전`;
    
    return "방금 전";
};

export const formatToTime = (data : string) : string => {
    const date = new Date(data);
    return date.toLocaleTimeString("ko-KR", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    });
}

export const formatToDate = (
    data : string | Date, 
    type : 'dotted'| 'solid' | 'kor' | 'calendar' = 'dotted'
) : string => {
    const dateTime = typeof data === 'string' ? new Date(data) : data
    const years = dateTime.getFullYear()
    const months = String(dateTime.getMonth() + 1).padStart(2, "0");
    const days = String(dateTime.getDate()).padStart(2, "0")
    if(type === 'dotted'){
        return `${years}.${months}.${days}`;
    } else if (type === 'solid') {
        return `${years}-${months}-${days}`;
    } else if (type === 'calendar') {
        return `${years}.${months}`
    } else {
        return `${years}년 ${months}월 ${days}일`;
    }
}