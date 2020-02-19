import React, { memo, useMemo } from 'react';
import PropTypes from 'prop-types';

const configFastLabelOption = {
  context: 'menu',
};

const FastLabel = memo(({ data, setValue, isHovering, isSelected, isFocused, style, formatOptionLabel }) => {
  const onClickHandler = () => setValue(data);

  const label = useMemo(() => (formatOptionLabel ? formatOptionLabel(data, configFastLabelOption) : data.label), [
    data,
    formatOptionLabel,
  ]);

  return (
    <div
      className={`${
        isSelected ? 'fast-option-selected' : isHovering || isFocused ? 'fast-option-focused' : ''
      } fast-option ${data.__isNew__ ? 'fast-option-create' : ''}`}
      style={style}
      onClick={onClickHandler}
    >
      {label}
    </div>
  );
});

FastLabel.propTypes = {
  data: PropTypes.object.isRequired,
  setValue: PropTypes.func,
  isHovering: PropTypes.bool.isRequired,
  // wait for https://github.com/JedWatson/react-select/issues/3656
  // the problem is that the always start now from the beginning and not from the last selected. so
  // the arrow functionality is lost between closing and opening again.
  // isFocused: PropTypes.bool.isRequired,
  isSelected: PropTypes.bool.isRequired,
  style: PropTypes.object,
  formatOptionLabel: PropTypes.func,
};

FastLabel.defaultProps = {
  setValue: undefined,
  style: undefined,
  formatOptionLabel: undefined,
};

FastLabel.displayName = 'FastLabel';

export default FastLabel;
