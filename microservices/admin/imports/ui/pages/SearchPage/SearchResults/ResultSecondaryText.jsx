import React from 'react';
import PropTypes from 'prop-types';
import { T, IntlNumber } from 'core/components/Translation';
import FullDate from 'core/components/dateComponents/FullDate';

const ResultSecondaryText = ({ infos }) =>
  Object.keys(infos).map((fieldName) => {
    const fieldValue = infos[fieldName];

    if (fieldValue instanceof Date) {
      return (
        <span key={fieldName}>
          <FullDate translationId={`general.${fieldName}`} date={fieldValue} />
          {', '}
        </span>
      );
    }

    if (fieldName === 'value') {
      return (
        <span key={fieldName}>
          <T id={`general.${fieldName}`} />
          {': '}
          <IntlNumber value={fieldValue} format="money" />
          {', '}
        </span>
      );
    }

    if (fieldName === 'assignedTo' && fieldValue === 'unassigned') {
      return (
        fieldValue && (
          <span key={fieldName}>
            <T id="general.unassigned" />
            {', '}
          </span>
        )
      );
    }

    return (
      fieldValue && (
        <span key={fieldName}>
          <T id={`general.${fieldName}`} />
          {`: ${fieldValue}, `}
        </span>
      )
    );
  });

ResultSecondaryText.propTypes = {
  infos: PropTypes.object,
};

ResultSecondaryText.defaultTypes = {
  infos: {},
};

export default ResultSecondaryText;
