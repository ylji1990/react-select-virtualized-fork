import { GroupVirtualizedListFactory } from '@rsv-components/grouped-virtualized-list';
import { FlatVirtualizedListFactory } from '@rsv-components/flat-virtualized-list';

export const buildListComponents = (props) => {
  const components = {};
  components.MenuList = props.grouped
    ? GroupVirtualizedListFactory({
        formatGroupHeader: props.formatGroupHeaderLabel,
        groupHeaderHeight: props.groupHeaderHeight,
        optionHeight: props.optionHeight,
        defaultValue: props.defaultValue,
        renderListWrapper: props.renderListWrapper,
        afterListRender: props.afterListRender,
      })
    : FlatVirtualizedListFactory({
        optionHeight: props.optionHeight,
        defaultValue: props.defaultValue,
        formatOptionLabel: props.formatOptionLabel,
        renderListWrapper: props.renderListWrapper,
        afterListRender: props.afterListRender,
      });

  return components;
};

export const getStyles = () => {
  return {
    clearIndicator: (provided) => ({
      ...provided,
      ':hover': {
        cursor: 'pointer',
        color: '#f22',
      },
    }),
  };
};
