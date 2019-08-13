import React from 'react';

import { withProps } from 'recompose';

import Calculator from 'core/utils/Calculator';
import T from 'core/components/Translation';
import PercentWithStatus from 'core/components/PercentWithStatus';
import { borrowerUpdate } from 'core/api/methods/index';
import BorrowerAdder from '../../../../components/BorrowerAdder';
import BorrowerForm from './BorrowerForm';

const createParams = ({ id, ...rest }, idKey) => ({ [idKey]: id, ...rest });

const getSimpleParams = (rawParams, key) => {
  const { object = {}, id } = rawParams;

  if (Object.keys(object).includes(key)) {
    const obj = object[key] ? [{ value: object[key] }] : [];
    return { borrowerId: id, object: { [key.split('Simple')[0]]: obj } };
  }

  return undefined;
};

const overrides = {
  updateFunc: idKey => (rawParams) => {
    const simpleParams = [
      'insurance2Simple',
      'bank3ASimple',
      'insurance3ASimple',
      'insurance3BSimple',
    ]
      .map(key => getSimpleParams(rawParams, key))
      .filter(x => x);

    const params = simpleParams.length
      ? simpleParams[0]
      : createParams(rawParams, idKey);

    return borrowerUpdate.run(params);
  },
};

const getBorrowersTabs = ({ loan }) => {
  const { borrowers, userFormsEnabled, simpleBorrowersForm } = loan;
  const twoBorrowers = borrowers.length === 2;

  return [
    ...borrowers.map((borrower, index) => {
      const progress = Calculator.personalInfoPercentSimple({
        borrowers: borrower,
        loan,
        simple: simpleBorrowersForm,
      });

      return {
        id: borrower._id,
        content: (
          <BorrowerForm
            borrowerId={borrowers[index]._id}
            userFormsEnabled={userFormsEnabled}
            loan={loan}
            key={borrowers[index]._id}
            overrides={simpleBorrowersForm && overrides}
            simple={simpleBorrowersForm}
          />
        ),
        label: (
          <span className="borrower-tab-labels">
            {borrower.name || (
              <T id="BorrowerHeader.title" values={{ index: index + 1 }} />
            )}
            {borrowers.length > 1 && (
              <>
                &nbsp;&bull;&nbsp;
                <PercentWithStatus
                  value={progress}
                  status={progress < 1 ? null : undefined}
                  rounded
                />
              </>
            )}
          </span>
        ),
      };
    }),
    twoBorrowers
      ? null
      : {
        id: 'borrower2',
        content: null,
        label: <BorrowerAdder loanId={loan._id} />,
      },
  ].filter(x => x);
};

export default withProps(({ loan, simpleForm }) => ({
  tabs: getBorrowersTabs({ loan, simpleForm }),
}));
