import React from 'react';
import PropTypes from 'prop-types';

import { T, IntlNumber } from 'core/components/Translation';
import FullDate from 'core/components/dateComponents/FullDate';

const ResultSecondaryText = ({ infos }) =>
  Object.keys(infos)
    .map((fieldName) => {
      const fieldValue = infos[fieldName];

      if (!fieldValue) {
        return null;
      }

      if (fieldValue instanceof Date) {
        return (
          <span key={fieldName}>
            <T id={`Forms.${fieldName}`} /> <FullDate date={fieldValue} />
          </span>
        );
      }

      if (fieldName === 'value') {
        return (
          <span key={fieldName}>
            <T id={`Forms.${fieldName}`} />
            {': '}
            <IntlNumber value={fieldValue} format="money" />
          </span>
        );
      }

      if (fieldName === 'assignedTo' && fieldValue === 'unassigned') {
        return (
          <span key={fieldName}>
            <T id="Forms.unassigned" />
          </span>
        );
      }

      return (
        <span key={fieldName}>
          <T id={`Forms.${fieldName}`} />
          {`: ${fieldValue}`}
        </span>
      );
    })
    .filter(value => value)
    .reduce((accumulator, currentValue) => [accumulator, ', ', currentValue]);

ResultSecondaryText.propTypes = {
  infos: PropTypes.object,
};

ResultSecondaryText.defaultTypes = {
  infos: {},
};

export default ResultSecondaryText;
