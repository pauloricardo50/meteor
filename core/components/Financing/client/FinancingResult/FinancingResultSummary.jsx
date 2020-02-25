import React from 'react';
import { compose } from 'recompose';

import T from '../../../Translation';
import SingleStructureContainer from '../containers/SingleStructureContainer';
import FinancingDataContainer from '../containers/FinancingDataContainer';
import { getFinancingError, ERROR_TYPES } from './FinancingResultErrors';
import FinancingResultSuccess from './FinancingResultSuccess';

const FinancingResultSummary = props => {
  const error = getFinancingError(props);

  if (error.type === ERROR_TYPES.BREAKING) {
    return (
      <p className="error error-box result">
        <T id={`FinancingResultErrors.${error.id}`} />
      </p>
    );
  }

  if (error.type === ERROR_TYPES.WARNING) {
    return (
      <div className="result">
        <FinancingResultSuccess {...props} className="" />

        <p className="error error-box warning-error">
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
