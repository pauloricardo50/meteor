import createQuery from 'meteor/cultofcoders:grapher/lib/createQuery';

import React, { PureComponent } from 'react';
import { injectIntl } from 'react-intl';

import Loading from '../../Loading';
import Chip from '../../Material/Chip';
import T from '../../Translation';
import { OTHER_ALLOWED_VALUE } from '../autoFormConstants';

const getQuery = ({ query, params = {}, model }) => {
  const finalParams = typeof params === 'function' ? params(model) : params;

  if (typeof query === 'string') {
    return createQuery({ [query]: finalParams });
  }

  return query.clone(finalParams);
};

export default Component => {
  class CustomSelectFieldContainer extends PureComponent {
    constructor(props) {
      super(props);
      this.state = {
        data: props.data || null,
        error: null,
        loading: false,
      };

      const { allowedValues, recommendedValues } = props;
      if (allowedValues) {
        this.state.values = allowedValues;
      } else if (recommendedValues) {
        if (typeof recommendedValues === 'function') {
          this.getRecommendedValues(this.props);
        } else {
          this.state.values = recommendedValues;
        }
      } else {
        this.getCustomAllowedValues(this.props);
      }
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
      const { model: nextModel } = nextProps;
      const {
        model,
        handleClick,
        name,
        recommendedValues,
        allowedValues,
      } = this.props;

      if (model !== nextModel) {
        if (allowedValues) {
          this.setState({ values: allowedValues });
        } else if (recommendedValues) {
          this.getRecommendedValues(nextProps);
        } else {
          this.getCustomAllowedValues(nextProps);
        }
      }

      if (typeof handleClick === 'function') {
        const currentValues = model[name] || [];
        const nextValues = nextModel[name] || [];
        if (currentValues.length !== nextValues.length) {
          handleClick(nextModel);
        }
      }
    }

    filterRecommendedValues(recommendedValues) {
      const { withCustomOther, value } = this.props;

      const filteredRecommendValues = [
        ...recommendedValues,
        !withCustomOther && value,
      ]
        .filter((val, index, array) => array.indexOf(val) === index)
        .filter(x => x);

      return withCustomOther
        ? [...filteredRecommendValues, OTHER_ALLOWED_VALUE]
        : filteredRecommendValues;
    }

    getRecommendedValues(props) {
      const { recommendedValues, model } = props;

      if (!recommendedValues) {
        return;
      }

      if (typeof recommendedValues === 'function') {
        Promise.resolve()
          .then(() => recommendedValues(model))
          .then(result =>
            this.setState({ values: this.filterRecommendedValues(result) }),
          )
          .finally(() => this.setState({ loading: false }));
      } else {
        this.setState({
          values: this.filterRecommendedValues(recommendedValues),
          loading: false,
          error: null,
        });
      }
    }

    getCustomAllowedValues = props => {
      const { customAllowedValues, model, parent } = props;
      const { values } = this.state;

      if (!customAllowedValues) {
        return;
      }

      this.setState({ loading: !values || !values.length });

      if (typeof customAllowedValues === 'function') {
        Promise.resolve()
          .then(() =>
            customAllowedValues(model, parent && Number(parent.name.slice(-1))),
          )
          .then(result => this.setState({ values: result }))
          .finally(() => this.setState({ loading: false }));
      } else if (typeof customAllowedValues === 'object') {
        const { query, params, allowNull } = customAllowedValues;

        getQuery({ query, params, model }).fetch((error, data) => {
          if (error) {
            return this.setState({ error, loading: false });
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
      const {
        allowedValuesIntlId,
        intlId,
        name,
        intl: { formatMessage } = {},
      } = this.props;

      const id = `Forms.${allowedValuesIntlId || intlId || name}.${option}`;

      const label = formatMessage({ id });

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
          return transform(data.find(item => item?._id === value));
        };
      }
      return transform;
    };

    render() {
      const { values, error, loading, data } = this.state;
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

      if (!values || !values.length) {
        return null;
      }

      return (
        <Component
          {...rest}
          nullable={uniforms.nullable}
          displayEmpty
          values={values}
          formatOption={this.formatOption}
          renderValue={this.renderValue}
          transform={this.makeTransform() || this.formatOption}
          data={data}
        />
      );
    }
  }

  CustomSelectFieldContainer.defaultProps = {
    displayEmpty: true,
  };

  return injectIntl(CustomSelectFieldContainer);
};
