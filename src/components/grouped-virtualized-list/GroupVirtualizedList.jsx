import React, { useEffect, useCallback, memo, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { List, InfiniteLoader, AutoSizer } from 'react-virtualized';
import { getListHeight, getScrollIndex, getNextRowIndex } from '@rsv-lib/getters';
import { groupVirtualizedListRowRenderer } from '@rsv-lib/renderers';
import { getGroupRowHeight } from '@rsv-lib/getters';
import { useDebouncedCallback } from '@rsv-hooks/use-debaunced-callback';

let GroupVirtualizedList = (props) => {
  const [focusedItemIndex, setFocusedItemIndex] = useState(undefined);
  const [queueScrollToIdx, setQueueScrollToIdx] = useState(undefined);
  let listComponent;

  const {
    maxHeight,
    formatGroupHeader,
    formatOptionLabel,
    flatCollection,
    optionHeight,
    children,
    selectedValue,
    defaultValue,
    groupHeaderHeight,
    valueGetter,
    /** ylji add ↓ */
    renderListWrapper,
    afterListRender,
    /** ylji add ↑ */
  } = props;

  useEffect(() => {
    // only scroll to index when we have something in the queue of focused and not visible
    if (listComponent && queueScrollToIdx) {
      listComponent.current.scrollToRow(getNextRowIndex(focusedItemIndex, queueScrollToIdx, flatCollection));
      setQueueScrollToIdx(undefined);
    }
  }, [listComponent, queueScrollToIdx, focusedItemIndex, flatCollection]);

  /** ylji add ↓ */
  useEffect(()=>{
    const cb = afterListRender && afterListRender(
      listComponent && listComponent.current);
    return ()=>{
      cb && cb();
    }
  }, [listComponent])
  /** ylji add ↑ */

  const onOptionFocused = useCallback(
    ({ index, isVisible }) => {
      if (index !== undefined && isVisible) {
        setFocusedItemIndex(index);
      } else if (index !== undefined && !isVisible && !queueScrollToIdx) {
        setQueueScrollToIdx(index);
      }
    },
    [queueScrollToIdx],
  );

  const height = useMemo(
    () =>
      getListHeight({
        maxHeight,
        totalSize: flatCollection.length,
        groupSize: children.length,
        optionHeight,
        groupHeaderHeight,
      }),
    [maxHeight, flatCollection.length, children.length, optionHeight, groupHeaderHeight],
  );

  const scrollToIndex = useMemo(
    () =>
      getScrollIndex({
        children: flatCollection,
        selected: selectedValue || defaultValue,
        valueGetter,
      }),
    [flatCollection, selectedValue, defaultValue, valueGetter],
  );

  const rowHeight = useMemo(
    () =>
      getGroupRowHeight({
        children: flatCollection,
        optionHeight,
        groupHeaderHeight,
      }),
    [flatCollection, optionHeight, groupHeaderHeight],
  );

  let list = [];

  const rowRenderer = useMemo(
    () =>
      groupVirtualizedListRowRenderer({
        children: flatCollection,
        formatGroupHeader,
        onOptionFocused,
        optionHeight,
        formatOptionLabel,
      }),
    [flatCollection, formatGroupHeader, onOptionFocused, optionHeight, formatOptionLabel],
  );

  const isRowLoaded = useCallback(
    ({ index }) => {
      return !!list[index];
    },
    [list],
  );

  const loadMoreRows = useDebouncedCallback(
    ({ startIndex, stopIndex }) => {
      for (let i = startIndex; i <= stopIndex; i++) {
        list.push(children[i]);
      }
    },
    100,
    [flatCollection, list],
  );

  return (
    <AutoSizer disableHeight>
      {({ width }) => (
        <InfiniteLoader
          isRowLoaded={isRowLoaded}
          threshold={props.threshold}
          loadMoreRows={loadMoreRows}
          rowCount={props.children.length || 0}
          minimumBatchSize={props.minimumBatchSize}
        >
          {/** ylji update ↓ */}
          {/*{({ onRowsRendered, registerChild }) => (*/}
          {/*  <List*/}
          {/*    ref={(element) => {*/}
          {/*      registerChild(element);*/}
          {/*      listComponent = {*/}
          {/*        current: element,*/}
          {/*      };*/}
          {/*      return element;*/}
          {/*    }}*/}
          {/*    onRowsRendered={onRowsRendered}*/}
          {/*    height={height}*/}
          {/*    scrollToIndex={scrollToIndex}*/}
          {/*    rowCount={props.flatCollection.length || 0}*/}
          {/*    rowHeight={rowHeight}*/}
          {/*    rowRenderer={rowRenderer}*/}
          {/*    width={width}*/}
          {/*  />*/}
          {/*)}*/}
          {({ onRowsRendered, registerChild }) => {
            const list = (
              <List
                ref={(element) => {
                  registerChild(element);
                  listComponent = {
                    current: element,
                  };
                  return element;
                }}
                onRowsRendered={onRowsRendered}
                height={height}
                scrollToIndex={scrollToIndex}
                rowCount={props.flatCollection.length || 0}
                rowHeight={rowHeight}
                rowRenderer={rowRenderer}
                width={width}
              />
            )
            return renderListWrapper ? renderListWrapper(list) : list;
          }}
          {/** ylji update ↑ */}
        </InfiniteLoader>
      )}
    </AutoSizer>
  );
};

GroupVirtualizedList = memo(GroupVirtualizedList);

GroupVirtualizedList.propTypes = {
  maxHeight: PropTypes.number, // this prop is coming from react-select
  children: PropTypes.node.isRequired,
  optionHeight: PropTypes.number,
  groupHeaderHeight: PropTypes.number,
  selectedValue: PropTypes.object,
  defaultValue: PropTypes.object,
  valueGetter: PropTypes.func,
  formatGroupHeader: PropTypes.func.isRequired,
  formatOptionLabel: PropTypes.func,
  flatCollection: PropTypes.array.isRequired,
  minimumBatchSize: PropTypes.number,
  /** ylji add ↓ */
  renderListWrapper: PropTypes.func,
  afterListRender: PropTypes.func,
  /** ylji add ↑ */
};

GroupVirtualizedList.defaultProps = {
  valueGetter: (item) => item && item.value,
  formatOptionLabel: undefined,
  minimumBatchSize: 1000,
};

GroupVirtualizedList.displayName = 'GroupVirtualizedList';

export default GroupVirtualizedList;
