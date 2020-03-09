import React from 'react';

import T from '../../../Translation';
import { CalculatedValue } from '../FinancingSection/components/CalculatedValue';

export const FinancingResultFutureTitle = ({ borrowers = [] }) => {
  if (borrowers.length <= 1) {
    return <span className="future" />;
  }

  return (
    <span
      className="future center-align"
      style={{ flexDirection: 'row', justifyContent: 'space-between' }}
    >
      {borrowers.map(({ _id, firstName }, index) => (
        <span key={_id}>
          {firstName || (
            <T id="general.borrowerWithIndex" values={{ index: index + 1 }} />
          )}
        </span>
      ))}
    </span>
  );
};

export const FinancingResultFutureValue = ({ value, className, ...props }) => {
  const { borrowers } = props;
  const values = value(props);
  if (borrowers.length <= 1) {
    return (
      <CalculatedValue {...props} className={className} value={values[0]} />
    );
  }

  return (
    <div
      className={className}
      style={{ flexDirection: 'row', justifyContent: 'space-between' }}
    >
      {borrowers.map((b, i) => (
        <CalculatedValue key={b._id} {...props} value={values[i]} />
      ))}
    </div>
  );
};
