// @flow
import React from 'react';
import Link from 'core/components/Link';

import T, { IntlNumber } from 'core/components/Translation';
import UpdateField from 'core/components/UpdateField';
import { CollectionIconLink } from 'core/components/IconLink';
import Calculator from 'core/utils/Calculator';
import { PROMOTIONS_COLLECTION } from 'core/api/constants';
import DateModifier from 'core/components/DateModifier';
import { LOANS_COLLECTION } from 'imports/core/api/constants';

type SingleLoanPageHeaderProps = {};

const SingleLoanPageHeader = ({ loan }: SingleLoanPageHeaderProps) => (
  <div className="single-loan-page-header">
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
      <UpdateField doc={loan} fields={['status']} />
    </h1>
    <div className="single-loan-date-modifiers">
      {['signingDate', 'closingDate'].map(dateType => (
        <DateModifier
          collection={LOANS_COLLECTION}
          doc={loan}
          field={dateType}
          key={`${loan._id}${dateType}`}
        />
      ))}
    </div>
    {loan.hasPromotion && (
      <CollectionIconLink
        relatedDoc={{
          ...loan.promotions[0],
          collection: PROMOTIONS_COLLECTION,
        }}
      />
    )}
  </div>
);

export default SingleLoanPageHeader;
