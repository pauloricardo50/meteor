// @flow
import React from 'react';
import uniqBy from 'lodash/uniqBy';

import Link from 'core/components/Link';
import T, { IntlNumber } from 'core/components/Translation';
import StatusLabel from 'core/components/StatusLabel';
import { CollectionIconLink } from 'core/components/IconLink';
import Calculator from 'core/utils/Calculator';
import { PROMOTIONS_COLLECTION, LOANS_COLLECTION } from 'core/api/constants';
import { LOAN_STATUS } from 'core/api/constants';
import { sendNegativeFeedbackToAllLenders } from 'core/api';
import GetLoanPDF from '../../components/GetLoanPDF/GetLoanPDF';

type SingleLoanPageHeaderProps = {};

const sendFeedbackToAllLenders = (loan) => {
  const { _id: loanId, offers = [] } = loan;

  // Don't show duplicate lenders
  const contacts = uniqBy(
    offers,
    ({
      lender: {
        contact: { name },
      },
    }) => name,
  ).map(({
    lender: {
      contact: { name },
      organisation: { name: organisationName },
    },
  }) => `${name} (${organisationName})`);

  if (offers.length) {
    const confirm = window.confirm(`Attention: modifier le statut du dossier à sans suite enverra automatiquememt un feedback aux prêteurs suivants:\n\n${contacts.join('\n')}\n\nValider pour envoyer les feedbacks.`);

    if (confirm) {
      return sendNegativeFeedbackToAllLenders.run({ loanId });
    }
  }

  return Promise.resolve();
};

const additionalActions = loan => (status) => {
  switch (status) {
  case LOAN_STATUS.UNSUCCESSFUL:
    return sendFeedbackToAllLenders(loan);
  default:
    return Promise.resolve();
  }
};

const SingleLoanPageHeader = ({ loan }: SingleLoanPageHeaderProps) => (
  <div className="single-loan-page-header">
    <div className="left">
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
          additionalActions={additionalActions(loan)}
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
    <div className="right">
      <GetLoanPDF loan={loan} />
    </div>
  </div>
);

export default SingleLoanPageHeader;
