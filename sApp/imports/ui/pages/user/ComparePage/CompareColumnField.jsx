import React from 'react';
import PropTypes from 'prop-types';

import Icon from 'core/components/Icon';

import {
  IntlNumber,
  IntlDate,
} from '/imports/ui/components/general/Translation';
import colors from 'core/config/colors';

import ValidatorItem from './ValidatorItem';

const CompareColumnField = (props) => {
  const { field, property } = props;
  let value;

  if (field.custom) {
    value = property.fields[field.id];
  } else {
    value = property[field.id];
  }

  if (value === undefined) {
    return <span>-</span>;
  } else if (typeof value === 'object' && field.type !== 'date') {
    return (
      <div className="flex-col center">
        <span className="text-ellipsis">{value.primary}</span>
        <span className="secondary">{value.secondary}</span>
      </div>
    );
  }

  if (field.id.indexOf('Monthly') >= 0) {
    return (
      <span className="text-ellipsis">
        <IntlNumber value={value} format="money" />{' '}
        <span className="secondary">/mois</span>
      </span>
    );
  } else if (field.id === 'isValid') {
    return (
      <ValidatorItem
        isValid={value}
        error={property.error}
        errorClass={property.errorClass}
      />
    );
  }

  switch (field.type) {
    case 'number':
      return <span>{value}</span>;
    case 'money':
      return <IntlNumber value={value} format="money" />;
    case 'date':
      return (
        <IntlDate
          value={value}
          year="numeric"
          month="long"
          day="numeric"
          // hour="2-digit"
          // minute="2-digit"
        />
      );
    case 'boolean':
      return (
        <span>
          {value ? (
            <Icon type="check" color={colors.success} />
          ) : (
            <Icon type="close" color={colors.error} />
          )}
        </span>
      );
    case 'percent':
      return <IntlNumber value={value} format="percentage" />;
    default:
      return <span className="text-ellipsis">{value}</span>;
  }
};

CompareColumnField.propTypes = {
  field: PropTypes.object.isRequired,
  property: PropTypes.object.isRequired,
};

export default CompareColumnField;
