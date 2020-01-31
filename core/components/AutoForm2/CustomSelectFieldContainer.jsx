import React, { PureComponent } from 'react';

import { formatMessage } from 'core/utils/intl';
import T from '../Translation';
import Chip from '../Material/Chip';
import Loading from '../Loading';
import { OTHER_ALLOWED_VALUE } from './constants';

export default Component => {
  class CustomSelectFieldContainer extends PureComponent {
    constructor(props) {
      super(props);
      this.state = { values: props.allowedValues, data: null, error: null };
    }

    componentDidMount() {
      this.getAllowedValues(this.props);
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
      const { model: nextModel } = nextProps;
      const { model, handleClick, name } = this.props;

      if (model !== nextModel) {
        this.getAllowedValues(nextProps);
      }

      if (typeof handleClick === 'function') {
        const currentValues = model[name] || [];
        const nextValues = nextModel[name] || [];
        if (currentValues.length !== nextValues.length) {
          handleClick(nextModel);
        }
      }
    }

    getAllowedValues = props => {
      const {
        customAllowedValues,
        model,
        parent,
        recommendedValues,
        withCustomOther,
        value,
      } = props;
      const { values } = this.state;

      const filteredRecommendValues = [
        ...recommendedValues,
        !withCustomOther && value,
      ]
        .filter((val, index, array) => array.indexOf(val) === index)
        .filter(x => x);

      if (recommendedValues) {
        return this.setState({
          values: withCustomOther
            ? [...filteredRecommendValues, OTHER_ALLOWED_VALUE]
            : filteredRecommendValues,
        });
      }

      if (customAllowedValues) {
        this.setState({ loading: !values || !values.length });
      }

      if (customAllowedValues && typeof customAllowedValues === 'function') {
        Promise.resolve()
          .then(() =>
            customAllowedValues(model, parent && Number(parent.name.slice(-1))),
          )
          .then(result => this.setState({ values: result }))
          .finally(() => this.setState({ loading: false }));
      } else if (
        customAllowedValues &&
        typeof customAllowedValues === 'object'
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

    formatOption = option => {
      const { allowedValuesIntlId, intlId, name } = this.props;

      const id = `Forms.${allowedValuesIntlId || intlId || name}.${option}`;

      const label = formatMessage({ id });
      // if (withCustomOther) {
      //   return label === id ? option : label;
      // }

      return label === id ? option : <T id={id} />;
    };

    renderValue = value => {
      const transform = this.makeTransform();
      const { placeholder } = this.props;

      if (!value) {
        return placeholder && <i className="secondary">{placeholder}</i>;
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
        return value => {
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
      const {
        customAllowedValues,
        displayEmpty,
        field,
        fields,
        model,
        placeholder,
        uniforms,
        handleClick,
        ...rest
      } = this.props;

      if (error) {
        return <span className="error">{error.message || error.reason}</span>;
      }

      if (loading) {
        return <Loading small />;
      }

      return (
        <Component
          {...rest}
          displayEmpty
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
