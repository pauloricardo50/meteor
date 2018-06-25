import { compose, lifecycle, withProps } from 'recompose';
import { connect } from 'react-redux';

import getFilterOptions, { filterFilterOptionsByValues } from './filterOptions';

const withConnect = connect(({ sidenav: { filters } }) => ({ filters }));

export default compose(
  withConnect,
  withProps((props) => {
    const { setFilters, collectionName, filters = [] } = props;
    console.log('::::', props);

    return {
      handleChange: (selectedOptions) => {
        const selectedFilters = selectedOptions
          .map(({ value }) => value)
          .filter(value => value);

        setFilters(collectionName, selectedFilters);
      },

      options: getFilterOptions(props),

      selectedOptions: filterFilterOptionsByValues(
        getFilterOptions(props),
        filters,
      ),
    };
  }),

  lifecycle({
    componentDidMount() {
      // const { handleChange, selectedOptions: initialOptions } = this.props;
      // handleChange(initialOptions);
    },

    componentDidUpdate(prevProps) {
      console.log('-->', this.props.filters);
    },
  }),
);
