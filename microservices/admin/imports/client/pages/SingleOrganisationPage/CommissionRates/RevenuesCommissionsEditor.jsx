import React from 'react';

import { withProps } from 'recompose';
import { COMMISSION_RATES_TYPE } from 'core/api/constants';
import CommissionsEditor from './CommissionsEditor';

export default withProps(({ commissionRates = [] }) => {
  const [commissionCommissionRates = {}] = commissionRates.filter(
    ({ type }) => type === COMMISSION_RATES_TYPE.REVENUES,
  );

  return {
    commissionRates: {
      ...commissionCommissionRates,
      type: COMMISSION_RATES_TYPE.REVENUES,
    },
    emptyState: (
      <p className="description">
        Pas de paliers de commissionnement pour l'instant
      </p>
    ),
  };
})(CommissionsEditor);
