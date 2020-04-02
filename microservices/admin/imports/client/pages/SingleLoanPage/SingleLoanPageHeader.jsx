import React from 'react';

import { LOAN_CATEGORIES, LOAN_STATUS } from 'core/api/loans/loanConstants';
import { PROMOTIONS_COLLECTION } from 'core/api/promotions/promotionConstants';
import { USERS_COLLECTION } from 'core/api/users/userConstants';
import { CollectionIconLink } from 'core/components/IconLink';
import ImpersonateLink from 'core/components/Impersonate/ImpersonateLink';
import Calculator from 'core/utils/Calculator';
import { toMoney } from 'core/utils/conversionFunctions';

import GetLoanPDF from '../../components/GetLoanPDF/GetLoanPDF';
import ResetLoanButton from '../../components/ResetLoanButton/ResetLoanButton';
import LoanStatusModifier from './LoanStatusModifier/LoanStatusModifier';
import SingleLoanPageCustomName from './SingleLoanPageCustomName';

const getUserName = ({ anonymous, user, category }) => {
  if (anonymous) {
    return <small className="secondary">&nbsp;- Anonyme</small>;
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

  return <small className="secondary">&nbsp;- Pas de compte</small>;
};

const SingleLoanPageHeader = ({
  loan,
  withPdf = true,
  withCustomName = true,
}) => {
  const { user, status, name } = loan;
  const userName = getUserName(loan);
  const loanValue = Calculator.selectLoanValue({ loan });

  return (
    <div className="single-loan-page-header">
      <div className="left">
        <div className="left-top">
          <ImpersonateLink user={user} className="impersonate-link" />
          <h1 className="mr-8">
            {`${name} - ${
              loanValue > 0
                ? `PH de CHF ${toMoney(loanValue)}`
                : 'Pas de plan financier'
            }`}
          </h1>
          <h2 className="flex center-align mr-8">{userName}</h2>
          <LoanStatusModifier loan={loan} />
        </div>

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
