// @flow
import React from 'react';
import Link from 'core/components/Link';

import T, { IntlNumber } from 'core/components/Translation';
import StatusLabel from 'core/components/StatusLabel';
import { CollectionIconLink } from 'core/components/IconLink';
import Calculator from 'core/utils/Calculator';
import { PROMOTIONS_COLLECTION, LOANS_COLLECTION } from 'core/api/constants';

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
      {loan.user ? (
        <Link to={`/users/${loan.user._id}`}>
          <small className="secondary">
            {' - '}
            {loan.user.name}
            {loan.user.phoneNumbers && `, ${loan.user.phoneNumbers}`}
          </small>
        </Link>
      ) : (
        <small className="secondary">
          {' - '}
          Pas d'utilisateur
        </small>
      )}

      <StatusLabel
        collection={LOANS_COLLECTION}
        status={loan.status}
        allowModify
        docId={loan._id}
      />
    </h1>
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
