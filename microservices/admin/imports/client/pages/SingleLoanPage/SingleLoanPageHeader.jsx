// @flow
import React from 'react';

import T, { IntlNumber } from 'core/components/Translation';
import Calculator from 'core/utils/Calculator';
import { getUserDisplayName } from 'core/utils/userFunctions';

type SingleLoanPageHeaderProps = {};

const SingleLoanPageHeader = ({ loan }: SingleLoanPageHeaderProps) => (
  <h1>
    <T
      id="SingleLoanPageHeader.title"
      values={{
        name: loan.name || 'Demande de Prêt',
        value: (
          <IntlNumber
            value={Calculator.getEffectiveLoan({ loan })}
            format="money"
          />
        ),
      }}
    />
    <small className="secondary">
      {' - '}
      {getUserDisplayName(loan.user)}
      {loan.user.phoneNumbers && `, ${loan.user.phoneNumbers}`}
    </small>
  </h1>
);

export default SingleLoanPageHeader;
