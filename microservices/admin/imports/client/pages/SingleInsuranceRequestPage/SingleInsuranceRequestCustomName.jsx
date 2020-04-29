import React from 'react';

import { insuranceRequestUpdate } from 'core/api/insuranceRequests/methodDefinitions';
import ClickToEditField from 'core/components/ClickToEditField';

const SingleInsuranceRequestCustomName = ({ insuranceRequest }) => {
  const { _id: insuranceRequestId, customName } = insuranceRequest;
  return (
    <h3 className="secondary mt-0">
      <ClickToEditField
        value={customName}
        onSubmit={value =>
          insuranceRequestUpdate.run({
            insuranceRequestId,
            object: { customName: value },
          })
        }
        placeholder="Ajouter un nom..."
      />
    </h3>
  );
};

export default SingleInsuranceRequestCustomName;
