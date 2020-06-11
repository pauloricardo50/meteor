import { compose, mapProps } from 'recompose';

import { mapSelectOptions } from './selectHelpers';

const SelectContainer = compose(
  mapProps(({ options, onChange, id, grouping, ...otherProps }) => ({
    rawOptions: options,
    options: mapSelectOptions(options, grouping),
    onChange: e => onChange(e.target.value, id),
    id,
    ...otherProps,
  })),
);

export default SelectContainer;
