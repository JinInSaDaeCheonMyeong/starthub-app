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

export const formatToDate = (data : string, type : 'dotted' | 'kor' = 'dotted') : string => {
    const dateTime = new Date(data)
    const years = dateTime.getFullYear()
    const months = dateTime.getMonth()+1
    const days = dateTime.getDate()
    if(type === 'dotted'){
        return `${years}.${months}.${days}`;
    } else{
        return `${years}년 ${months}월 ${days}일`;
    }
}