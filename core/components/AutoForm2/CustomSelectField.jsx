// @flow
import React, { Component } from 'react';
import SelectField from 'uniforms-material/SelectField';
import debounce from 'lodash/debounce';

import T from '../Translation';
import Loading from '../Loading/Loading';

type CustomSelectFieldProps = {
  transform: Function,
  allowedValues: Array,
  customAllowedValues: Function,
  model: Object,
};
type CustomSelectFieldState = {
  values: Array,
};

export default class CustomSelectField extends Component<
  CustomSelectFieldProps,
  CustomSelectFieldState,
> {
  constructor(props) {
    super(props);
    this.state = { values: props.allowedValues };
  }

  getAllowedValues = debounce(() => {
    const { customAllowedValues, model } = this.props;
    if (typeof customAllowedValues === 'function') {
      Promise.resolve(customAllowedValues(model)).then(values =>
        this.setState({ values }));
    }
  }, 300);

  render() {
    this.getAllowedValues();
    const { transform, ...props } = this.props;
    const { values } = this.state;
    return values ? (
      <SelectField
        {...props}
        allowedValues={values}
        transform={
          transform
          || (option => <T id={`Forms.${props.intlId || props.name}.${option}`} />)
        }
        displayEmpty
      />
    ) : (
      <Loading />
    );
  }
}
