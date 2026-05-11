import { StyleSheet, Text } from "react-native";
import RenderHtml from "react-native-render-html";
import { Colors } from "../../constants/Color";
import { Fonts } from "../../constants/Fonts";
import { extractUrlFromAnchor } from "../../util/noticeHtml";

type InNoticeHtmlContentProps = {
    width: number;
    source: { html: string };
    onOpenURL: (url: string) => void;
};

export default function InNoticeHtmlContent({
    width,
    source,
    onOpenURL,
}: InNoticeHtmlContentProps) {
    return (
        <RenderHtml
            contentWidth={width - 32}
            source={source}
            tagsStyles={{
                ul: { listStyleType: "none", paddingLeft: 0, marginLeft: 0 },
            }}
            systemFonts={[Fonts.semiBold, Fonts.medium]}
            renderers={{
                a: ({ TDefaultRenderer, tnode, ...props }: any) => {
                    if (tnode.classes?.includes("btn_by-bl")) {
                        const url = extractUrlFromAnchor(
                            tnode.attributes?.href,
                            tnode.attributes?.onclick
                        );
                        return (
                            <Text
                                onPress={() => {
                                    if (url) {
                                        onOpenURL(url);
                                    }
                                }}
                                style={styles.link}
                            >
                                접수 바로가기
                            </Text>
                        );
                    }

                    return <TDefaultRenderer tnode={tnode} {...props} />;
                },
            }}
            renderersProps={{
                a: {
                    onPress(_event, href, htmlAttribs, _target) {
                        const url = extractUrlFromAnchor(href, htmlAttribs?.onclick);
                        if (url) {
                            onOpenURL(url);
                        }
                    },
                },
            }}
            classesStyles={{
                title: {
                    fontFamily: Fonts.semiBold,
                    fontSize: 18,
                    color: Colors.black1,
                    marginTop: 28,
                },
                tit: {
                    fontFamily: Fonts.medium,
                    fontSize: 16,
                    color: Colors.black1,
                    marginTop: 8,
                    marginBottom: 6,
                },
                txt: {
                    fontFamily: Fonts.reqular,
                    flex: 1,
                    fontSize: 14,
                    color: Colors.black1,
                    marginBottom: 16,
                },
                "txt-button": {
                    fontSize: 14,
                    color: Colors.black1,
                    fontFamily: Fonts.reqular,
                },
                list: {
                    fontSize: 14,
                    fontFamily: Fonts.reqular,
                },
            }}
        />
    );
}

const styles = StyleSheet.create({
    link: {
        color: Colors.info,
        fontFamily: Fonts.reqular,
        fontSize: 14,
        textDecorationLine: "underline",
    },
});
