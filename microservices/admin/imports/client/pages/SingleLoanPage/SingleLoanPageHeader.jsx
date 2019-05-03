// @flow
import React from 'react';
import uniqBy from 'lodash/uniqBy';
import { shouldUpdate } from 'recompose';

import T, { IntlNumber } from 'core/components/Translation';
import StatusLabel from 'core/components/StatusLabel';
import { CollectionIconLink } from 'core/components/IconLink';
import Calculator from 'core/utils/Calculator';
import {
  PROMOTIONS_COLLECTION,
  LOANS_COLLECTION,
  LOAN_STATUS,
  USERS_COLLECTION,
} from 'core/api/constants';
import { sendNegativeFeedbackToAllLenders } from 'core/api';
import ImpersonateLink from 'core/components/Impersonate/ImpersonateLink';
import { arePathsUnequal } from 'core/utils/reactFunctions';
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

const SingleLoanPageHeader = ({ loan }: SingleLoanPageHeaderProps) => {
  const { user } = loan;

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
          {user ? (
            <CollectionIconLink
              relatedDoc={{ ...user, collection: USERS_COLLECTION }}
            />
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
        {loan.customName && !loan.hasPromotion && (
          <h3 className="secondary" style={{ marginTop: 0 }}>
            {loan.customName}
          </h3>
        )}
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
};

export default shouldUpdate(arePathsUnequal([
  'loan.name',
  'loan.user._id',
  'loan.status',
  'loan.structure.wantedLoan',
  'loan.selectedStructure',
]))(SingleLoanPageHeader);
