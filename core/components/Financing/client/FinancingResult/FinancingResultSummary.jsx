import React from 'react';
import cx from 'classnames';
import { compose } from 'recompose';

import T from '../../../Translation';
import FinancingDataContainer from '../containers/FinancingDataContainer';
import SingleStructureContainer from '../containers/SingleStructureContainer';
import { ERROR_TYPES, getFinancingError } from './FinancingResultErrors';
import FinancingResultSuccess from './FinancingResultSuccess';

export const FinancingResultSummary = props => {
  const error = getFinancingError(props);

  if (error.type === ERROR_TYPES.BREAKING) {
    return (
      <p
        className={cx('error result', {
          'error-box': error.color === 'error',
          'warning-box': error.color === 'warning',
        })}
      >
        <T id={`FinancingResultErrors.${error.id}`} />
      </p>
    );
  }

  if (error.type === ERROR_TYPES.WARNING) {
    return (
      <div className="result">
        <FinancingResultSuccess {...props} className="" />

        <p
          className={cx('error warning-error', {
            'error-box': error.color === 'error',
            'warning-box': error.color === 'warning',
          })}
        >
          <T id={`FinancingResultErrors.${error.id}`} />
        </p>
      </div>
    );
  }

  return <FinancingResultSuccess {...props} />;
};

export default compose(
  FinancingDataContainer,
  SingleStructureContainer,
)(FinancingResultSummary);
