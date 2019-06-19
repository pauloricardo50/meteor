// @flow
import React from 'react';

import ClickToEditField from 'core/components/ClickToEditField';
import { loanUpdate } from 'core/api/loans/index';
import Icon from 'core/components/Icon';

type SingleLoanPageCustomNameProps = {};

const SingleLoanPageCustomName = ({
  customName,
  loanId,
}: SingleLoanPageCustomNameProps) => (
  <h3 className="secondary">
    <ClickToEditField
      value={customName}
      onSubmit={value =>
        loanUpdate.run({ loanId, object: { customName: value } })
      }
      placeholder="Ajouter un nom..."
    >
      {({ isEditing, value }) =>
        (isEditing ? (
          <Icon
            type="warning"
            tooltip="Attention, sera visible pour le client"
            color="red"
          />
        ) : (
          value
        ))
      }
    </ClickToEditField>
  </h3>
);

export default SingleLoanPageCustomName;
