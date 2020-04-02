import React from 'react';

import Loans from '../../../../api/loans';
import UpdateField from '../../../UpdateField';
import FinancingDataContainer from '../containers/FinancingDataContainer';
import FinancingCollapser from './FinancingCollapser';

const FinancingDetails = props => {
  const { loan } = props;
  return (
    <div className="financing-details">
      <FinancingCollapser {...props} />
      <UpdateField
        doc={loan}
        fields={['residenceType']}
        collection={Loans}
        style={{ minWidth: 200 }}
      />
    </div>
  );
};

export default FinancingDataContainer(FinancingDetails);
