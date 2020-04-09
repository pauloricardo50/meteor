import React from 'react';
import startCase from 'lodash/startCase';
import moment from 'moment';

import { toMoney } from './conversionFunctions';

const renderObject = (key, obj) => {
  const value = obj[key];
  const stringKey = startCase(key);

  switch (typeof value) {
    case 'object':
      if (!value || Object.keys(value).length === 0) {
        return null;
      }
      if (value.getMonth) {
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
          <ul>
            {value && Object.keys(value).map(k => renderObject(k, value))}
          </ul>
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
