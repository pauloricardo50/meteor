import React from 'react';
import moment from 'moment';
import startCase from 'lodash/startCase';

import { toMoney } from '/imports/js/helpers/conversionFunctions';

const renderObject = (key, obj) => {
  const value = obj[key];
  const stringKey = startCase(key);

  switch (typeof value) {
    case 'object':
      if (Object.keys(value).length === 0) {
        return null;
      } else if (value.getMonth) {
        return (
          <li>
            <h4>{stringKey}</h4>
            <p>{moment(value).format('D MMM hh:mm:ss')}</p>
          </li>
        );
      }

      return (
        <div key={key}>
          <h3>{stringKey}</h3>
          <ul>{Object.keys(value).map(k => renderObject(k, value))}</ul>
        </div>
      );
    case 'number':
      return (
        <li key={key}>
          <h4>{stringKey}</h4>
          {value > 10000 ? (
            <p>{`CHF ${toMoney(value)}`}</p>
          ) : (
            <p>{`${value}`}</p>
          )}
        </li>
      );
    default:
      return (
        <li key={key}>
          <h4>{stringKey}</h4>
          <p>{`${value}`}</p>
        </li>
      );
  }
};

export default renderObject;
