import { Dispatch, SetStateAction } from "react";
import DropDownPicker, { ItemType } from "react-native-dropdown-picker";
import {
  StyleProp,
  StyleSheet,
  TextStyle,
  ViewStyle,
  PixelRatio,
} from "react-native";
import TopButton from "../assets/icons/top-arrow-back.svg";
import BottomButton from "../assets/icons/bottom-arrow-back.svg";
import CheckMark from "../assets/icons/checkmark.svg";
import { Colors } from "../constants/Color";
import { Fonts } from "../constants/Fonts";

type DropDownProps = {
  open: boolean;
  value: string | null;
  items: ItemType<any>[];
  placeholder: string;
  setOpen: Dispatch<SetStateAction<boolean>>;
  setValue: (value: string) => void;
  textStyle?: StyleProp<TextStyle>;
  placeholderStyle?: StyleProp<TextStyle>;
  labelStyle?: StyleProp<TextStyle>;
  iconWidth?: number;
  iconHeight?: number;
  containerStyle?: StyleProp<ViewStyle>;
  minWidth?: number;
  maxWidth?: number;
};

export default function DropDown(props: DropDownProps) {
  const textStyle = props.textStyle ?? styles.textStyle;
  const placeholderStyle = props.placeholderStyle ?? styles.placeholderStyle;
  const labelStyle = props.labelStyle ?? styles.labelStyle;
  const iconWidth = props.iconWidth ?? 18;
  const iconHeight = props.iconHeight ?? 18;
  const calculateTextWidth = (text: string) => {
    let width = 0;
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      if (/[가-힣]/.test(char)) {
        width += 20;
      } else if (/[a-zA-Z0-9]/.test(char)) {
        width += 5;
      } else {
        width += 6;
      }
    }

    // 기본 여유 공간
    let base = 60;

    // 텍스트 스타일에 지정된 fontSize(있다면)와 시스템 글꼴 스케일을 반영
    // flatten하면 undefined 방지
    const flattenedTextStyle = StyleSheet.flatten(textStyle) || {};
    const flattenedPlaceholderStyle =
      StyleSheet.flatten(placeholderStyle) || {};
    const flattenedLabelStyle = StyleSheet.flatten(labelStyle) || {};

    // 우선순위: textStyle.fontSize -> labelStyle.fontSize -> placeholderStyle.fontSize -> 18
    const fontSize =
      (flattenedTextStyle.fontSize as number) ??
      (flattenedLabelStyle.fontSize as number) ??
      (flattenedPlaceholderStyle.fontSize as number) ??
      18;

    // PixelRatio.getFontScale()는 사용자 설정(접근성) 반영
    const fontScale = PixelRatio.getFontScale ? PixelRatio.getFontScale() : 1;

    // 기본 폰트 기준(18) 대비 크기와 시스템 폰트 스케일을 조합
    const scale = (fontSize / 18) * fontScale;

    return Math.round((width + base) * scale);
  };
  const selectedItem = props.items.find((item) => item.value === props.value);
  const displayText = selectedItem ? selectedItem.label : props.placeholder;
  const calculatedWidth = calculateTextWidth(displayText || "");

  const minWidth = props.minWidth ?? 80;
  const maxWidth = props.maxWidth ?? 200;
  const dynamicWidth = Math.max(minWidth, Math.min(maxWidth, calculatedWidth));

  const containerStyle = props.containerStyle ?? {
    height: 48,
    width: dynamicWidth,
  };

  return (
    <DropDownPicker
      open={props.open}
      value={props.value}
      items={props.items}
      setOpen={props.setOpen}
      multiple={false}
      setValue={(callback) => {
        const newValue =
          typeof callback === "function" ? callback(props.value) : callback;
        if (newValue !== null) {
          props.setValue(newValue);
        }
      }}
      placeholder={props.placeholder}
      placeholderStyle={placeholderStyle}
      style={styles.mainStyle}
      dropDownContainerStyle={[
        styles.dropdownContainerStyle,
        { width: dynamicWidth },
      ]}
      textStyle={textStyle}
      labelStyle={labelStyle}
      listItemLabelStyle={labelStyle}
      selectedItemLabelStyle={labelStyle}
      listItemContainerStyle={styles.listItemContainerStyle}
      listChildLabelStyle={labelStyle}
      disableBorderRadius={false}
      containerStyle={containerStyle}
      ArrowUpIconComponent={({ style }) => (
        <TopButton
          width={iconWidth}
          height={iconHeight}
          color={Colors.gray2}
          style={style}
        />
      )}
      ArrowDownIconComponent={({ style }) => (
        <BottomButton
          width={iconWidth}
          height={iconHeight}
          color={Colors.gray2}
          style={style}
        />
      )}
      TickIconComponent={({ style }) => (
        <CheckMark
          width={iconWidth}
          height={iconHeight}
          color={Colors.gray2}
          style={style}
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  mainStyle: {
    overflow : 'hidden',
    backgroundColor : 'rgba(255, 255, 255, 0.6)',
    borderRadius : 10,
    borderWidth : 1,
    borderColor : Colors.white1
  },
  placeholderStyle: {
    color: Colors.gray2,
    fontSize: 18,
    fontFamily: Fonts.medium,
  },
  dropdownContainerStyle: {
    backgroundColor : Colors.white1,
    borderRadius : 10,
    borderWidth : 1,
    borderColor : Colors.white1,
    maxHeight: 200,
  },
  textStyle: {
    color: Colors.black2,
    fontSize: 18,
    fontFamily: Fonts.medium,
    paddingVertical: 8,
    paddingHorizontal: 6,
  },
  labelStyle: {
    color: Colors.black2,
    fontSize: 16,
    fontFamily: Fonts.medium,
    paddingVertical: 4,
    paddingHorizontal: 6,
    flexWrap: "wrap",
    flexShrink: 1,
    textAlign: "left",
    lineHeight: 20,
  },
  listItemContainerStyle: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    minHeight: 60,
    justifyContent: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  container : {
    overflow : 'hidden',
    backgroundColor : 'rgba(255, 255, 255, 0.6)',
    borderRadius : 10,
    borderWidth : 1,
    borderColor : Colors.white1
  }
});
