// @flow
import React from 'react';
import Calculator from 'core/utils/Calculator';
import { Percent } from 'core/components/Translation';

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
              value={Calculator.getBorrowerCompletion({
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
    label: 'Mandat signé',
    value: () => 'Non',
  },
  {
    label: 'Documents',
    value: (loan) => {
      const { total, current } = Calculator.filesProgress({ loan });

      return `${current}/${total}`;
    },
  },
];

const LoanStatusCheck = ({ loan }: LoanStatusCheckProps) => (
  <div className="loan-status-check card1 card-top">
    {statusChecks.map(({ label, value }) => (
      <h4 className="status-check" key={label}>
        <span className="secondary">{label}</span>
        :&nbsp;
        {value(loan)}
      </h4>
    ))}
  </div>
);

export default LoanStatusCheck;
