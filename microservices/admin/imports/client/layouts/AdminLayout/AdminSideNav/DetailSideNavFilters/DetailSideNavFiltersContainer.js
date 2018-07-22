import { withProps } from 'recompose';

import getFilterOptions, { filterFilterOptionsByValues } from './filterOptions';

export default withProps((props) => {
  const { setFilters, collectionName, filters = {} } = props;

  return {
    handleChange: (selectedOptions) => {
      const selectedFilters = selectedOptions
        .map(({ value }) => value)
        .filter(value => value);

      setFilters(collectionName, selectedFilters);
    },

    options: getFilterOptions(props),

    selected: filterFilterOptionsByValues(
      getFilterOptions(props),
      filters[collectionName],
    ),
  };
});
