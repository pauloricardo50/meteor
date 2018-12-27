// @flow
import React, { Component } from 'react';
import SelectField from 'uniforms-material/SelectField';

import Chip from '../Material/Chip';
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
    this.getAllowedValues(this.props);
  }

  componentWillReceiveProps(nextProps) {
    const { model: nextModel } = nextProps;
    const { model } = this.props;

    if (JSON.stringify(model) !== JSON.stringify(nextModel)) {
      this.getAllowedValues(nextProps);
    }
  }

  getAllowedValues = (props) => {
    const { customAllowedValues, model } = props;
    if (typeof customAllowedValues === 'function') {
      Promise.resolve(customAllowedValues(model)).then(values =>
        this.setState({ values }));
    }
  };

  formatOption = (option) => {
    const { intlId, name } = this.props;
    return <T id={`Forms.${intlId || name}.${option}`} />;
  };

  render() {
    const { transform, submitting, ...props } = this.props;
    const { values } = this.state;
    return values || submitting ? (
      <SelectField
        {...props}
        allowedValues={values || []}
        transform={transform || this.formatOption}
        renderValue={(value) => {
          if (value === undefined || value === '') {
            return null;
          }

          if (Array.isArray(value)) {
            return value.map(val => (
              <Chip
                key={val}
                label={this.formatOption(val)}
                style={{ marginRight: 4 }}
              />
            ));
          }

          return this.formatOption(value);
        }}
        displayEmpty
      />
    ) : (
      <Loading />
    );
  }
}
