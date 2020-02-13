import React, { useState } from 'react';

import ConfirmMethod from 'core/components/ConfirmMethod';
import RadioTabs from 'core/components/RadioButtons/RadioTabs';
import { addBorrower } from 'core/api/methods';
import {
  getBorrowerFinanceArray,
  getBorrowerInfoArray,
  getBorrowerIncomeArray,
  getBorrowerFortuneArray,
  getBorrowerInsuranceArray,
} from 'core/arrays/BorrowerFormArray';
import BorrowersTabForm from './BorrowersTabForm';

const personalArray = [
  () => [
    {
      type: 'h3',
      id: 'info',
      ignore: true,
      required: false,
      className: 'v-align-personal',
    },
  ],
  getBorrowerInfoArray,
];

const options = [
  {
    id: 'all',
    label: 'Tout',
    funcs: [
      ...personalArray,
      getBorrowerIncomeArray,
      getBorrowerFortuneArray,
      getBorrowerInsuranceArray,
    ],
  },
  {
    id: 'info',
    label: 'Perso',
    funcs: personalArray,
  },
  // {
  //   id: 'finance',
  //   label: 'Finances',
  //   funcs: [
  //     getBorrowerIncomeArray,
  //     getBorrowerFortuneArray,
  //     getBorrowerInsuranceArray,
  //   ],
  // },
  {
    id: 'incomeAndExpenses',
    label: 'Charges & revenus',
    funcs: [getBorrowerIncomeArray],
  },
  {
    id: 'fortune',
    label: 'Fortune & prévoyance',
    funcs: [getBorrowerFortuneArray, getBorrowerInsuranceArray],
  },
];

const BorrowersTab = props => {
  const [formFilter, setFormFilter] = useState('all');
  const { loan } = props;
  const { borrowers = [], Calculator } = loan;

  return (
    <div style={{ position: 'relative' }}>
      <ConfirmMethod
        disabled={borrowers.length >= 2}
        method={() => addBorrower.run({ loanId: loan._id })}
        label="Ajouter emprunteur"
        buttonProps={{
          raised: true,
          primary: true,
          style: { position: 'absolute', right: 8, top: 0, zIndex: 1 },
        }}
      />

      <div style={{ marginBottom: 16 }}>
        <RadioTabs
          options={options}
          value={formFilter}
          onChange={setFormFilter}
        />
      </div>

      {borrowers && borrowers.length ? (
        <div className="borrower-forms" key={formFilter}>
          {borrowers.map((borrower, index) => (
            <BorrowersTabForm
              borrower={borrower}
              borrowers={borrowers}
              index={index}
              key={borrower._id}
              Calculator={Calculator}
              funcs={options.find(({ id }) => id === formFilter).funcs}
            />
          ))}
        </div>
      ) : (
        <h2 className="secondary">Pas d'emprunteurs</h2>
      )}
    </div>
  );
};

export default BorrowersTab;
