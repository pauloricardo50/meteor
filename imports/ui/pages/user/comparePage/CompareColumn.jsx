import React from 'react';
import PropTypes from 'prop-types';

import {
  IntlNumber,
  IntlDate,
} from '/imports/ui/components/general/Translation.jsx';

const renderField = (props, field) => {
  const value = props.property[field.id];

  if (value === undefined) {
    return '-';
  }

  if (field.id === 'monthly') {
    return (
      <span>
        <IntlNumber value={value} format="money" />{' '}
        <span className="secondary">/mois</span>
      </span>
    );
  }

  switch (field.type) {
    case 'number':
      return value;
    case 'money':
      return <IntlNumber value={value} format="money" />;
    case 'date':
      return (
        <IntlDate
          value={value}
          month="2-digit"
          day="2-digit"
          hour="2-digit"
          minute="2-digit"
        />
      );
    case 'boolean':
      return value ? 'Yep' : 'Nope';
    default:
      return value;
  }
};

const CompareColumn = props =>
  (<ul className="mask1 compare-column default-column">
    {props.fields.map(field =>
      (<li key={field.id}>
        {renderField(props, field)}
      </li>),
    )}
  </ul>);

CompareColumn.propTypes = {
  property: PropTypes.objectOf(PropTypes.any).isRequired,
  fields: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default CompareColumn;
