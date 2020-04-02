import React from 'react';

import { loanUpdate } from 'core/api/loans/';
import ClickToEditField from 'core/components/ClickToEditField';
import Icon from 'core/components/Icon';

const SingleLoanPageCustomName = ({ customName, loanId }) => (
  <h3 className="secondary">
    <ClickToEditField
      value={customName}
      onSubmit={value =>
        loanUpdate.run({ loanId, object: { customName: value } })
      }
      placeholder="Ajouter un nom..."
    >
      {({ isEditing, value }) =>
        isEditing ? (
          <Icon
            type="warning"
            tooltip="Attention, sera visible pour le client"
            color="red"
          />
        ) : (
          value
        )
      }
    </ClickToEditField>
  </h3>
);

export default SingleLoanPageCustomName;
