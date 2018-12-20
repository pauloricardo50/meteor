import { createElement } from 'react';
import PropTypes from 'prop-types';

import AutoField from 'uniforms-material/AutoField';
import nothing from 'uniforms/nothing';

const CustomAutoFields = (
  { autoField, element, fields, omitFields, ...props },
  {
    uniforms: {
      schema,
      model,
      state: { submitting },
    },
  },
) =>
  createElement(
    element,
    props,
    (fields || schema.getSubfields())
      .filter(field => omitFields.indexOf(field) === -1)
      .map(field => {
        const { condition, customAllowedValues } = schema.getField(field);
        const component = createElement(autoField, {
          key: field,
          name: field,
          customAllowedValues,
          model,
          submitting,
        });
        if (typeof condition === 'function') {
          return condition(model) ? component : nothing;
        }
        return component;
      }),
  );

CustomAutoFields.contextTypes = AutoField.contextTypes;

CustomAutoFields.propTypes = {
  autoField: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  element: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),

  fields: PropTypes.arrayOf(PropTypes.string),
  omitFields: PropTypes.arrayOf(PropTypes.string),
};

CustomAutoFields.defaultProps = {
  autoField: AutoField,
  element: 'div',
  omitFields: [],
};

export default CustomAutoFields;
