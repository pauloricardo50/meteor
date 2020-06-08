import React, { useMemo, useState } from 'react';

import {
  getBorrowerFortuneArray,
  getBorrowerIncomeArray,
  getBorrowerInfoArray,
  getBorrowerInsuranceArray,
} from 'core/arrays/BorrowerFormArray';
import BorrowerAdder from 'core/components/BorrowerAdder/BorrowerAdder';
import Button from 'core/components/Button';
import Icon from 'core/components/Icon';
import RadioTabs from 'core/components/RadioButtons/RadioTabs';
import { Percent } from 'core/components/Translation';
import { getCountedArray } from 'core/utils/formArrayHelpers';
import { getPercent } from 'core/utils/general';

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

const baseOptions = [
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

const getPercentage = (funcs, borrowers) => {
  const countedArray = borrowers.reduce((arr, borrower) => {
    const formArray = funcs.reduce(
      (a, func) => [
        ...a,
        ...func({ borrowers, borrowerId: borrower._id, borrower }),
      ],
      [],
    );

    return [...arr, ...getCountedArray(formArray, borrower)];
  }, []);

  return getPercent(countedArray);
};

const BorrowersTab = props => {
  const [formFilter, setFormFilter] = useState('all');
  const { loan, Calculator } = props;
  const { borrowers = [], _id: loanId, userCache: { _id: userId } = {} } = loan;
  const options = useMemo(
    () =>
      baseOptions
        .map(item => ({
          ...item,
          percent: getPercentage(item.funcs, borrowers),
        }))
        .map(item => ({
          ...item,
          label: (
            <span>
              {item.label}&nbsp;-&nbsp;
              <Percent rounded value={item.percent} />
            </span>
          ),
        })),
    [borrowers],
  );

  return (
    <div style={{ position: 'relative' }}>
      <BorrowerAdder
        disabled={borrowers.length >= 2}
        loanId={loanId}
        userId={userId}
        TriggerComponent={
          <Button
            label="Emprunteur"
            raised
            primary
            style={{ position: 'absolute', right: 8, top: 0, zIndex: 1 }}
            icon={<Icon type="add" />}
          />
        }
      />

      <div style={{ marginBottom: 16 }} className="flex-col center-align">
        <b htmlFor="" style={{ margin: 'auto' }}>
          Afficher
        </b>
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
              loanId={loanId}
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
