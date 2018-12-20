// @flow
import React, { Component } from 'react';
import SelectField from 'uniforms-material/SelectField';
import debounce from 'lodash/debounce';
import isEqual from 'lodash/isEqual';

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

  componentDidMount() {
    this.getAllowedValues();
  }

  componentWillReceiveProps({ model: nextModel }) {
    const { model } = this.props;

    if (!isEqual(nextModel, model)) {
      this.getAllowedValues();
    }
  }

  getAllowedValues = () => {
    const { customAllowedValues, model } = this.props;
    if (typeof customAllowedValues === 'function') {
      Promise.resolve(customAllowedValues(model)).then(values =>
        this.setState({ values }),
      );
    }
  };

  render() {
    const { transform, submitting, ...props } = this.props;
    const { values } = this.state;
    return values || submitting ? (
      <SelectField
        {...props}
        allowedValues={values || []}
        transform={
          transform ||
          (option => <T id={`Forms.${props.intlId || props.name}.${option}`} />)
        }
        displayEmpty
      />
    ) : (
      <Loading />
    );
  }
}
