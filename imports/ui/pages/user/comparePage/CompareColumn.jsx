import React from 'react';
import PropTypes from 'prop-types';

import classnames from 'classnames';

import {
  IntlNumber,
  IntlDate,
} from '/imports/ui/components/general/Translation.jsx';
import ValidatorItem from './ValidatorItem.jsx';
import CompareColumnFooter from './CompareColumnFooter.jsx';

const renderField = (props, field) => {
  const value = props.property[field.id];

  if (value === undefined) {
    return '-';
  } else if (typeof value === 'object' && field.type !== 'date') {
    return (
      <div className="flex-col center">
        <span className="text-ellipsis">
          {value.primary}
        </span>
        <span className="secondary">
          {value.secondary}
        </span>
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
        error={props.property.error}
        errorClass={props.property.errorClass}
      />
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
          month="long"
          day="numeric"
          hour="2-digit"
          minute="2-digit"
        />
      );
    case 'boolean':
      return value ? 'Yep' : 'Nope';
    case 'percent':
      return <IntlNumber value={value} format="percentage" />;
    default:
      return value;
  }
};

const CompareColumn = props =>
  (<ul
    className={classnames({
      'mask1 compare-column default-column': true,
      [`${props.property.errorClass}-border`]: !props.property.isValid,
      'success-border': props.property.isValid,
    })}
    style={props.style}
  >
    {props.fields.map(field =>
      (<li
        key={field.id}
        className={classnames({
          'text-ellipsis': true,
          hovered: props.hovered === field.id,
        })}
        onMouseEnter={() => props.onHoverEnter(field.id)}
        onMouseLeave={props.onHoverLeave}
      >
        {renderField(props, field)}
      </li>),
    )}
    <CompareColumnFooter
      id={props.property._id}
      deleteProperty={props.deleteProperty}
    />
  </ul>);

CompareColumn.propTypes = {
  property: PropTypes.objectOf(PropTypes.any).isRequired,
  fields: PropTypes.arrayOf(PropTypes.object).isRequired,
  style: PropTypes.objectOf(PropTypes.any),
  onHoverEnter: PropTypes.func.isRequired,
  onHoverLeave: PropTypes.func.isRequired,
  hovered: PropTypes.string,
  deleteProperty: PropTypes.func.isRequired,
};

CompareColumn.defaultProps = {
  style: {},
  hovered: undefined,
};

export default CompareColumn;
