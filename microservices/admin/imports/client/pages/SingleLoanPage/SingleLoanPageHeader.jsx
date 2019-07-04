// @flow
import React from 'react';
import uniqBy from 'lodash/uniqBy';

import T, { IntlNumber } from 'core/components/Translation';
import StatusLabel from 'core/components/StatusLabel';
import { CollectionIconLink } from 'core/components/IconLink';
import Calculator from 'core/utils/Calculator';
import {
  PROMOTIONS_COLLECTION,
  LOANS_COLLECTION,
  LOAN_STATUS,
  USERS_COLLECTION,
  LOAN_CATEGORIES,
} from 'core/api/constants';
import { sendNegativeFeedbackToAllLenders } from 'core/api';
import ImpersonateLink from 'core/components/Impersonate/ImpersonateLink';
import GetLoanPDF from '../../components/GetLoanPDF/GetLoanPDF';
import SingleLoanPageCustomName from './SingleLoanPageCustomName';
import ResetLoanButton from '../../components/ResetLoanButton/ResetLoanButton';

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

const requiresRevenueStatus = status =>
  [LOAN_STATUS.CLOSING, LOAN_STATUS.BILLING, LOAN_STATUS.FINALIZED].includes(status);

const additionalActions = loan => (status, prevStatus) => {
  switch (status) {
  case LOAN_STATUS.UNSUCCESSFUL:
    return sendFeedbackToAllLenders(loan);
  default:
    break;
  }

  if (!requiresRevenueStatus(prevStatus) && requiresRevenueStatus(status)) {
    const confirm = window.confirm('Attention, ce dossier requiert maintenant des revenus précis, veuillez les saisir dans l\'onglet "Revenus",');
  }

  return Promise.resolve();
};

const getUserName = ({ anonymous, user, category }) => {
  if (anonymous) {
    return (
      <small className="secondary">
        {' - '}
        Anonyme
      </small>
    );
  }

  if (user) {
    return (
      <CollectionIconLink
        relatedDoc={{ ...user, collection: USERS_COLLECTION }}
      />
    );
  }

  if (category === LOAN_CATEGORIES.PREMIUM) {
    return null;
  }

  return (
    <small className="secondary">
      {' - '}
      Pas d'utilisateur
    </small>
  );
};

const SingleLoanPageHeader = ({
  loan,
  withPdf = true,
  withCustomName = true,
}: SingleLoanPageHeaderProps) => {
  const { user, status } = loan;
  const userName = getUserName(loan);
  return (
    <div className="single-loan-page-header">
      <div className="left">
        <h1>
          <ImpersonateLink user={user} className="impersonate-link" />
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
          {userName}

          <StatusLabel
            collection={LOANS_COLLECTION}
            status={loan.status}
            allowModify
            docId={loan._id}
            additionalActions={additionalActions(loan)}
          />
        </h1>
        {withCustomName && !loan.hasPromotion && (
          <SingleLoanPageCustomName
            customName={loan.customName}
            loanId={loan._id}
          />
        )}
        {loan.hasPromotion && (
          <CollectionIconLink
            relatedDoc={{
              ...loan.promotions[0],
              collection: PROMOTIONS_COLLECTION,
            }}
          />
        )}
        {loan.financedPromotion && (
          <CollectionIconLink
            relatedDoc={{
              ...loan.financedPromotion,
              collection: PROMOTIONS_COLLECTION,
            }}
          />
        )}
      </div>
      {withPdf && (
        <div className="right">
          <GetLoanPDF loan={loan} />
        </div>
      )}
      {status === LOAN_STATUS.TEST && (
        <div className="right">
          <ResetLoanButton loan={loan} />
        </div>
      )}
    </div>
  );
};

export default SingleLoanPageHeader;
