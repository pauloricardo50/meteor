import React, { useEffect, useState } from 'react';
import { get } from 'lodash';
import { useIntl } from 'react-intl';

import { createQuery } from '../../../api/queries';
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

const filterRecommendedValues = (withCustomOther, value, result) => {
  const filteredRecommendValues = [...result, !withCustomOther && value]
    .filter((val, index, array) => array.indexOf(val) === index)
    .filter(x => x);

  return withCustomOther
    ? [...filteredRecommendValues, OTHER_ALLOWED_VALUE]
    : filteredRecommendValues;
};

const getInitialState = ({
  data,
  allowedValues,
  recommendedValues,
  withCustomOther,
  value,
}) => {
  let values = [];

  if (allowedValues) {
    values = allowedValues;
  } else if (recommendedValues) {
    if (recommendedValues && typeof recommendedValues !== 'function') {
      values = filterRecommendedValues(
        withCustomOther,
        value,
        recommendedValues,
      );
    }
  }

  return {
    data: data || null,
    error: null,
    loading: false,
    values,
  };
};

const getCustomAllowedValues = ({ customAllowedValues, model, parent }) => {
  if (typeof customAllowedValues === 'function') {
    return Promise.resolve(
      customAllowedValues(model, parent && Number(parent.name.slice(-1))),
    ).then(result => ({ values: result }));
  }

  if (typeof customAllowedValues === 'object') {
    const {
      query,
      params,
      allowNull,
      postProcess = x => x,
    } = customAllowedValues;

    return new Promise((resolve, reject) => {
      getQuery({ query, params, model }).fetch((error, data) => {
        if (error) {
          reject(error);
        }

        const processedData = postProcess(data);

        const ids = processedData.map(({ _id }) => _id);

        resolve({
          values: allowNull ? [null, ...ids] : ids,
          data: allowNull ? [null, ...processedData] : processedData,
        });
      });
    });
  }
};

const makeFormatOption = ({
  allowedValuesIntlId,
  formatMessage,
  intlId,
  name,
}) => option => {
  const id = `Forms.${allowedValuesIntlId || intlId || name}.${option}`;

  const label = formatMessage({ id });

  return label === id ? option : <T id={id} />;
};

const getDeps = (customAllowedValues, deps) => {
  if (customAllowedValues?.deps) {
    return customAllowedValues.deps;
  }

  if (deps) {
    return deps;
  }

  return [];
};

const useCustomSelectField = ({
  allowedValues,
  allowedValuesIntlId,
  customAllowedValues,
  data,
  displayEmpty = true,
  intlId,
  model,
  name,
  parent,
  placeholder,
  recommendedValues,
  transform,
  value,
  withCustomOther,
  disabled,
  deps,
}) => {
  const intl = useIntl();
  const [state, setState] = useState(() =>
    getInitialState({
      data,
      allowedValues,
      recommendedValues,
      withCustomOther,
      value,
    }),
  );
  const finalDeps = getDeps(customAllowedValues, deps);

  const formatOption = makeFormatOption({
    allowedValuesIntlId,
    formatMessage: intl.formatMessage,
    intlId,
    name,
  });

  const transformFunc = val => {
    if (state.data && val) {
      return transform(state.data.find(item => item?._id === val));
    }

    return transform ? transform(val) : formatOption(val);
  };

  const renderValue = val => {
    if (!val) {
      return placeholder && <i className="secondary">{placeholder}</i>;
    }

    if (Array.isArray(value)) {
      if (value.length === 0) {
        return placeholder;
      }
      return value.map(v => (
        <Chip
          key={v}
          label={transform ? transformFunc(v) : formatOption(v)}
          style={{ marginRight: 4 }}
        />
      ));
    }

    return transformFunc(val);
  };

  const fetchValues = () => {
    if (typeof recommendedValues === 'function') {
      const result = recommendedValues(model);

      if (result?.then) {
        result.then(res => {
          setState(s => ({
            ...s,
            values: filterRecommendedValues(withCustomOther, value, res),
          }));
        });
      } else {
        setState(s => ({
          ...s,
          values: filterRecommendedValues(withCustomOther, value, result),
        }));
      }
    }

    if (customAllowedValues) {
      setState({
        ...state,
        loading: !state.values || state.values?.length === 0,
      });
      getCustomAllowedValues({
        customAllowedValues,
        model,
        parent,
      }).then(newState =>
        setState(s => ({ ...s, ...newState, loading: false })),
      );
    }
  };

  useEffect(
    fetchValues,
    finalDeps.map(dep => get(model, dep)),
  );

  const isUsable = !state.loading && state.values?.length > 0;
  const isDisabled = disabled || !isUsable;

  return {
    ...state,
    formatOption,
    transform: transformFunc,
    renderValue,
    displayEmpty,
    isDisabled,
  };
};

export default useCustomSelectField;
