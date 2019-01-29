// @flow
import React from 'react';
import { injectIntl } from 'react-intl';
import uniqBy from 'lodash/uniqBy';

import Link from 'core/components/Link';
import T, { IntlNumber } from 'core/components/Translation';
import StatusLabel from 'core/components/StatusLabel';
import { CollectionIconLink } from 'core/components/IconLink';
import Calculator from 'core/utils/Calculator';
import { PROMOTIONS_COLLECTION, LOANS_COLLECTION } from 'core/api/constants';
import { LOAN_STATUS } from 'imports/core/api/constants';
import {
  makeFeedback,
  FEEDBACK_OPTIONS,
} from 'imports/core/components/OfferList/feedbackHelpers';
import { offerSendFeedback } from 'core/api';

type SingleLoanPageHeaderProps = {};

const sendFeedbackToAllLenders = ({ loan, formatMessage }) => {
  const {
    offers = [],
    structure: { property },
  } = loan;
  const promises = [];

  // Remove duplicate lenders
  const filteredOffers = uniqBy(
    offers,
    ({
      lender: {
        contact: { name },
      },
    }) => name,
  );
  const contacts = filteredOffers.map(({
    lender: {
      contact: { name },
      organisation: { name: organisationName },
    },
  }) => `${name} (${organisationName})`);

  const confirm = window.confirm(`Attention: modifier le statut du dossier à sans suite enverra automatiquememt un feedback aux prêteurs suivants:\n\n${contacts.join('\n')}\n\nValider pour envoyer les feedbacks.`);

  if (confirm) {
    filteredOffers.map((offer) => {
      const feedback = makeFeedback({
        offer: { ...offer, property },
        model: { option: FEEDBACK_OPTIONS.NEGATIVE_WITHOUT_FOLLOW_UP },
        formatMessage,
      });
      return [
        ...promises,
        offerSendFeedback.run({ offerId: offer._id, feedback, saveFeedback: false }),
      ];
    });

    return Promise.all(promises);
  }

  return Promise.resolve();
};

const additionalActions = ({ loan, formatMessage }) => (status) => {
  switch (status) {
  case LOAN_STATUS.UNSUCCESSFUL:
    return sendFeedbackToAllLenders({ loan, formatMessage });
  default:
    return Promise.resolve();
  }
};

const SingleLoanPageHeader = ({
  loan,
  intl: { formatMessage },
}: SingleLoanPageHeaderProps) => (
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
        additionalActions={additionalActions({ loan, formatMessage })}
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

export default injectIntl(SingleLoanPageHeader);
