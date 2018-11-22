// @flow
import React from 'react';
import moment from 'moment';
import T from 'core/components/Translation';
import PdfPage from '../../PdfPage';

type LoanBankCoverProps = {
  loan: Object,
};

const footer = ({ name, email, phoneNumbers }) => (
  <div className="cover-footer">
    <div className="assigned-employee">
      <div>{name}</div>
      <div>{email}</div>
      <div>{phoneNumbers[0]}</div>
    </div>
    <div>Le Grand-Saconnex, le {moment(new Date()).format('DD.MM.YYYY')}</div>
  </div>
);

const borrowersNames = borrowers => (
  <h4>{borrowers.map(({ name }) => name).join(' et ')}</h4>
);

const loanInfo = ({ loan, anonymous = false }) => {
  const {
    name,
    general: { residenceType, purchaseType },
    borrowers,
  } = loan;
  const { address1, zipCode, city } = loan.structure.property;
  return (
    <div className="loan-info">
      <h1>Financement hypothécaire</h1>
      <h2>{name}</h2>
      <h2>
        <T id={`PDF.purchaseType.${purchaseType}`} />{' '}
        <T id={`PDF.residenceType.${residenceType}`} />
      </h2>
      <h3>{`${address1}, ${zipCode} ${city}`}</h3>
      {!anonymous && borrowersNames(borrowers)}
    </div>
  );
};

const LoanBankCover = ({
  loan,
  pageNb,
  pageCount,
  options,
}: LoanBankCoverProps) => (
  <PdfPage
    className="cover-page"
    fullHeight
    pageNb={pageNb}
    pageCount={pageCount}
  >
    {loanInfo({ loan, anonymous: options && options.anonymous })}
    {footer(loan.user.assignedEmployee)}
  </PdfPage>
);

export default LoanBankCover;
