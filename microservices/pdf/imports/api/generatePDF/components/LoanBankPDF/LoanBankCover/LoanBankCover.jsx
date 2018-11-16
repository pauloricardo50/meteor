// @flow
import React from 'react';
import moment from 'moment';
import { T } from 'core/components/Translation/Translation';
import LoanBankPage from '../LoanBankPage';

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

const loanInfo = (loan) => {
  const {
    name,
    general: { residenceType, purchaseType },
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
    </div>
  );
};

const LoanBankCover = ({ loan }: LoanBankCoverProps) => (
  <LoanBankPage className="cover-page" fullHeight>
    {loanInfo(loan)}
    {footer(loan.user.assignedEmployee)}
  </LoanBankPage>
);

export default LoanBankCover;
