import React from 'react';

import { LOAN_CATEGORIES } from 'core/api/loans/loanConstants';
import { USERS_COLLECTION } from 'core/api/users/userConstants';
import { CollectionIconLink } from 'core/components/IconLink';
import ImpersonateLink from 'core/components/Impersonate/ImpersonateLink';
import Calculator from 'core/utils/Calculator';
import { toMoney } from 'core/utils/conversionFunctions';

import GetLoanPDF from '../../components/GetLoanPDF/GetLoanPDF';
import LoanStatusModifier from './LoanStatusModifier/LoanStatusModifier';
import SingleLoanPageCustomName from './SingleLoanPageCustomName';
import SingleLoanPageHeaderPromotion from './SingleLoanPageHeaderPromotion';

const getUserName = ({ anonymous, userCache, category }) => {
  if (anonymous) {
    return <small className="secondary">&nbsp;- Anonyme</small>;
  }

  if (userCache?._id) {
    return (
      <CollectionIconLink
        relatedDoc={{ ...userCache, _collection: USERS_COLLECTION }}
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
  const { userCache, name } = loan;
  const userName = getUserName(loan);
  const loanValue = Calculator.selectLoanValue({ loan });

  return (
    <div className="single-loan-page-header">
      <div className="left">
        <div className="left-top">
          <ImpersonateLink user={userCache} className="impersonate-link" />
          <h1 className="m-0 mr-8">
            {`${name} - ${
              loanValue > 0
                ? `PH de CHF ${toMoney(loanValue)}`
                : 'Pas de plan financier'
            }`}
          </h1>
          <h2 className="flex center-align m-0 mr-8">{userName}</h2>
          <LoanStatusModifier loan={loan} />
        </div>

        {withCustomName && !loan.hasPromotion && (
          <SingleLoanPageCustomName
            customName={loan.customName}
            loanId={loan._id}
          />
        )}
        {loan.hasPromotion && <SingleLoanPageHeaderPromotion loan={loan} />}
        {loan.financedPromotion && (
          <CollectionIconLink relatedDoc={loan.financedPromotion} />
        )}
      </div>
      {withPdf && (
        <div className="right">
          <GetLoanPDF loan={loan} />
        </div>
      )}
    </div>
  );
};

export default SingleLoanPageHeader;
