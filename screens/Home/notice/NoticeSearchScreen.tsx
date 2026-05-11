import {
  Dimensions,
  ImageBackground,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Colors } from "../../../constants/Color";
import React, { memo, useCallback } from "react";
import NoticeItem from "../../../component/notice/NoticeItem";
import * as Progress from "react-native-progress";
import { Fonts } from "../../../constants/Fonts";
import { NoticeType } from "../../../type/notice/notice.type";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../navigation/RootStack";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import SubHeaderBar from "../../../component/home/SubHeaderBar";
import { DefaultImage } from "../../../constants/AppImages";
import {FlashList} from "@shopify/flash-list";
import NoticeSearchFilters from "../../../component/notice/NoticeSearchFilters";
import useNoticeSearchScreen from "../../../hooks/home/notice/useNoticeSearchScreen";
import ListEmptyState from "../../../component/ListEmptyState";

const { height } = Dimensions.get("window");

export type NoticeScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "NoticeSearch"
>;

const backgroundImage = DefaultImage.background
const viewabilityConfig = {
  itemVisiblePercentThreshold: 50,
};
const keyExtractor = (item: NoticeType) => item.id.toString();

const ItemSeparator = memo(function ItemSeparator() {
  return <View style={styles.separator} />;
});

export default function NoticeSearchScreen({
  navigation,
  route: { params },
}: NoticeScreenProps) {
  const insets = useSafeAreaInsets();
  const {
    filters,
    data: {
      allNotices,
      loading,
      refreshing,
      isFetchingNextPage,
      isNatural,
    },
    ui: {
      dropDownMargin,
    },
    actions: {
      handleRefresh,
      onViewableItemsChanged,
      updateNoticeInList,
    },
  } = useNoticeSearchScreen(params);

  const renderItem = useCallback(({item} : {item : NoticeType}) => (
    <View style={styles.noticeItemContainer}>
      <NoticeItem
        item={item}
        onPress={() => {
          navigation.navigate("InNotice", {
            Notice: item,
            onGoBack: updateNoticeInList,
          });
        }}
      />
    </View>
  ), [navigation, updateNoticeInList])

  return (
      <ImageBackground
        source={backgroundImage}
        style={[
          styles.container,
          { paddingTop: insets.top, paddingBottom: insets.bottom },
        ]}
      >
        <SubHeaderBar title="공고 검색" handleBackPress={() => navigation.goBack()} />
        <NoticeSearchFilters
          {...filters}
          isNatural={isNatural}
          dropDownMargin={dropDownMargin}
        />
        <FlashList
          ItemSeparatorComponent={ItemSeparator}
          removeClippedSubviews
          style={isNatural ? styles.naturalList : styles.filteredList}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          data={refreshing ? [] : allNotices}
          refreshing={false}
          onRefresh={refreshing ? undefined : handleRefresh}
          viewabilityConfig={viewabilityConfig}
          keyExtractor={keyExtractor}
          onViewableItemsChanged={onViewableItemsChanged}
          renderItem={renderItem}
          ListFooterComponent={
            loading || isFetchingNextPage ? (
              <LoadingIndicator />
            ) : (
              <View style={styles.footerSpacer} />
            )
          }
          ListEmptyComponent={
            !isFetchingNextPage && !loading && refreshing ? (
              <LoadingIndicator />
            ) : !loading && !isFetchingNextPage ? (
              <ListEmptyState
                message="공고 항목이 없습니다."
                style={styles.emptyContainer}
              />
            ) : (
              <View />
            )
          }
        />
      </ImageBackground>
  );
}

const LoadingIndicator = memo(function LoadingIndicator() {
  return (
    <View style={[styles.indicatorContainer, { marginTop: height * 0.25 }]}>
      <Progress.Circle
        color={Colors.primary}
        size={50}
        indeterminate
        thickness={300}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },
  listContent: {
    gap: 16,
  },
  naturalList: {
    marginTop: 20,
  },
  filteredList: {
    marginTop: 70,
  },
  noticeItemContainer: {
    marginHorizontal: 16,
  },
  indicatorContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: height * 0.25,
  },
  footerSpacer: {
    height: 16,
  },
  separator: {
    height: 16,
  },
});
