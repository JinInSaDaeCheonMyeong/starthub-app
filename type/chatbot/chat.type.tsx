import React from "react";
import NoticeIcon from "../../assets/icons/chat/notice.svg";
import LawIcon from "../../assets/icons/chat/law.svg";
import IdeaIcon from "../../assets/icons/chat/idea.svg";

export type Message = {
    id: string;
    text: string;
    isBot: boolean;
    questionType?: QuestionType | null;
    attachments?: SelectedFile[];
};

export enum QuestionType {
    NOTICE = "NOTICE",
    LAW = "LAW",
    IDEA = "IDEA",
}

export type QuestionTypeBlockItem = {
    id: number;
    icon: React.ReactNode;
    title: string;
    example: string;
    value: QuestionType;
};

export type SelectedFile = {
    id: number;
    fileName: string;
    uri: string;
    type: string;
};

export const questionTypeBlockItems: QuestionTypeBlockItem[] = [
    {
        id: 1,
        icon: <NoticeIcon width={33} height={29} />,
        title: "공고",
        example: "~공고 있어?",
        value: QuestionType.NOTICE,
    },
    {
        id: 2,
        icon: <LawIcon width={26} height={29} />,
        title: "법률",
        example: "~때 알아야 할 법률",
        value: QuestionType.LAW,
    },
    {
        id: 3,
        icon: <IdeaIcon width={22} height={29} />,
        title: "아이디어",
        example: "~이 아이디어 어때?",
        value: QuestionType.IDEA,
    },
];

export const questionTypeConfig = {
    NOTICE: {
        icon: <NoticeIcon height={14} />,
        text: "공고",
    },
    LAW: {
        icon: <LawIcon height={14} />,
        text: "법률",
    },
    IDEA: {
        icon: <IdeaIcon height={14} />,
        text: "아이디어",
    },
};
