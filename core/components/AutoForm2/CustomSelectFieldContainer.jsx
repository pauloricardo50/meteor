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
      const { customAllowedValues, model, parent } = props;
      const { values } = this.state;

      if (customAllowedValues) {
        this.setState({ loading: !values || !values.length });
      }

      if (customAllowedValues && typeof customAllowedValues === 'function') {
        Promise.resolve()
          .then(() =>
            customAllowedValues(model, parent && Number(parent.name.slice(-1))))
          .then(result => this.setState({ values: result }))
          .finally(() => this.setState({ loading: false }));
      } else if (
        customAllowedValues
        && typeof customAllowedValues === 'object'
      ) {
        const { query, params = () => ({}), allowNull } = customAllowedValues;

        query.clone(params(model)).fetch((error, data) => {
          if (error) {
            return this.setState({ error });
          }

          const ids = data.map(({ _id }) => _id);

          this.setState({
            values: allowNull ? [null, ...ids] : ids,
            data: allowNull ? [null, ...data] : data,
            error: null,
            loading: false,
          });
        });
      }
    };

    formatOption = (option) => {
      const { allowedValuesIntlId, intlId, name } = this.props;
      return (
        <T id={`Forms.${allowedValuesIntlId || intlId || name}.${option}`} />
      );
    };

    renderValue = (value) => {
      const transform = this.makeTransform();
      const { placeholder } = this.props;

      if (!value) {
        return placeholder;
      }

      if (Array.isArray(value)) {
        if (value.length === 0) {
          return placeholder;
        }
        return value.map(val => (
          <Chip
            key={val}
            label={transform ? transform(val) : this.formatOption(val)}
            style={{ marginRight: 4 }}
          />
        ));
      }

      if (transform) {
        return transform(value);
      }

      return this.formatOption(value);
    };

    makeTransform = () => {
      const { transform } = this.props;
      const { data } = this.state;
      if (data) {
        return (value) => {
          if (!value) {
            // If the value is falsy, just transform it
            return transform(value);
          }
          return transform(data.find(item => (item && item._id) === value));
        };
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
        return <Loading small />;
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
