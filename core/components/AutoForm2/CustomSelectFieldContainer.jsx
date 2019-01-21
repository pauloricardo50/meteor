import React from 'react';

import T from '../Translation';
import Chip from '../Material/Chip';
import Loading from '../Loading';

export default (Component) => {
  class CustomSelectFieldContainer extends React.Component {
    constructor(props) {
      super(props);
      this.state = { values: props.allowedValues, data: null, error: null };
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
      if (customAllowedValues && typeof customAllowedValues === 'function') {
        Promise.resolve(customAllowedValues(model)).then(values =>
          this.setState({ values }));
      } else if (
        customAllowedValues
        && typeof customAllowedValues === 'object'
      ) {
        const { query, params = () => ({}) } = customAllowedValues;
        const { values } = this.state;

        this.setState({ loading: !values || !!values.length });

        query.clone(params(model)).fetch((error, data) => {
          if (error) {
            return this.setState({ error });
          }

          this.setState({
            values: data.map(({ _id }) => _id),
            data,
            error: null,
            loading: false,
          });
        });
      }
    };

    formatOption = (option) => {
      const { intlId, name } = this.props;
      return <T id={`Forms.${intlId || name}.${option}`} />;
    };

    renderValue = (value) => {
      const transform = this.makeTransform();
      const { placeholder } = this.props;

      if (!value) {
        return placeholder;
      }

      if (transform) {
        return transform(value);
      }

      if (Array.isArray(value)) {
        if (value.length === 0) {
          return placeholder;
        }
        return value.map(val => (
          <Chip
            key={val}
            label={this.formatOption(val)}
            style={{ marginRight: 4 }}
          />
        ));
      }

      return this.formatOption(value);
    };

    makeTransform = () => {
      const { transform } = this.props;
      const { data } = this.state;
      if (data) {
        return value => transform(data.find(({ _id }) => _id === value));
      }
      return transform;
    };

    render() {
      const { values, error, loading } = this.state;
      const { placeholder, displayEmpty } = this.props;

      if (error) {
        return <span className="error">{error.message || error.reason}</span>;
      }

      if (loading) {
        return <Loading />;
      }

      return (
        <Component
          {...this.props}
          placeholder={displayEmpty ? placeholder : ''}
          values={values}
          formatOption={this.formatOption}
          renderValue={this.renderValue}
          transform={this.makeTransform() || this.formatOption}
        />
      );
    }
  }

  CustomSelectFieldContainer.defaultProps = {
    displayEmpty: true,
  };

  return CustomSelectFieldContainer;
};
