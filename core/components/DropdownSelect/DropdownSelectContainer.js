import { compose, withStateHandlers, withProps } from 'recompose';
import isEqual from 'lodash/isEqual';

const withToggleState = withStateHandlers(
  { anchorEl: null },
  {
    handleClick: () => event => ({ anchorEl: event.target }),
    handleClose: () => () => ({ anchorEl: null }),
  },
);

const optionsIncludeOption = (options, { value }) =>
  !!options.find(option => isEqual(option.value, value));

const removeOptionFromOptions = (option, options) =>
  options.filter(({ value }) => !isEqual(value, option.value));

export default compose(
  withProps(({ options, selected, onChange }) => ({
    optionsIncludeOption,

    handleChange: (option) => {
      const newOptions = optionsIncludeOption(selected, option)
        ? removeOptionFromOptions(option, selected)
        : [...selected, option];

      onChange(newOptions);
    },
  })),
  withToggleState,
);
