import React from 'react';

import { LOANS_COLLECTION } from 'core/api/constants';
import FinancingDataContainer from '../containers/FinancingDataContainer';
import FinancingCollapser from './FinancingCollapser';
import UpdateField from '../../../UpdateField';

const FinancingDetails = props => {
  const { loan } = props;
  return (
    <div className="financing-details">
      <FinancingCollapser {...props} />
      <UpdateField
        doc={loan}
        fields={['residenceType']}
        collection={LOANS_COLLECTION}
        style={{ minWidth: 200 }}
      />
    </div>
  );
};

export default FinancingDataContainer(FinancingDetails);
