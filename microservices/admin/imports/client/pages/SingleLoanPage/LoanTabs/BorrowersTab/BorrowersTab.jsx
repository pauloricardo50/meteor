import React, { useState } from 'react';

import Tabs from 'core/components/Tabs';
import PercentWithStatus from 'core/components/PercentWithStatus';
import ConfirmMethod from 'core/components/ConfirmMethod';
import RadioTabs from 'core/components/RadioButtons/RadioTabs';
import { addBorrower } from 'core/api/methods';
import Calculator from 'core/utils/Calculator';
import SingleBorrowerTab from './SingleBorrowerTab';
import BorrowersTabForm from './BorrowersTabForm';

const borrowersTabLabel = (borrower, index) => {
  const progress = Calculator.personalInfoPercent({ borrowers: borrower });
  return (
    <span className="single-loan-page-tabs-label">
      {borrower.name || `Emprunteur ${index + 1}`}
      &nbsp;&bull;&nbsp;
      <PercentWithStatus
        status={progress < 1 ? null : undefined}
        value={progress}
        rounded
      />
    </span>
  );
};

const options = [
  { id: 'all', label: 'Tout' },
  { id: 'info', label: 'Perso' },
  { id: 'finance', label: 'Finances' },
  { id: 'incomeAndExpenses', label: 'Charges & revenus' },
  { id: 'fortune', label: 'Fortune & prévoyance' },
];

const BorrowersTab = props => {
  const [formFilter, setFormFilter] = useState('all');
  const { loan, Calculator } = props;
  const { borrowers = [] } = loan;

  return (
    <div style={{ position: 'relative' }}>
      <ConfirmMethod
        disabled={borrowers.length >= 2}
        method={() => addBorrower.run({ loanId: loan._id })}
        label="Ajouter emprunteur"
        buttonProps={{
          raised: true,
          primary: true,
          style: { position: 'absolute', right: 8, top: 0 },
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
        <div className="borrower-forms">
          {borrowers.map((borrower, index) => (
            <BorrowersTabForm
              borrower={borrower}
              borrowers={borrowers}
              index={index}
              key={borrower._id}
              formFilter={formFilter}
              Calculator={Calculator}
            />
          ))}
        </div>
      ) : (
        // <Tabs
        //   tabs={borrowers.map((borrower, i) => ({
        //     id: borrower._id,
        //     label: borrowersTabLabel(borrower, i),
        //     content: (
        //       <SingleBorrowerTab
        //         {...props}
        //         borrower={borrower}
        //         key={borrower._id}
        //       />
        //     ),
        //   }))}
        // />
        <h2 className="secondary">Pas d'emprunteurs</h2>
      )}
    </div>
  );
};

export default BorrowersTab;
