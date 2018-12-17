// @flow
import React from 'react';
import Calculator from 'core/utils/Calculator';
import { Percent } from 'core/components/Translation';
import { LoanChecklistDialog } from 'core/components/LoanChecklist';
import { PURCHASE_TYPE } from 'core/api/constants';

type LoanStatusCheckProps = {};

const statusChecks = [
  {
    label: 'Progrès emprunteurs',
    value: ({ borrowers }) => (
      <div className="borrowers">
        {borrowers.map(borrower => (
          <span key={borrower._id}>
            {borrower.firstName}:{' '}
            <Percent
              value={Calculator.personalInfoPercent({
                borrowers: borrower,
              })}
            />
          </span>
        ))}
      </div>
    ),
  },
  {
    label: 'Progrès bien immobilier',
    value: loan => <Percent value={Calculator.propertyPercent({ loan })} />,
  },
  {
    label: 'Progrès refinancement',
    value: loan => <Percent value={Calculator.refinancingPercent({ loan })} />,
    hide: ({ purchaseType }) => purchaseType !== PURCHASE_TYPE.REFINANCING,
  },
  {
    label: 'Mandat signé',
    value: () => 'Non',
  },
  {
    label: 'Documents',
    value: loan => (
      <Percent value={Calculator.filesProgress({ loan }).percent} />
    ),
  },
];

const LoanStatusCheck = ({ loan }: LoanStatusCheckProps) => (
  <div className="loan-status-check card1">
    <div className="card-top">
      {statusChecks
        .filter(({ hide }) => (hide ? !hide(loan) : true))
        .map(({ label, value }) => (
          <h4 className="status-check" key={label}>
            <span className="secondary">{label}</span>
            :&nbsp;
            {value(loan)}
          </h4>
        ))}
    </div>
    <div className="card-bottom">
      <LoanChecklistDialog loan={loan} />
    </div>
  </div>
);

export default LoanStatusCheck;
