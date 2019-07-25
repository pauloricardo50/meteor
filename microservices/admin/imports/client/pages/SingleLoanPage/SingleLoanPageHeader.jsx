// @flow
import React from 'react';

import T, { IntlNumber } from 'core/components/Translation';
import { CollectionIconLink } from 'core/components/IconLink';
import Calculator from 'core/utils/Calculator';
import {
  PROMOTIONS_COLLECTION,
  LOAN_STATUS,
  USERS_COLLECTION,
  LOAN_CATEGORIES,
} from 'core/api/constants';
import ImpersonateLink from 'core/components/Impersonate/ImpersonateLink';
import GetLoanPDF from '../../components/GetLoanPDF/GetLoanPDF';
import SingleLoanPageCustomName from './SingleLoanPageCustomName';
import ResetLoanButton from '../../components/ResetLoanButton/ResetLoanButton';
import LoanStatusModifier from './LoanStatusModifier/LoanStatusModifier';

type SingleLoanPageHeaderProps = {};

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

          <LoanStatusModifier loan={loan} />
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
