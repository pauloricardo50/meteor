// @flow
import React from 'react';
import { Link } from 'react-router-dom';

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
    <Link to={`/users/${loan.user._id}`}>
      <small className="secondary">
        {' - '}
        {loan.user.name}
        {loan.user.phoneNumbers && `, ${loan.user.phoneNumbers}`}
      </small>
    </Link>
  </h1>
);

export default SingleLoanPageHeader;
