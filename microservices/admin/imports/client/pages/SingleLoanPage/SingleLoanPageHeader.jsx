// @flow
import React from 'react';

import T, { IntlNumber } from 'core/components/Translation';
import Calculator from 'core/utils/Calculator';

type SingleLoanPageHeaderProps = {};

const SingleLoanPageHeader = ({ loan }: SingleLoanPageHeaderProps) => (
  <h1>
    <T
      id="SingleLoanPageHeader.title"
      values={{
        name: loan.name || <T id="general.mortgageLoan" />,
        value: (
          <IntlNumber
            value={Calculator.selectLoanValue({ loan })}
            format="money"
          />
        ),
      }}
    />
    <small className="secondary">
      {' - '}
      {loan.user.name}
      {loan.user.phoneNumbers && `, ${loan.user.phoneNumbers}`}
    </small>
  </h1>
);

export default SingleLoanPageHeader;
