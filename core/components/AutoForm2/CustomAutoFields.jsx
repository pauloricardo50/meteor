import { createElement } from 'react';
import PropTypes from 'prop-types';

import AutoField from 'uniforms-material/AutoField';

const CustomAutoFields = (
  { autoField, element, fields, omitFields, ...props },
  { uniforms: { schema } },
) =>
  createElement(
    element,
    { key: 'custom-autofields', className: 'autofields', ...props },
    (fields || schema.getSubfields())
      .filter(field => omitFields.indexOf(field) === -1)
      .map(field => createElement(autoField, { key: field, name: field })),
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
