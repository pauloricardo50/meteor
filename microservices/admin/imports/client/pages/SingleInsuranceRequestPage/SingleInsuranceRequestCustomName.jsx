import React from 'react';

import ClickToEditField from 'core/components/ClickToEditField';
import { insuranceRequestUpdate } from 'core/api/insuranceRequests/methodDefinitions';

const SingleInsuranceRequestCustomName = ({ insuranceRequest }) => {
  const { _id: insuranceRequestId, customName } = insuranceRequest;
  return (
    <h3 className="secondary mt-4">
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
