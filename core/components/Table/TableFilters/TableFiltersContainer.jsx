import React, { Component } from 'react';
import { withProps, compose } from 'recompose';
import cloneDeep from 'lodash/cloneDeep';
import set from 'lodash/set';

export default compose(
  WrappedComponent =>
    class extends Component {
      constructor(props) {
        super(props);
        const { filters = {} } = this.props;
        this.state = { filters };
      }

      handleOptionsSelect = (filterPath, newFilterValue) => {
        this.setState(({ filters: prevFilters }) => {
          const newFilters = set(
            cloneDeep(prevFilters.filters),
            filterPath,
            newFilterValue,
          );

          return {
            filters: { ...prevFilters, filters: newFilters },
          };
        });
      };

      render() {
        return (
          <WrappedComponent
            {...this.props}
            {...this.state}
            handleOptionsSelect={this.handleOptionsSelect}
          />
        );
      }
    },

  withProps(({ filters: { filters } }) => ({
    pickOptionsForFilter(options = {}, path) {
      const lastFilterKey = path[path.length - 1];
      return options[lastFilterKey];
    },
    renderFilters: filters && Object.keys(filters).length > 0,
  })),
);
