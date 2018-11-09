// @flow
import React from 'react';
import Link from 'core/components/Link';

import T, { IntlNumber } from 'core/components/Translation';
import UpdateField from 'core/components/UpdateField';
import Calculator from 'core/utils/Calculator';

type SingleLoanPageHeaderProps = {};

const SingleLoanPageHeader = ({ loan }: SingleLoanPageHeaderProps) => (
  <h1 className="single-loan-page-header">
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
    <UpdateField doc={loan} fields={['status']} />
  </h1>
);

export default SingleLoanPageHeader;
