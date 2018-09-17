// @flow
import React from 'react';
import { compose, lifecycle, withState } from 'recompose';

import Select from '../Select';
import withLoading from '../Loading/withLoading';

type SelectFieldProps = {};

const SelectField = (props: SelectFieldProps) => {
    <Select
      {...input}
      {...props}
      error={displayError && error}
      onChange={(_, value) => input.onChange(value)}
    />
  );
};

export default compose(
  withState('loading', 'setLoading', true),
  lifecycle({
    componentDidMount() {
      this.props.setLoading(true);
      if (this.props.fetchOptions) {
        this.props
          .fetchOptions()
          .then((result) => {
            this.setState({ options: result });
          })
          .finally(() => this.props.setLoading(false));
      } else {
        this.props.setLoading(false);
      }
    },
  }),
  withLoading(true),
)(SelectField);
