// @flow
import React from 'react';
import moment from 'moment';
import T from 'core/components/Translation';
import PdfPage from '../../PdfPage';
import LoanBankCoverHeader from './LoanBankCoverHeader';

type LoanBankCoverProps = {
  loan: Object,
};

const footer = ({ name, email, phoneNumbers }) => (
  <div className="cover-footer">
    <div className="assigned-employee">
      <h5 className="name">{name}</h5>
      <h5>{email}</h5>
      <h5>{phoneNumbers[0]}</h5>
    </div>
    <div>Le Grand-Saconnex, le {moment(new Date()).format('DD.MM.YYYY')}</div>
  </div>
);

const borrowersNames = borrowers => (
  <h3 className="borrowers">
    {borrowers.map(({ name }) => name).join(' et ')}
  </h3>
);

const loanInfo = ({ loan, anonymous = false }) => {
  const { name, residenceType, purchaseType, borrowers } = loan;
  const { address1, zipCode, city } = loan.structure.property;
  return (
    <div className="loan-info">
      <h1 className="title">Financement hypothécaire</h1>
      <h1 className="loan-name">{name}</h1>
      <h2 className="loan-type">
        <T id={`PDF.purchaseType.${purchaseType}`} />{' '}
        <T id={`PDF.residenceType.${residenceType}`} />
      </h2>
      <h2 className="address">{`${address1}, ${zipCode} ${city}`}</h2>
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
    <LoanBankCoverHeader />
    {loanInfo({ loan, anonymous: options && options.anonymous })}
    {footer(loan.user.assignedEmployee)}
  </PdfPage>
);

export default LoanBankCover;
